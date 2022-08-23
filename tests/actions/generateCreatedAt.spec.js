const { generateCreatedAt } = require("../../src/actions");

let date = new Date();

beforeAll(() => {
  jest.useFakeTimers("modern");
  jest.setSystemTime(date);
});

afterAll(() => {
  jest.useRealTimers();
});

test("Generate a random iso string", async () => {
  const result = generateCreatedAt();
  expect(result).toBe(date.toISOString());
});
