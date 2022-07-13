import IStorage from '../../../share/i-storage'

export type DomainType = 'dev' | 'fin'

enum Locals {
  DOMAIN = 'domain',
}

export default class DomainStorage extends IStorage<Locals> {
  private static instance?: DomainStorage
  private isDomain(
    value: DomainType | null | string,
  ): value is DomainType | null {
    return (value as DomainType) === 'dev' || (value as DomainType) === 'fin'
  }

  private constructor() {
    super()
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new DomainStorage()
    }
    return this.instance
  }

  public getDomain(): DomainType | null {
    const data = this.get(Locals.DOMAIN)
    if (this.isDomain(data)) {
      return data
    }
    return null
  }

  public setDomain(domain: DomainType) {
    this.set(Locals.DOMAIN, domain)
  }

  public clear() {
    this.clearItem(Locals.DOMAIN)
  }
}
