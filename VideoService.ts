import { readFileSync } from 'fs'
import { google, youtube_v3 } from 'googleapis'

import GoogleAuth from './GoogleAuth'

interface Video {
  youtube_id: string,
  views?: number
  monthlyViews?: number
}

export default class VideoService {
  static async videoList() {
    const videoList: Video[] = JSON.parse(readFileSync('videos.json', 'utf8'))
    const ids = videoList.map((v: any) => v.youtube_id)
    const client = new GoogleAuth
    await client.authenticate(['https://www.googleapis.com/auth/youtube'])
    const youtube = google.youtube({
      version: 'v3',
      auth: client.oAuth2Client
    })
    const res = await youtube.videos.list({
      id: ids.join(','),
      part: 'snippet, contentDetails, statistics'
    })
    const items: youtube_v3.Schema$Video[] = res.data.items || []
    ids.forEach((id: string) => {
      const video = videoList.find(v => id === v.youtube_id)
      if (!video) return
      const youtubeRecord = items.find(v => id === v.id)
      if (!youtubeRecord) return
      const viewCount = this.getViewCount(youtubeRecord)
      video.views = parseInt(viewCount, 10)
      const publishedAt = this.getPublishedAt(youtubeRecord)
      const daysAvailable = Date.now() - Date.parse(publishedAt)
      video.monthlyViews = video.views ? video.views * 365.0/daysAvailable/12 : 0
    })

    return JSON.stringify(videoList)
  }

  private static getViewCount(youtubeRecord?: youtube_v3.Schema$Video): string {
    return (youtubeRecord && youtubeRecord.statistics && youtubeRecord.statistics.viewCount) || "0";
  }

  private static getPublishedAt(youtubeRecord?: youtube_v3.Schema$Video): string {
    return (youtubeRecord && youtubeRecord.snippet && youtubeRecord.snippet.publishedAt) || Date.now().toString()
  }
}