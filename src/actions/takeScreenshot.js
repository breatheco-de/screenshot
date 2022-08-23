const puppeteer = require("puppeteer");
const generateCreatedAt = require("./generateCreatedAt");
const waitFor = require("./waitFor");
const Logger = require("./Logger");

function getLogger() {
  if (!getLogger[__filename]) {
    getLogger[__filename] = new Logger(__filename);
  }

  return getLogger[__filename];
}

const resolution = "1024x768";

async function takeScreenshot({
  url,
  dimension = resolution,
  name = "webside",
  delay,
  includeDate,
}) {
  const logger = getLogger();
  name = name.split(".")[0];

  let base = dimension.split("x");

  if (base.length !== 2) {
    const error = `invalid resolution ${dimension}, format (1024x768)`;
    logger.error(error);
    return {
      error,
      dimension,
    };
  }

  const [width, height] = base.map((v) => Number(v));
  const createdAt = generateCreatedAt();
  const browser = await puppeteer.launch({
    args: [
      "--disable-dev-shm-usage",
      "--disable-dev-shm-usage",
      "--no-sandbox",
    ],
    // headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.goto(/^http/.test(url) ? url : `https://${url}`, {
    waitUntil: "load",
    // Remove the timeout
    timeout: 0,
  });

  const filename = includeDate
    ? `${name}-${width}x${height}-${createdAt}.png`
    : `${name}-${width}x${height}.png`;

  await page.setViewport({ width, height });
  if (delay) await waitFor(delay);

  const buffer = await page.screenshot({});
  await page.close();

  logger.info(`screenshot is being saving as ${filename}`);

  await browser.close();
  return { filename, buffer, createdAt, dimension };
}

module.exports = takeScreenshot;
