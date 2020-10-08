/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import puppeteer from 'puppeteer'
import path from 'path'
import createDirIfNotExist from './createDirIfNotExist'

type Resolution = readonly [number, number]
export type Screenshot = readonly [string, Buffer]

const screenshotPath = process.env.SCREENSHOT_PATH || 'screenshots'

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

createDirIfNotExist('screenshots')

type TakeScreenshot = {
  readonly url: string
  readonly width?: number
  readonly height?: number
  readonly name?: string
  readonly wait?: number
  readonly includeDate?: boolean
}

type ScreenshotResult = {
  readonly url: string
  readonly buffer: Buffer
  readonly createdAt: string
}

export default async function takeScreenshot({ url, width, height, name = 'side', wait,
  includeDate }: TakeScreenshot): Promise<readonly ScreenshotResult[]> {
  try {
    const arr: readonly Resolution[] = width && height ?
      [[Number(width), Number(height)]] : resolutions

    const createdAt = new Date().toISOString()
    const browser = await puppeteer.launch({
      args: ['--disable-dev-shm-usage', '--disable-dev-shm-usage', '--no-sandbox'],
      // headless: false,
      defaultViewport: null
    })

    const screenshots = await Promise.all(arr.map(async ([width, height]):
      Promise<ScreenshotResult> => {
      try {
        const page = await browser.newPage()
        await page.goto(url)

        const imagePath = path.join(screenshotPath, includeDate ?
          `${name}-${width}x${height}-${createdAt}.png` : `${name}-${width}x${height}.png`)

        await page.setViewport({ width, height })
        if (wait) await waitFor(wait)
        const screenshot = {
          url: imagePath,
          // buffer: await page.screenshot({}),
          buffer: await page.screenshot({ path: imagePath }),
          createdAt
        }
        await page.close()

        console.log(`Screenshot was save in ${imagePath}`)
        return screenshot
      }
      catch (e) { throw new Error(e.message) }
    }))
    await browser.close()
    return screenshots
  }
  catch (e) { throw new Error(e.message) }
}

async function waitFor(ms: number): Promise<void> {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve()
    }, ms))
}
