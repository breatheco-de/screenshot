import takeScreenshot from './takeScreenshot'
import uploadToGoogleCloud from './uploadToGoogleCloud'

async function startup(): Promise<void> {
  const screenshots = await takeScreenshot()
  await uploadToGoogleCloud(screenshots)
}

startup()
