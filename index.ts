require('dotenv').config()
import VideoService from './VideoService'

(async() => {
  try {
    const vids = await VideoService.videoList()
    console.log(vids)
  } catch (e) {
    console.error(e.message)
  }
})()