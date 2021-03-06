export default class YouTubeGateway {
  private data: any

  // TODO: Get response to correct opbject and make Map happy
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