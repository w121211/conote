import type { User } from '@prisma/client'
import prisma from '../prisma'

if (process.env.APP_BOT_EMAIL === undefined) {
  throw new Error('Not found APP_BOT_EMAIL')
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
  throw new Error('[getBotId] Bot user not found')
}

export async function getOrCreateUser(
  uid: string,
  email: string,
): Promise<User> {
  const user = await prisma.user.upsert({
    create: { id: uid, email },
    update: {},
    where: { email },
  })
  return user
}
