import { readFileSync } from 'fs'

import Video from './Video'
import YouTubeConnection from './YouTubeConnection'
import YouTubeGateway from './YouTubeGateway'

export default class VideoService {
  async videoList(): Promise<string> {
    const videoList: Video[] = JSON.parse(readFileSync('videos.json', 'utf8')).map((h: any) => new Video(h))
    const ids = videoList.map(v => v.youtube_id)
    const items = await (new YouTubeConnection).listVideos(ids)
    const youtube = new YouTubeGateway(items)

    ids.forEach(id => {
      const video = videoList.find(v => id === v.youtube_id)
      if (!video) return
      const youtubeItem = youtube.item(id)
      if (!youtubeItem) return
      this.enrichVideo(video, youtubeItem)
    })

    return JSON.stringify(videoList.map(v => v.toObj()))
  }

  private enrichVideo(video: Video, youtubeItem: any) {
    video.views = parseInt(youtubeItem.views, 10)
    const daysAvailable = Date.now() - Date.parse(youtubeItem.published)
    video.monthlyViews = video.views ? (video.views * 365.0 / daysAvailable / 12) : 0
  }
}