import { google, youtube_v3 } from "googleapis"
import GoogleAuth from "./GoogleAuth"

export default class YouTubeConnection {
  public async listVideos(ids: string[]): Promise<youtube_v3.Schema$Video[]> {
    const oAuth2Client =
      await (new GoogleAuth).authenticate(['https://www.googleapis.com/auth/youtube'])
    const youtube = google.youtube({
      version: 'v3',
      auth: oAuth2Client
    })
    const res = await youtube.videos.list({
      id: ids.join(','),
      part: 'snippet, contentDetails, statistics'
    })
    return res.data.items || []
  }
}