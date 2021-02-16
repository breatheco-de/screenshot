import { Storage } from '@google-cloud/storage'
import { Screenshot } from './takeScreenshot'

type FileResult = {
  readonly url: string
  readonly filename: string
}

export default async function uploadToGoogleCloud(screenshots: readonly Screenshot[]):
  Promise<readonly FileResult[]> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
  const bucketName = process.env.BUCKET_NAME

  if (!projectId) console.error('GOOGLE_CLOUD_PROJECT_ID environment variable is not set')
  if (!bucketName) console.error('BUCKET_NAME environment variable is not set')

  return Promise.all(screenshots.map(async ([filename, buffer]) => {
    try {
      const storage = new Storage({ projectId })
      const bucket = storage.bucket(bucketName)
      const file = bucket.file(filename)
      file.save(buffer, {
        validation: false
      })

      // bucket now is public by default
      // await file.makePublic()

      // return `https://${BUCKET_NAME}.storage.googleapis.com/${filename}`
      return {
        url: `https://${bucketName}.storage.googleapis.com/${filename}`,
        filename
      }
    }
    catch (e) { throw new Error(e.message) }
  }))
}
