import { readFileSync } from 'fs'
import { join } from 'path'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { BigIntResolver, DateTimeResolver, JSONResolver } from 'graphql-scalars'
import resolvers from './resolvers'

const typeDefs = readFileSync(
  join(process.cwd(), 'apollo/type-defs.graphqls'),
  'utf8',
)

/**
 * Use custom scalars, need also add custom-scalar type in '.../.graphql-let.yml'
 * @see https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/
 *
 *
 */
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    BigInt: BigIntResolver,
    JSON: JSONResolver,
    DateTime: DateTimeResolver,
    // JSONObject: JSONObjectResolver,
    ...resolvers,
  },
})
