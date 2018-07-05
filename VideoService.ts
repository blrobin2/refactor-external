import { readFileSync } from 'fs'

import Video from './Video'
import YouTubeConnection from './YouTubeConnection'
import YouTubeGateway from './YouTubeGateway'

export default class VideoService {
  async videoList(): Promise<string> {
    const videoList: Video[] = JSON.parse(readFileSync('videos.json', 'utf8'))
      .map((h: any) => new Video(h))
    const items = await (new YouTubeConnection).listVideos(videoList.map(v => v.youtube_id))
    const youtube = new YouTubeGateway(items)

    videoList.forEach(v => v.enrichWithYouTube(youtube.item(v.youtube_id)))

    return JSON.stringify(videoList.map(v => v.toObj()))
  }
}