const { takeScreenshot, uploadToGoogleCloud, generateCreatedAt } = require('./actions')

const Query = {
  takeScreenshot: async (_, message, ctx) => {
    const screenshots = await takeScreenshot(message)
    const filesInCloud = await uploadToGoogleCloud(screenshots)
    const createdAt = generateCreatedAt()
    return filesInCloud.map(({ url, filename }) => ({ url, filename, createdAt }))
  }
}

exports.Query = Query
