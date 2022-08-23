const generateCreatedAt = require("./generateCreatedAt");

class Logger {
  constructor(module) {
    const result = module.split("/");
    this.module = result[result.length - 1];
  }

  #logger(type, message) {
    const text =
      typeof message === "object" ? JSON.stringify(message) : message;
    let method = "info";

    if (type === "WARNING") method = "warn";
    else if (type === "ERROR" || type === "CRITICAL") method = "error";

    console[method](`${generateCreatedAt()} ${type} ${this.module} ${text}\n`);
  }

  info(message) {
    this.#logger("INFO", message);
  }

  error(message) {
    this.#logger("ERROR", message);
  }

  critical(message) {
    this.#logger("CRITICAL", message);
  }

  warning(message) {
    this.#logger("WARNING", message);
  }
}

module.exports = Logger;
