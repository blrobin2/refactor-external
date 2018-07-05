import { google, youtube_v3 } from "googleapis"
import GoogleAuth from "./GoogleAuth"

import Video from "./Video";

export default class YouTubeConnection {
  public async listVideos(ids: Video[]): Promise<youtube_v3.Schema$Video[]> {
    const client = new GoogleAuth
    const oAuth2Client = await client.authenticate(['https://www.googleapis.com/auth/youtube'])
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