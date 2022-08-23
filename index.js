const functions = require("@google-cloud/functions-framework");
const { config } = require("dotenv");
const { main } = require("./src");

config();

// Register an HTTP function with the Functions Framework
functions.http("main", main);
