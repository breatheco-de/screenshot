const { takeScreenshot, uploadToGoogleCloud, Logger } = require("./actions");

const required = ["url"];

function ms(start, end) {
  return end - start;
}

function getLogger() {
  if (!getLogger[__filename]) {
    getLogger[__filename] = new Logger(__filename);
  }

  return getLogger[__filename];
}

async function getScreenshots(request, message) {
  const dimensions = request.body.dimension
    ? request.body.dimension.replace(/,$/, "").split(",").slice(0, 6)
    : [request.body.dimension];

  return Promise.all(
    dimensions.map(async (dimension) => {
      const { filename, buffer, createdAt, error } = await takeScreenshot({
        ...message,
        dimension,
      });
      if (error) throw Error(error, { cause: 400 });
      const url = await uploadToGoogleCloud({ filename, buffer });
      return { url, filename, createdAt };
    })
  );
}

module.exports.main = async (request, response) => {
  const logger = getLogger();

  if (request.method !== "POST") {
    const error = `Method ${request.method} not implemented`;
    logger.warning(error);
    const data = { error };
    response.status(405).json(data);
    return;
  }

  const startTime = Date.now();
  const error = required.filter((v) => !request.body[v]);
  const ip =
    request.headers["x-forwarded-for"] || request.connection.remoteAddress;

  if (error.length) {
    const data = {
      non_field_errors: error.map((err) => ({
        [err]: ["This field is required."],
      })),
    };
    const endTime = Date.now();
    logger.warning(`${ip} ${ms(startTime, endTime)}ms ${JSON.stringify(data)}`);
    response.status(400).json(data);
    return;
  }

  const message = {
    url: decodeURIComponent(request.body.url),
    name: request.body.name,
    dimension: request.body.dimension,
    delay: request.body.delay,
    includeDate: request.body.includeDate,
  };

  try {
    let data = await getScreenshots(request, message);
    const endTime = Date.now();
    logger.info(`${ip} ${ms(startTime, endTime)}ms ${JSON.stringify(data)}`);
    response.status(200).json(data);
  } catch (e) {
    const data = { error: e.message };
    const endTime = Date.now();
    logger.critical(`${ip} ${ms(startTime, endTime)}ms ${e.message}`);
    response.status(e.cause || 500).json(data);
  }
};
