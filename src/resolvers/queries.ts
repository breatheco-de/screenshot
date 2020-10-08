import takeScreenshot from '../takeScreenshot'

type Screenshot = {
  readonly url: string
  readonly base64: string
  readonly createdAt: string
}

export default {
  takeScreenshot: async (_, message, ctx): Promise<readonly Screenshot[]> => {
    const screenshots = await takeScreenshot(message)
    return screenshots.map(({ url, buffer, createdAt }) => {
      const base64 = buffer.toString('base64')
      return { url, base64, createdAt }
    })
  }
}
