const { makeExecutableSchema } = require('graphql-tools')
const { graphqlHTTP } = require('express-graphql')
const { readFileSync } = require('fs')
const path = require('path')
const resolvers = require('./resolvers')

const typeDefs = readFileSync(path.resolve(__dirname, 'schema.gql'), 'utf-8')
const schema = makeExecutableSchema({ typeDefs, resolvers })

exports.screenshots = graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
})
