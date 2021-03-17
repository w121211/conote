import express from 'express'
import { PrismaClient } from '@prisma/client'

// export const prisma = new PrismaClient();
export const prisma = new PrismaClient({
  // errorFormat: 'pretty',
  // log: ['query', 'info', 'warn'],
})

export interface ExpressContext {
  req: express.Request
  res: express.Response
  // connection?: ExecutionParams;
}

export interface Context {
  prisma: PrismaClient
  req: express.Request
  res: express.Response
}

export function setCookie(res: express.Response, token: string): void {
  res.cookie('token', `Bearer ${token}`, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  })
}

export function createContext({ req, res }: ExpressContext): Context {
  return {
    prisma,
    req,
    res,
  }
}
