// import * as request from 'request'
import { resolve } from 'path'
import dotenv from 'dotenv'
import { User } from '@prisma/client'
import prisma from '../prisma'

if (!process.env.BOT_EMAIL) {
  console.log('Loading env variables from local .env')
  const config = dotenv.config({ path: resolve(process.cwd(), '.env') })
  if (config.error) throw config.error
  if (!config.parsed?.BOT_EMAIL) throw new Error('BOT_EMAIL not found in .env')
}

const BOT_EMAIL = process.env.BOT_EMAIL

let _botId: string | undefined

export function getBotEmail(): string {
  if (BOT_EMAIL) return BOT_EMAIL
  throw new Error('bot email not found')
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
