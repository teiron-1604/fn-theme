export type TokensBrand = 'global' | 'light' | 'dark'

export interface TokensConfig {
  brand: TokensBrand
  selector: string
  tokens: Record<string, any>
  buildExtraFiles?: {
    uno?: boolean
  }
}

export interface ExtraFilesOptions {
  format: string
  destination: string
}
