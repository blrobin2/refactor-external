import { youtube_v3 } from "googleapis";

export default class YouTubeGateway {
  private data: any

  constructor(response: any) {
    this.data = new Map(response.map((i: any) => [i.id, i]))
  }

  item(id: string) {
    const record = this.data.get(id)
    return {
      views: record && record.statistics && record.statistics.viewCount || "0",
      published: record && record.snippet && record.snippet.publishedAt
        || new Date().toLocaleString()
    }
  }
}