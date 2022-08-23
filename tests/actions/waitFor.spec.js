const { waitFor } = require("../../src/actions");

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(global, "setTimeout");
});

test("wait a random ms", async () => {
  const ms = Math.floor(Math.random() * 10000);
  const promise = waitFor(ms);

  jest.runAllTimers();

  await promise;

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), ms);

  const callback = setTimeout.mock.calls[0][0];
  const callbackSrc = callback.toString();
  expect(
    callbackSrc == "() => resolve()" ||
      callbackSrc ==
        [
          "() => {",
          "      /* istanbul ignore next */",
          "      cov_1ah06lexeo().f[2]++;",
          "      cov_1ah06lexeo().s[2]++;",
          "      return resolve();",
          "    }",
        ].join("\n")
  ).toBeTruthy();
});
