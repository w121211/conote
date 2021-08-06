// @ts-check
/**
 * Copy from:
 * - https://github.com/prisma/prisma-examples/blob/latest/typescript/testing-express/prisma/prisma-test-environment.js
 * - https://github.com/graphql-nexus/tutorial/tree/master/tests
 */
const path = require('path')
const util = require('util')
const { Client } = require('pg')
const NodeEnvironment = require('jest-environment-node')
const { nanoid } = require('nanoid')
const exec = util.promisify(require('child_process').exec)

const prismaBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma')

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
    this.schema = `test_${nanoid()}`
    this.databaseUrl = `${process.env.DATABASE_TESTER_URL}${this.schema}`
  }

  async setup() {
    console.log('Setting up test database...')
    process.env.DATABASE_URL = this.databaseUrl
    this.global.process.env.DATABASE_URL = this.databaseUrl

    // Run the migrations to ensure our schema has the required structure
    await exec(`${prismaBinary} db push --preview-feature`)
    return super.setup()
  }

  async teardown() {
    const client = new Client({
      connectionString: this.databaseUrl,
    })
    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await client.end()
    console.log('Drop test database completed.')
  }
}

module.exports = PrismaTestEnvironment
