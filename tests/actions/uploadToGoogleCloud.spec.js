const { Storage, Bucket, File } = require("@google-cloud/storage");
const { faker } = require("@faker-js/faker");
const { Logger, uploadToGoogleCloud } = require("../../src/actions");

jest.mock("@google-cloud/storage");
jest.mock("../../src");
jest.mock("../../src/actions/Logger");

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(global, "setTimeout");

  File.mockClear();

  Bucket.mockImplementation(() => ({
    file: (name, options) => new File(this, name, options),
  }));
  Bucket.mockClear();

  Storage.mockImplementation(() => ({
    bucket: (name, options) => new Bucket(this, name, options),
  }));
  Storage.mockClear();
});

function teardownLogger(loggerMock) {
  loggerMock.info.mockClear();
  loggerMock.warning.mockClear();
  loggerMock.critical.mockClear();
}

test("without envs", async () => {
  const filename =
    faker.name.firstName().toLowerCase() +
    "." +
    faker.random.alpha({ count: 2, casing: "lower" });

  const buffer = Buffer.from("this is a test");

  const result = uploadToGoogleCloud({ filename, buffer });
  expect(result).toBe(`https://undefined.storage.googleapis.com/${filename}`);

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(0);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(2);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

  for (let env of ["GOOGLE_CLOUD_PROJECT_ID", "BUCKET_NAME"]) {
    const message = `${env} environment variable is not set`;
    expect(loggerMock1.warning).toHaveBeenCalledWith(message);
  }

  expect(Storage.mock.instances).toHaveLength(1);
  expect(Bucket.mock.instances).toHaveLength(1);
  expect(File.mock.instances).toHaveLength(1);

  expect(Storage).toHaveBeenCalledWith({ projectId: undefined });
  expect(Bucket).toHaveBeenCalledWith({}, undefined, undefined);
  expect(File).toHaveBeenCalledWith({}, filename, undefined);

  expect(File.mock.instances[0].save).toHaveBeenCalledWith(buffer, {
    validation: false,
  });

  teardownLogger(loggerMock1);
});

test("without envs", async () => {
  const projectId = faker.name.firstName().toLowerCase();
  const bucketName = faker.name.firstName().toLowerCase();

  process.env = {
    GOOGLE_CLOUD_PROJECT_ID: projectId,
    BUCKET_NAME: bucketName,
  };

  const filename =
    faker.name.firstName().toLowerCase() +
    "." +
    faker.random.alpha({ count: 2, casing: "lower" });

  const buffer = Buffer.from("this is a test");

  const result = uploadToGoogleCloud({ filename, buffer });
  expect(result).toBe(
    `https://${bucketName}.storage.googleapis.com/${filename}`
  );

  expect(Logger.mock.instances).toHaveLength(1);

  const loggerMock1 = Logger.mock.instances[0];

  expect(loggerMock1.info).toHaveBeenCalledTimes(0);
  expect(loggerMock1.warning).toHaveBeenCalledTimes(0);
  expect(loggerMock1.critical).toHaveBeenCalledTimes(0);

  expect(Storage.mock.instances).toHaveLength(1);
  expect(Bucket.mock.instances).toHaveLength(1);
  expect(File.mock.instances).toHaveLength(1);

  expect(Storage).toHaveBeenCalledWith({ projectId });
  expect(Bucket).toHaveBeenCalledWith({}, bucketName, undefined);
  expect(File).toHaveBeenCalledWith({}, filename, undefined);

  expect(File.mock.instances[0].save).toHaveBeenCalledWith(buffer, {
    validation: false,
  });

  teardownLogger(loggerMock1);
});
