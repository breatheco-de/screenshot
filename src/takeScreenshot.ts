/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import puppeteer from 'puppeteer'
import createDirIfNotExist from './createDirIfNotExist'
import path from 'path'

type Resolution = readonly [number, number]

const url = process.env.URL || 'https://google.co.ve'
const imageBaseName = process.env.SCREENSHOT_BASE_NAME || 'side'
const screenshotPath = process.env.SCREENSHOT_PATH || 'screenshots'
const defaultWidth = process.env.WIDTH
const defaultHeight = process.env.HEIGHT

// https://www.hobo-web.co.uk/best-screen-size/
const resolutions: readonly Resolution[] = [
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

if (process.env.URL) console.warn('URL environment variable is not set')

createDirIfNotExist('screenshots')

export default async function takeScreenshot(): Promise<void> {
  try {
    const arr: readonly Resolution[] = defaultWidth && defaultHeight ?
      [[Number(defaultWidth), Number(defaultHeight)]] : resolutions
    const browser = await puppeteer.launch({
      args: ['--disable-dev-shm-usage'],
      defaultViewport: null,
      headless: false
    })

    // run it in pallalel mode is bug
    for (const [width, height] of arr) {
      try {
        const page = await browser.newPage()
        await page.goto(url)
        const imagePath = path.join(screenshotPath, `${imageBaseName}-${width}-${height}.png`)
        await page.setViewport({ width, height })
        await page.screenshot({ path: imagePath })
        await page.close()

        console.log(`Screenshot was save in ${imagePath}`)
      }
      catch (e) {
        console.error(e.message)
      }
    }
    await browser.close()
  }
  catch (e) { console.error(e.message) }
}
