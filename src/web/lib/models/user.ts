// import * as request from 'request'
import { resolve } from 'path'
import dotenv from 'dotenv'
import { User } from '@prisma/client'
import prisma from '../prisma'

if (process.env.APP_BOT_EMAIL === undefined) {
  console.log('Not found APP_BOT_EMAIL, try loading from local .env')
  const config = dotenv.config({ path: resolve(process.cwd(), '.env') })
  if (config.error) throw config.error
  if (!config.parsed?.APP_BOT_EMAIL) throw new Error('APP_BOT_EMAIL not found in .env')

  process.env.APP_BOT_EMAIL = config.parsed.APP_BOT_EMAIL
}

const BOT_EMAIL = process.env.APP_BOT_EMAIL

let _botId: string | undefined

export function getBotEmail(): string {
  return BOT_EMAIL
}

export async function getBotId(): Promise<string> {
  if (_botId) {
    return _botId
  }
  const bot = await prisma.user.findUnique({
    where: { email: getBotEmail() },
  })
  if (bot !== null) {
    _botId = bot.id
    return bot.id
  }
  throw new Error('bot user not found')
}

export async function getOrCreateUser(email: string): Promise<User> {
  const user = await prisma.user.upsert({
    create: {
      email,
    },
    update: {},
    where: { email },
  })
  return user
}
