import IStorage from './i-storage'

export type ThemeType = 'dark' | 'light'

enum Locals {
  Theme = 'theme',
}

export default class ThemeStorage extends IStorage<Locals> {
  private static instance?: ThemeStorage
  private isTheme(value: ThemeType | null | string): value is ThemeType | null {
    return (value as ThemeType) === 'dark' || (value as ThemeType) === 'light'
  }

  private constructor() {
    super()
  }

  public static getInstance() {
    // if (!this.instance) {
    //   this.instance = new ThemeStorage()
    // }
    return this.instance
  }

  public static newInstance() {
    if (!this.instance) {
      this.instance = new ThemeStorage()
    }
    return this.instance
  }

  public getTheme(): ThemeType | null {
    const data = this.get(Locals.Theme)
    if (this.isTheme(data)) {
      return data
    }
    return null
  }

  public setTheme(theme: ThemeType) {
    this.set(Locals.Theme, theme)
  }

  public clear() {
    this.clearItem(Locals.Theme)
  }
}
