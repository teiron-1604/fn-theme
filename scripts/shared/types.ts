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

export enum SpecialTokenType {
  Color = 'color',
  Colors = 'colors',
  TextColor = 'textColor',
  BackgroundColor = 'backgroundColor',
  BorderColor = 'borderColor',
}

// `layout` and `size` tokens
export enum LayoutCategoryName {
  Width = 'width',
  Height = 'height',
  MaxWidth = 'maxWidth',
  MaxHeight = 'maxHeight',
  MinWidth = 'minWidth',
  MinHeight = 'minHeight',
}
