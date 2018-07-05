import { readFileSync } from 'fs'
import { youtube_v3 } from 'googleapis'

import Video from './Video'
import YouTubeConnection from './YouTubeConnection'

export default class VideoService {
  async videoList() {
    const videoList: Video[] = JSON.parse(readFileSync('videos.json', 'utf8'))
    const ids = videoList.map((v: any) => v.youtube_id)
    const youtube = new YouTubeConnection
    const items = await youtube.listVideos(ids)
    ids.forEach((id: string) => {
      const video = videoList.find(v => id === v.youtube_id)
      if (!video) return
      const youtubeRecord = items.find(v => id === v.id)
      if (!youtubeRecord) return
      const viewCount = this.getViewCount(youtubeRecord)
      video.views = parseInt(viewCount, 10)
      const publishedAt = this.getPublishedAt(youtubeRecord)
      const daysAvailable = Date.now() - Date.parse(publishedAt)
      video.monthlyViews = video.views ? (video.views * 365.0/daysAvailable/12) : 0
    })

    return JSON.stringify(videoList)
  }



  private getViewCount(youtubeRecord?: youtube_v3.Schema$Video): string {
    return (youtubeRecord && youtubeRecord.statistics && youtubeRecord.statistics.viewCount) || "0";
  }

  private getPublishedAt(youtubeRecord?: youtube_v3.Schema$Video): string {
    return (youtubeRecord && youtubeRecord.snippet && youtubeRecord.snippet.publishedAt) || new Date().toLocaleString()
  }
}