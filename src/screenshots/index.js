const { takeScreenshot, uploadToGoogleCloud, Logger } = require('./actions')

const logger = new Logger(__filename)
const required = ['url']

function ms(start, end) {
  return end - start
}

async function getScreenshots(request, message) {
  const dimensions = request.query.dimension ? request.query.dimension
    .replace(/,$/, '').split(',').slice(0, 6) : [request.query.dimension]

  return Promise.all(dimensions.map(async (dimension) => {
    const { filename, buffer, createdAt, error } = await takeScreenshot({ ...message,
      dimension })
    if (error) return { error, dimension }
    const url = await uploadToGoogleCloud({ filename, buffer })
    return { url, filename, createdAt }
  }))
}

module.exports.screenshots = async (request, response) => {
  if (request.method !== 'GET') {
    logger.warning(`method not implemented ${request.method}`)
    return response.status(405).send('Method not implemented')
  }

  const startTime = Date.now()
  const error = required.filter((v) => !request.query[v])
  const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress

  if (error.length) {
    const data = {
      non_field_errors: error.map((err) => ({ [err]: ['This field is required.'] })),
    }
    const endTime = Date.now()
    logger.warning(`${ip} ${ms(startTime, endTime)}ms ${JSON.stringify(data)}`)
    return response.status(400).json()
  }

  const message = {
    url: request.query.url,
    name: request.query.name,
    dimension: request.query.dimension,
    delay: request.query.delay,
    includeDate: request.query.includeDate,
  }
  logger.info(`${ip} params ${JSON.stringify(message)}`)

  try {
    const data = await getScreenshots(request, message)
    const endTime = Date.now()
    logger.info(`${ip} ${ms(startTime, endTime)}ms ${JSON.stringify(data)}`)
    response.status(200).json(data)
  }
  catch (e) {
    logger.critical(`${ip} ${e.toString()}`)
    const data = { error: e.message }
    const endTime = Date.now()
    logger.critical(`${ip} ${ms(startTime, endTime)}ms ${JSON.stringify(data)}`)
    return response.status(500).json(data)
  }
}
