// import * as request from 'request'
import dotenv from 'dotenv'
import * as PA from '@prisma/client'
import prisma from '../prisma'

const config = dotenv.config()
if (config.error) {
  throw config.error
}
if (!config.parsed?.BOT_EMAIL || !config.parsed?.BOT_PASSWORD) {
  throw new Error('BOT_EMAIL or BOT_PASSWORD not found in .env')
}

export function getBotEmail(): string {
  if (config.parsed?.BOT_EMAIL) {
    return config.parsed.BOT_EMAIL
  }
  throw new Error('bot email not found')
}

let botId: string | undefined

export async function getBotId(): Promise<string> {
  if (botId) {
    return botId
  }
  if (config.parsed?.BOT_EMAIL) {
    const bot = await prisma.user.findUnique({
      where: { email: config.parsed.BOT_EMAIL },
    })
    if (bot !== null) {
      botId = bot.id
      return bot.id
    }
  }
  throw new Error('bot user not found')
}
