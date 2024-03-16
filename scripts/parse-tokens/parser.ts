import type { Theme } from '@unocss/preset-wind'

type AnyRecord = Record<string, any>

export class FigmaTokenParser {
  private themeConfig: AnyRecord

  constructor(themeConfig: AnyRecord) {
    this.themeConfig = themeConfig
  }

  /**
   * Merge the configuration exported by Figma with the convention configuration
   */
  public mergeConfig(config: AnyRecord) {
    this.themeConfig = {
      ...this.themeConfig,
      ...config,
    }

    return this
  }

  /**
   * Change the type of a set of Tokens to another type,
   * to anchor it under another Theme type (e.g. `color` --> `textColor`)
   *
   * @param rootKey - The first level key under the object
   * @param anotherType - Valid Uno CSS theme type
   */
  public setAnotherTokenType(rootKey: string, anotherType: keyof Theme) {
    const tokenConfig = this.themeConfig[rootKey]

    for (const key in tokenConfig) {
      if (Object.prototype.hasOwnProperty.call(tokenConfig, key)) {
        tokenConfig[key].type = anotherType
      }
    }

    return this
  }

  private addUnit(tokenConfig: AnyRecord) {
    for (const key in tokenConfig) {
      if (Object.prototype.hasOwnProperty.call(tokenConfig, key)) {
        if (tokenConfig[key]?.type === 'number') {
          tokenConfig[key].value = `${tokenConfig[key].value}px`
        }
      }
    }
  }

  /**
   * Number tokens exported by Figma usually do not have units.
   */
  public addUnitToNumberTokens() {
    for (const key in this.themeConfig) {
      if (Object.prototype.hasOwnProperty.call(this.themeConfig, key)) {
        this.addUnit(this.themeConfig[key])
      }
    }
    return this
  }

  /**
   * At the end of the task,
   * this method must be called to obtain the processed Token data
   */
  public done() {
    return this.themeConfig
  }
}
