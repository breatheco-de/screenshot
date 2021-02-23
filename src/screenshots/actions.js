const { Storage } = require('@google-cloud/storage')
const puppeteer = require('puppeteer')
const fs = require('fs')

function createDirIfNotExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

/**
 * Generate created at.
 * @returns Created at.
 */
function generateCreatedAt() {
  return new Date().toISOString()
}

// https://www.hobo-web.co.uk/best-screen-size/
const resolutions = [
  [2560, 1440], // 5.73%
  [1920, 1080], // 19.53%
  [1680, 1050], // 4.43%
  [1600, 900], // 2.25%
  [1536, 864], // 7.26%
  [1440, 900], // 9.65%
  [1366, 768], // 15.01%
  [1280, 800], // 3.09%
  [1280, 720], // 3.34%
  [360, 640] // 2.45%
]

async function takeScreenshot({ url, width, height, name = 'side', wait,
  includeDate }) {
  try {
    const arr = width && height ?
      [[Number(width), Number(height)]] : resolutions

    const createdAt = new Date().toISOString()
    const browser = await puppeteer.launch({
      args: ['--disable-dev-shm-usage', '--disable-dev-shm-usage', '--no-sandbox'],
      // headless: false,
      defaultViewport: null
    })

    const screenshots = await Promise.all(arr.map(async ([width, height]) => {
      try {
        const page = await browser.newPage()
        await page.goto(url)

        const filename = includeDate ?
          `${name}-${width}x${height}-${createdAt}.png` : `${name}-${width}x${height}.png`
        // const imagePath = path.join(screenshotPath, filename)

        await page.setViewport({ width, height })
        if (wait) await waitFor(wait)

        // const buffer = await page.screenshot({ path: imagePath })
        const buffer = await page.screenshot({})
        await page.close()

        const date = generateCreatedAt()
        console.log(`${date} Screenshot is being saving as ${filename}`)

        return [filename, buffer]
      }
      catch (e) { throw new Error(e.message) }
    }))
    await browser.close()
    return screenshots
  }
  catch (e) { throw new Error(e.message) }
}

async function waitFor(ms) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve()
    }, ms))
}

function uploadToGoogleCloud(screenshots) {
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

exports.createDirIfNotExist = createDirIfNotExist
exports.generateCreatedAt = generateCreatedAt
exports.takeScreenshot = takeScreenshot
exports.waitFor = waitFor
exports.uploadToGoogleCloud = uploadToGoogleCloud
