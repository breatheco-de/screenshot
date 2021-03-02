const puppeteer = require('puppeteer')
const generateCreatedAt = require('./generateCreatedAt')
const waitFor = require('./waitFor')
const Logger = require('./Logger')

const logger = new Logger(__filename)
const resolution = '1024x768'

async function takeScreenshot({
  url, dimension = resolution, name = 'webside', delay, includeDate,
}) {
  let base = dimension.split('x')

  if (base.length !== 2) {
    return { error: `invalid resolution ${dimension}, format (1024x768)`, dimension }
    // base = resolution.split('x')
  }

  const [width, height] = base.map((v) => Number(v))
  const createdAt = generateCreatedAt()
  const browser = await puppeteer.launch({
    args: ['--disable-dev-shm-usage', '--disable-dev-shm-usage', '--no-sandbox'],
    // headless: false,
    defaultViewport: null,
  })

  const page = await browser.newPage()
  await page.goto(/^http/.test(url) ? url : `https://${url}`)

  const filename = includeDate ?
    `${name}-${width}x${height}-${createdAt}.png` : `${name}-${width}x${height}.png`

  await page.setViewport({ width, height })
  if (delay) await waitFor(delay)

  const buffer = await page.screenshot({})
  await page.close()

  logger.info(`screenshot is being saving as ${filename}`)

  await browser.close()
  return { filename, buffer, createdAt, dimension }
}

module.exports = takeScreenshot
