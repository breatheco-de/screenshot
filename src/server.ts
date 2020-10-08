import express from 'express'
import { makeExecutableSchema } from 'graphql-tools'
import { graphqlHTTP } from 'express-graphql'
import { readFileSync } from 'fs'
import cors from 'cors'
import * as path from 'path'
import resolvers from './resolvers'

export const app = express()

// GraphQL.
const typeDefs = readFileSync(path.resolve(__dirname, '..', 'src', 'schema.gql'), 'utf-8')
const schema = makeExecutableSchema({ typeDefs, resolvers })

app.use(cors())
app.use('/', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
}))

export function server(): void {
  const port = process.env.PORT || 5000
  app.listen(port, () => console.log(`GraphQL server listening on port ${port}`))
}
