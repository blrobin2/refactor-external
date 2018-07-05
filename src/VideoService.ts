import { readFileSync } from 'fs'

import Video from './Video'
import YouTubeConnection from './YouTubeConnection'
import YouTubeGateway from './YouTubeGateway'

export default class VideoService {
  async videoList(): Promise<string> {
    const videoList: Video[] = this.getVideoList()
    const youtube = await this.getYouTubeItems(videoList)
    videoList.forEach(video =>
      video.enrichWithYouTube(youtube.item(video.youtube_id)))

    return JSON.stringify(videoList.map(v => v.toObj()))
  }

  private getVideoList(): Video[] {
    return JSON.parse(readFileSync('videos.json', 'utf8'))
      .map((h: any) => new Video(h))
  }

  private async getYouTubeItems(videoList: Video[]): Promise<YouTubeGateway> {
    const ids = videoList.map(v => v.youtube_id)
    const items = await (new YouTubeConnection).listVideos(ids)
    return new YouTubeGateway(items)
  }
}