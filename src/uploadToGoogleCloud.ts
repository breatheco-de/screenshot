import { Storage } from '@google-cloud/storage'
import { Screenshot } from './takeScreenshot'

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
const bucketName = process.env.BUCKET_NAME

if (!projectId) console.error('GOOGLE_CLOUD_PROJECT_ID environment variable is not set')
if (!bucketName) console.error('BUCKET_NAME environment variable is not set')

exports.run = async (req, res) => {
  res.setHeader("content-type", "application/json")

  try {
    const buffer = await takeScreenshot(req.body)

    let screenshotUrl = await uploadToGoogleCloud(buffer, "screenshot.png")

    res.status(200).send(JSON.stringify({
      'screenshotUrl': screenshotUrl
    }))
  }
  catch (e) {
    res.status(422).send(JSON.stringify({
      error: e.message
    }))
  }
}

export default async function uploadToGoogleCloud(screenshots: readonly Screenshot[]):
  Promise<void> {
  screenshots.forEach(async ([filename, buffer]) => {
    try {
      const storage = new Storage({ projectId })
      const bucket = storage.bucket(bucketName)
      const file = bucket.file(filename)
      file.save(buffer)

      await file.makePublic()
      console.log(file.baseUrl)

      // return `https://${BUCKET_NAME}.storage.googleapis.com/${filename}`
    }
    catch (e) { console.error(e.message) }
  })
}
