import { readFileSync } from "fs";

import VideoService from "../VideoService"
import YouTubeConnection from "../YouTubeConnection";

jest.mock("../YouTubeConnection")

describe('VideoService', () => {
  // Mock IO values to get back consistency
  YouTubeConnection.prototype.listVideos = jest.fn().mockImplementation(ids => JSON.parse(readFileSync('__tests__/data/youtube-video-list.json', 'utf8')))
  Date.now = jest.fn().mockImplementation(() => 1530807467639)

  const videoService = new VideoService

  it('gets back a list of video metadata', async () => {
    const videoList = await videoService.videoList()
    const videos = await JSON.parse(videoList)

    const v1 = videos.find((v: any) => v.youtube_id === 'Ks-_Mh1QhMc')
    const v2 = videos.find((v: any) => v.youtube_id === "ZIsgHs0w44Y")

    expect(v1.views).toBe(30000000)
    expect(v2.views).toBe(400000)

    expect(v1.monthlyViews).toBeCloseTo(0.00502, 5)
    expect(v2.monthlyViews).toBeCloseTo(0.000079, 5)
  })
})