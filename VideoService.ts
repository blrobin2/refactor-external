import { readFileSync } from 'fs'
import { youtube_v3 } from 'googleapis'

import Video from './Video'
import YouTubeConnection from './YouTubeConnection'
import YouTubeGateway from './YouTubeGateway'

export default class VideoService {
  async videoList(): Promise<string> {
    const videoList: Video[] = JSON.parse(readFileSync('videos.json', 'utf8'))
    const ids = videoList.map(v => v.youtube_id)
    const items = await (new YouTubeConnection).listVideos(ids)
    const youtube = new YouTubeGateway(items)

    ids.forEach(id => {
      const video = videoList.find(v => id === v.youtube_id)
      if (!video) return
      video.views = parseInt(youtube.item(id).views, 10)
      const publishedAt = youtube.item(id).published
      const daysAvailable = Date.now() - Date.parse(publishedAt)
      video.monthlyViews = video.views ? (video.views * 365.0/daysAvailable/12) : 0
    })

    return JSON.stringify(videoList)
  }
}