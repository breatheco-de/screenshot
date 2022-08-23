const { faker } = require("@faker-js/faker");
const { Logger } = require("../../src/actions");

let date = new Date();

beforeEach(() => {
  mockInfo = jest.spyOn(console, "info");
  mockError = jest.spyOn(console, "error");
  mockWarn = jest.spyOn(console, "warn");

  mockInfo.mockImplementation(() => undefined);
  mockError.mockImplementation(() => undefined);
  mockWarn.mockImplementation(() => undefined);

  jest.useFakeTimers("modern");
  jest.setSystemTime(date);
});

afterEach(() => {
  mockInfo.mockClear();
  mockError.mockClear();
  mockWarn.mockClear();
  jest.useRealTimers();
});

test("call info passing string", async () => {
  const filename = faker.name.firstName();
  const logger = new Logger(filename);
  const message = faker.name.firstName();
  logger.info(message);

  expect(console.info).toHaveBeenCalledTimes(1);
  expect(console.info).toHaveBeenLastCalledWith(
    `${date.toISOString()} INFO ${filename} ${message}\n`
  );
});

test("call info passing object", async () => {
  const filename = faker.name.firstName();
  const logger = new Logger(filename);
  const key = faker.name.firstName();
  const value = faker.name.firstName();
  const object = { [key]: value };
  logger.info(object);

  expect(console.info).toHaveBeenCalledTimes(1);
  expect(console.info).toHaveBeenLastCalledWith(
    `${date.toISOString()} INFO ${filename} ${JSON.stringify(object)}\n`
  );
});

test("call error passing string", async () => {
  const filename = faker.name.firstName();
  const logger = new Logger(filename);
  const message = faker.name.firstName();
  logger.error(message);

  expect(console.error).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenLastCalledWith(
    `${date.toISOString()} ERROR ${filename} ${message}\n`
  );
});

test("call error passing object", async () => {
  const filename = faker.name.firstName();
  const logger = new Logger(filename);
  const key = faker.name.firstName();
  const value = faker.name.firstName();
  const object = { [key]: value };
  logger.error(object);

  expect(console.error).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenLastCalledWith(
    `${date.toISOString()} ERROR ${filename} ${JSON.stringify(object)}\n`
  );
});

test("call critical passing string", async () => {
  const filename = faker.name.firstName();
  const logger = new Logger(filename);
  const message = faker.name.firstName();
  logger.critical(message);

  expect(console.error).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenLastCalledWith(
    `${date.toISOString()} CRITICAL ${filename} ${message}\n`
  );
});

test("call critical passing object", async () => {
  const filename = faker.name.firstName();
  const logger = new Logger(filename);
  const key = faker.name.firstName();
  const value = faker.name.firstName();
  const object = { [key]: value };
  logger.critical(object);

  expect(console.error).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenLastCalledWith(
    `${date.toISOString()} CRITICAL ${filename} ${JSON.stringify(object)}\n`
  );
});

test("call warning passing string", async () => {
  const filename = faker.name.firstName();
  const logger = new Logger(filename);
  const message = faker.name.firstName();
  logger.warning(message);

  expect(console.warn).toHaveBeenCalledTimes(1);
  expect(console.warn).toHaveBeenLastCalledWith(
    `${date.toISOString()} WARNING ${filename} ${message}\n`
  );
});

test("call warning passing object", async () => {
  const filename = faker.name.firstName();
  const logger = new Logger(filename);
  const key = faker.name.firstName();
  const value = faker.name.firstName();
  const object = { [key]: value };
  logger.warning(object);

  expect(console.warn).toHaveBeenCalledTimes(1);
  expect(console.warn).toHaveBeenLastCalledWith(
    `${date.toISOString()} WARNING ${filename} ${JSON.stringify(object)}\n`
  );
});
