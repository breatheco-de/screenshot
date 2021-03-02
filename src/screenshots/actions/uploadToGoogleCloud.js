const { Storage } = require('@google-cloud/storage')
const Logger = require('./Logger')

const logger = new Logger(__filename)

function uploadToGoogleCloud({ filename, buffer }) {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
  const bucketName = process.env.BUCKET_NAME

  if (!projectId) logger.warning('GOOGLE_CLOUD_PROJECT_ID environment variable is not set')
  if (!bucketName) logger.warning('BUCKET_NAME environment variable is not set')

  const storage = new Storage({ projectId })
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(filename)
  file.save(buffer, {
    validation: false,
  })

  // bucket now is public by default
  // await file.makePublic()

  return `https://${bucketName}.storage.googleapis.com/${filename}`
}

module.exports = uploadToGoogleCloud
