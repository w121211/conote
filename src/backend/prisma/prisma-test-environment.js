// @ts-check
// Code borrowed from: https://github.com/prisma/prisma-examples/blob/latest/typescript/testing-express/prisma/prisma-test-environment.js
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
    this.databaseUrl = `postgresql://postgresuser:postgrespassword@postgres:5432/testing?schema=${this.schema}`
  }

  async setup() {
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
    // try {

    // } catch (error) {
    //   // doesn't matter as the environment is torn down
    // }
  }
}

module.exports = PrismaTestEnvironment
