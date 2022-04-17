import IStorage from './i-storage'

export type ChannelType = 'dev' | 'fin'

enum Locals {
  CHANNEL = 'channel',
}

export default class ChannelStorage extends IStorage<Locals> {
  private static instance?: ChannelStorage
  private isChannel(value: ChannelType | null | string): value is ChannelType | null {
    return (value as ChannelType) === 'dev' || (value as ChannelType) === 'fin'
  }

  private constructor() {
    super()
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ChannelStorage()
    }
    return this.instance
  }

  public getChannel(): ChannelType | null {
    const data = this.get(Locals.CHANNEL)
    if (this.isChannel(data)) {
      return data
    }
    return null
  }

  public setChannel(channel: ChannelType) {
    this.set(Locals.CHANNEL, channel)
  }

  public clear() {
    this.clearItem(Locals.CHANNEL)
  }
}
