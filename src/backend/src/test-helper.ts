import dotenv from 'dotenv'
import omitDeep from 'omit-deep-lodash'
import { removeUndefinedFields } from '../../lib/editor/src/test-helper'

export function _clean(obj: any): any {
  return removeUndefinedFields(omitDeep(obj, ['createdAt', 'updatedAt']))
}

const config = dotenv.config()
if (config.error) throw config.error
if (!config.parsed?.BOT_EMAIL || !config.parsed?.BOT_PASSWORD) {
  throw new Error('BOT_EMAIL or BOT_PASSWORD not found in .env')
}

export const BOT = { id: 'bot', email: config.parsed.BOT_EMAIL, password: config.parsed.BOT_PASSWORD }

export const TESTUSERS = [
  { id: 'test-user-1', email: 'aaa@aaa.com', password: 'aaa' },
  { id: 'test-user-2', email: 'bbb@bbb.com', password: 'bbb' },
  { id: 'test-user-3', email: 'ccc@ccc.com', password: 'ccc' },
  { id: 'test-user-4', email: 'ddd@ddd.com', password: 'ddd' },
  { id: 'test-user-5', email: 'eee@eee.com', password: 'eee' },
]

export const TESTOAUTHORS = [{ name: 'test-oauthor-1' }]
