// import * as request from 'request'
import { resolve } from 'path'
import dotenv from 'dotenv'
import { User } from '@prisma/client'
import prisma from '../prisma'

const config = dotenv.config({ path: resolve(process.cwd(), '.env.local') })
if (config.error) throw config.error
if (!config.parsed?.BOT_EMAIL) throw new Error('BOT_EMAIL not found in .env')
// if (!config.parsed?.BOT_EMAIL || !config.parsed?.BOT_PASSWORD)
//   throw new Error('BOT_EMAIL or BOT_PASSWORD not found in .env')

let botId: string | undefined

export function getBotEmail(): string {
  if (process.env.BOT_EMAIL) {
    return process.env.BOT_EMAIL
  }
  throw new Error('bot email not found')
}

export async function getBotId(): Promise<string> {
  if (botId) {
    return botId
  }
  if (process.env.BOT_EMAIL) {
    const bot = await prisma.user.findUnique({
      where: { email: process.env.BOT_EMAIL },
    })
    if (bot !== null) {
      botId = bot.id
      return bot.id
    }
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
