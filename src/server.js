const express = require('express')
const cors = require('cors')
const { screenshots } = require('./screenshots')

const app = express()
exports.app = app

// GOOGLE_APPLICATION_CREDENTIALS
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = './.google-cloud.json'
}

app.use(cors())
app.use('/', screenshots)

// this is the debug server
exports.server = function server() {
  const port = process.env.PORT || 5000
  app.listen(port, () => console.log(`GraphQL server listening on port ${port}`))
}
