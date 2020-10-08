import takeScreenshot from '../actions/takeScreenshot'
import uploadToGoogleCloud from '../actions/uploadToGoogleCloud'
import generateCreatedAt from '../actions/generateCreatedAt'

type Screenshot = {
  readonly url: string
  readonly filename: string
  readonly createdAt: string
}

export default {
  takeScreenshot: async (_, message, ctx): Promise<readonly Screenshot[]> => {
    const screenshots = await takeScreenshot(message)
    const filesInCloud = await uploadToGoogleCloud(screenshots)
    const createdAt = generateCreatedAt()
    return filesInCloud.map(({ url, filename }) => ({ url, filename, createdAt }))
  }
}
