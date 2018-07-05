import { readFileSync } from 'fs'
import { youtube_v3 } from "googleapis"

import Video from './Video'
import YouTubeConnection from './YouTubeConnection'
import YouTubeGateway from './YouTubeGateway'


export default class VideoService {
  async videoList(): Promise<string> {
    const videoList: Video[] = this.getVideoList()
    const items = await this.getYouTubeItems(videoList)
    const youtube = new YouTubeGateway(items)

    videoList.forEach(video => video.enrichWithYouTube(youtube.item(video.youtube_id)))
    return JSON.stringify(videoList.map(v => v.toObj()))
  }

  private getVideoList(): Video[] {
    return JSON.parse(readFileSync('videos.json', 'utf8'))
      .map((h: any) => new Video(h))
  }

  private getYouTubeItems(videoList: Video[]): Promise<youtube_v3.Schema$Video[]> {
    const ids = videoList.map(v => v.youtube_id)
    return (new YouTubeConnection).listVideos(ids)
  }
}