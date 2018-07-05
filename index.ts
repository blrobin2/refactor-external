require('dotenv').config()
import VideoService from './VideoService'

(async() => {
  try {
    const videoService = new VideoService
    const vids = await videoService.videoList();
    console.log(vids)
  } catch (e) {
    console.error(e)
  }
})()