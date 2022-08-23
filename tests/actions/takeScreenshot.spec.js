const { faker } = require("@faker-js/faker");
const {
  Logger,
  takeScreenshot,
  waitFor,
  generateCreatedAt,
} = require("../../src/actions");
const puppeteer = require("puppeteer");
const fs = require("fs");

puppeteer.Browser;
puppeteer.Page;

jest.mock("../../src");
jest.mock("../../src/actions/generateCreatedAt");
jest.mock("../../src/actions/Logger");
jest.mock("../../src/actions/waitFor");

const date = new Date().toISOString();

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(global, "setTimeout");

  waitFor.mockClear();
  generateCreatedAt.mockImplementation(() => date);
  generateCreatedAt.mockClear();

  for (instance of Logger.mock.instances) {
    instance.info.mockClear();
    instance.warning.mockClear();
    instance.error.mockClear();
    instance.critical.mockClear();
  }
});

// afterEach(() => {
//   Logger.mockClear();
// });

test("passing url without protocol, dimension and name", async () => {
  const name = faker.name.firstName().toLowerCase();
  const ext = faker.random.alpha({ count: 2, casing: "lower" });

  const url = "www.google.com/intl/es-419/gmail/about/";
  const dimension = "1300x800";
  const result = await takeScreenshot({
    url,
    dimension,
    name: `${name}.${ext}`,
  });

  const buffer = fs.readFileSync("./images/gmail-1300x800.png");

  expect(result).toEqual({
    buffer,
    createdAt: date,
    dimension: dimension,
    filename: `${name}-${dimension}.png`,
  });

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(1);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.error).toHaveBeenCalledTimes(0);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

  const message = `screenshot is being saving as ${name}-${dimension}.png`;
  expect(loggerMock1.info).toHaveBeenCalledWith(message);

  expect(waitFor).toHaveBeenCalledTimes(0);
});

test("passing url with protocol, dimension and name", async () => {
  const name = faker.name.firstName().toLowerCase();
  const ext = faker.random.alpha({ count: 2, casing: "lower" });

  const url = "https://www.google.com/intl/es-419/gmail/about/";
  const dimension = "1300x800";
  const result = await takeScreenshot({
    url,
    dimension,
    name: `${name}.${ext}`,
  });

  const buffer = fs.readFileSync("./images/gmail-1300x800.png");

  expect(result).toEqual({
    buffer,
    createdAt: date,
    dimension: dimension,
    filename: `${name}-${dimension}.png`,
  });

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(1);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.error).toHaveBeenCalledTimes(0);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

  const message = `screenshot is being saving as ${name}-${dimension}.png`;
  expect(loggerMock1.info).toHaveBeenCalledWith(message);

  expect(waitFor).toHaveBeenCalledTimes(0);
});

test("passing url with protocol and name", async () => {
  const name = faker.name.firstName().toLowerCase();
  const ext = faker.random.alpha({ count: 2, casing: "lower" });

  const url = "https://www.google.com/intl/es-419/gmail/about/";
  const dimension = "1024x768";
  const result = await takeScreenshot({
    url,
    name: `${name}.${ext}`,
  });

  const buffer = fs.readFileSync("./images/gmail-1024x768.png");

  expect(result).toEqual({
    buffer,
    createdAt: date,
    dimension: dimension,
    filename: `${name}-${dimension}.png`,
  });

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(1);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.error).toHaveBeenCalledTimes(0);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

  const message = `screenshot is being saving as ${name}-${dimension}.png`;
  expect(loggerMock1.info).toHaveBeenCalledWith(message);

  expect(waitFor).toHaveBeenCalledTimes(0);
});

test("passing url with protocol and dimension", async () => {
  const url = "https://www.google.com/intl/es-419/gmail/about/";
  const dimension = "1300x800";
  const result = await takeScreenshot({
    url,
    dimension,
  });

  const buffer = fs.readFileSync("./images/gmail-1300x800.png");

  expect(result).toEqual({
    buffer,
    createdAt: date,
    dimension: dimension,
    filename: `webside-${dimension}.png`,
  });

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(1);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.error).toHaveBeenCalledTimes(0);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

  const message = `screenshot is being saving as webside-${dimension}.png`;
  expect(loggerMock1.info).toHaveBeenCalledWith(message);

  expect(waitFor).toHaveBeenCalledTimes(0);
});

test("passing url with protocol, bad dimension and name", async () => {
  const name = faker.name.firstName().toLowerCase();
  const ext = faker.random.alpha({ count: 2, casing: "lower" });

  const url = "https://www.google.com/intl/es-419/gmail/about/";
  const dimension = "1300";
  const result = await takeScreenshot({
    url,
    dimension,
    name: `${name}.${ext}`,
  });

  const buffer = fs.readFileSync("./images/gmail-1300x800.png");

  const error = "invalid resolution 1300, format (1024x768)";
  expect(result).toEqual({
    error,
    dimension,
  });

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(0);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.error).toHaveBeenCalledTimes(1);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

  expect(loggerMock1.error).toHaveBeenCalledWith(error);

  expect(waitFor).toHaveBeenCalledTimes(0);
});

test("passing url with protocol, dimension, name and delay", async () => {
  const name = faker.name.firstName().toLowerCase();
  const ext = faker.random.alpha({ count: 2, casing: "lower" });

  const url = "https://www.google.com/intl/es-419/gmail/about/";
  const dimension = "1300x800";
  const delay = Math.floor(Math.random() * 10000);
  const result = await takeScreenshot({
    url,
    dimension,
    delay,
    name: `${name}.${ext}`,
  });

  const buffer = fs.readFileSync("./images/gmail-1300x800.png");

  expect(result).toEqual({
    buffer,
    createdAt: date,
    dimension: dimension,
    filename: `${name}-${dimension}.png`,
  });

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(1);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.error).toHaveBeenCalledTimes(0);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

  const message = `screenshot is being saving as ${name}-${dimension}.png`;
  expect(loggerMock1.info).toHaveBeenCalledWith(message);

  expect(waitFor).toHaveBeenCalledTimes(1);
  expect(waitFor).toHaveBeenCalledWith(delay);
});

test("passing url with protocol, dimension, name and delay", async () => {
  const name = faker.name.firstName().toLowerCase();
  const ext = faker.random.alpha({ count: 2, casing: "lower" });

  const url = "https://www.google.com/intl/es-419/gmail/about/";
  const dimension = "1300x800";
  const includeDate = true;
  const result = await takeScreenshot({
    url,
    dimension,
    includeDate,
    name: `${name}.${ext}`,
  });

  const buffer = fs.readFileSync("./images/gmail-1300x800.png");

  expect(result).toEqual({
    buffer,
    createdAt: date,
    dimension: dimension,
    filename: `${name}-${dimension}-${date}.png`,
  });

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(1);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.error).toHaveBeenCalledTimes(0);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

  const message = `screenshot is being saving as ${name}-${dimension}-${date}.png`;
  expect(loggerMock1.info).toHaveBeenCalledWith(message);

  expect(waitFor).toHaveBeenCalledTimes(0);
});
