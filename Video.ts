export default class Video {
  private data: any
  [key: string]: any

  constructor(aHash: any) {
    this.data = aHash
  }

  get youtube_id(): string {
    return this.data.youtube_id
  }

  enrichWithYouTube(youtubeItem: any) {
    this.data.views = parseInt(youtubeItem.views, 10)
    const daysAvailable = Date.now() - Date.parse(youtubeItem.published)
    this.data.monthlyViews = this.data.views * 365.0 / daysAvailable / 12
  }

  toObj() {
    return this.data
  }
}