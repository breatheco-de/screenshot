const { faker } = require("@faker-js/faker");
const { main } = require("../src");
const {
  Logger,
  takeScreenshot,
  uploadToGoogleCloud,
} = require("../src/actions");

jest.mock("../src/actions/Logger");
jest.mock("../src/actions/takeScreenshot");
jest.mock("../src/actions/uploadToGoogleCloud");

function setupExpress(method, body) {
  const headers = {};
  const request = {
    connection: { remoteAddress: faker.internet.ipv4() },
    method,
    body,
    headers,
  };

  const response = {
    json: jest.fn(() => response),
    status: jest.fn(() => response),
  };

  return { request, response };
}

function teardownLogger(loggerMock) {
  loggerMock.info.mockClear();
  loggerMock.warning.mockClear();
  loggerMock.critical.mockClear();
}

beforeAll(() => {
  let date = Date.now();

  jest.useFakeTimers("modern");
  jest.setSystemTime(date);
});

afterAll(() => {
  jest.useRealTimers();
});

test("invalid methods", async () => {
  for (method of ["GET", "PUT", "DELETE", "PATCH"]) {
    const error = `Method ${method} not implemented`;
    const { request, response } = setupExpress(method, {});

    const result = await main(request, response);

    expect(result).toBe(undefined);

    expect(response.json).toHaveBeenCalledTimes(1);
    expect(response.json).toHaveBeenCalledWith({
      error,
    });

    expect(response.status).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(405);

    expect(Logger.mock.instances).toHaveLength(1);

    const loggerMock1 = Logger.mock.instances[0];

    expect(loggerMock1.info).toHaveBeenCalledTimes(0);
    expect(loggerMock1.warning).toHaveBeenCalledTimes(1);
    expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

    expect(loggerMock1.warning).toHaveBeenCalledWith(error);

    // teardown
    teardownLogger(loggerMock1);
  }
});

test("without passing url", async () => {
  const method = "POST";
  const { request, response } = setupExpress(method, {});

  const result = await main(request, response);

  expect(result).toBe(undefined);

  expect(response.json).toHaveBeenCalledTimes(1);
  expect(response.json).toHaveBeenCalledWith({
    non_field_errors: [{ url: ["This field is required."] }],
  });

  expect(response.status).toHaveBeenCalledTimes(1);
  expect(response.status).toHaveBeenCalledWith(400);

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(0);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(1);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

  const json = '{"non_field_errors":[{"url":["This field is required."]}]}';
  const error = `${request.connection.remoteAddress} 0ms ${json}`;
  expect(loggerMock1.warning).toHaveBeenCalledWith(error);

  // teardown
  teardownLogger(loggerMock1);
});

test("passing url", async () => {
  const method = "POST";
  const { request, response } = setupExpress(method, {
    url: faker.internet.url(),
  });

  const filename =
    faker.name.firstName().toLowerCase() +
    "." +
    faker.random.alpha({ count: 2, casing: "lower" });
  const url = faker.internet.url();
  const createdAt = faker.datatype.datetime();

  takeScreenshot.mockImplementation(() => ({
    filename,
    url,
    createdAt,
  }));

  uploadToGoogleCloud.mockImplementation(() => url);

  const result = await main(request, response);

  expect(result).toBe(undefined);

  expect(response.json).toHaveBeenCalledTimes(1);
  expect(response.json).toHaveBeenCalledWith([
    {
      filename,
      url,
      createdAt,
    },
  ]);

  expect(response.status).toHaveBeenCalledTimes(1);
  expect(response.status).toHaveBeenCalledWith(200);

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(1);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

  const json = `[{"url":"${url}","filename":"${filename}","createdAt":"${createdAt.toISOString()}"}]`;
  const message = `${request.connection.remoteAddress} 0ms ${json}`;
  expect(loggerMock1.info).toHaveBeenCalledWith(message);

  // teardown
  teardownLogger(loggerMock1);
});

test("passing url, takeScreenshot emit a error with exception", async () => {
  const method = "POST";
  const { request, response } = setupExpress(method, {
    url: faker.internet.url(),
  });

  const url = faker.internet.url();
  const error = faker.word.verb();
  takeScreenshot.mockImplementation(() => {
    throw new Error(error);
  });

  uploadToGoogleCloud.mockImplementation(() => url);

  const result = await main(request, response);

  expect(result).toBe(undefined);

  expect(response.json).toHaveBeenCalledTimes(1);
  expect(response.json).toHaveBeenCalledWith({ error });

  expect(response.status).toHaveBeenCalledTimes(1);
  expect(response.status).toHaveBeenCalledWith(500);

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(0);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(1);

  const message = `${request.connection.remoteAddress} 0ms ${error}`;
  expect(loggerMock1.critical).toHaveBeenCalledWith(message);

  // teardown
  teardownLogger(loggerMock1);
});

test("passing url, uploadToGoogleCloud emit a error with exception", async () => {
  const method = "POST";
  const { request, response } = setupExpress(method, {
    url: faker.internet.url(),
  });

  const filename =
    faker.name.firstName().toLowerCase() +
    "." +
    faker.random.alpha({ count: 2, casing: "lower" });
  const url = faker.internet.url();
  const createdAt = faker.datatype.datetime();

  takeScreenshot.mockImplementation(() => ({
    filename,
    url,
    createdAt,
  }));

  const error = faker.word.verb();
  uploadToGoogleCloud.mockImplementation(() => {
    throw new Error(error);
  });

  const result = await main(request, response);

  expect(result).toBe(undefined);

  expect(response.json).toHaveBeenCalledTimes(1);
  expect(response.json).toHaveBeenCalledWith({ error });

  expect(response.status).toHaveBeenCalledTimes(1);
  expect(response.status).toHaveBeenCalledWith(500);

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(0);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(1);

  const message = `${request.connection.remoteAddress} 0ms ${error}`;
  expect(loggerMock1.critical).toHaveBeenCalledWith(message);

  // teardown
  teardownLogger(loggerMock1);
});

test("passing url, takeScreenshot emit a error", async () => {
  const method = "POST";
  const dimension = "1024x768";
  const { request, response } = setupExpress(method, {
    url: faker.internet.url(),
    dimension,
  });

  const url = faker.internet.url();
  const error = faker.word.verb();
  takeScreenshot.mockImplementation(() => ({ error }));

  uploadToGoogleCloud.mockImplementation(() => url);

  const result = await main(request, response);

  expect(result).toBe(undefined);

  expect(response.json).toHaveBeenCalledTimes(1);
  expect(response.json).toHaveBeenCalledWith({ error });

  expect(response.status).toHaveBeenCalledTimes(1);
  expect(response.status).toHaveBeenCalledWith(400);

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(0);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(1);

  const message = `${request.connection.remoteAddress} 0ms ${error}`;
  expect(loggerMock1.critical).toHaveBeenCalledWith(message);

  // teardown
  teardownLogger(loggerMock1);
});
