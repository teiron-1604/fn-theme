import baseStyleDictionary, {
  type TransformedToken,
  type Platform,
} from 'style-dictionary'
import { CSS_VAR_PREFIX, WEB_PLATFORM, buildPath } from './config'
import {
  SpecialTokenType,
  type ExtraFilesOptions,
  type TokensConfig,
} from './types'

const { fileHeader, formattedVariables } = baseStyleDictionary.formatHelpers

baseStyleDictionary.registerFormat({
  name: 'css/variables',
  formatter({ dictionary, file, options }) {
    const { outputReferences, selector } = options

    return [
      fileHeader({ file }),
      `${selector} {`,
      formattedVariables({
        format: 'css',
        dictionary,
        outputReferences,
      }),
      `}`,
    ].join('\n')
  },
})

function isColor(token: TransformedToken) {
  return token?.type === SpecialTokenType.Color
}

function isTextColor(token: TransformedToken) {
  return token?.type === SpecialTokenType.TextColor
}

function isBackgroundColor(token: TransformedToken) {
  return token?.type === SpecialTokenType.BackgroundColor
}

function isBorderColor(token: TransformedToken) {
  return token?.type === SpecialTokenType.BorderColor
}

function getUnoCategory(token: TransformedToken) {
  if (isColor(token)) return SpecialTokenType.Colors
  if (isTextColor(token)) return SpecialTokenType.TextColor
  if (isBackgroundColor(token)) return SpecialTokenType.BackgroundColor
  if (isBorderColor(token)) return SpecialTokenType.BorderColor
  return (token.attributes || {})?.category
}

baseStyleDictionary.registerFormat({
  name: 'uno/config',
  formatter({ dictionary }) {
    const json: Record<string, any> = {}

    dictionary.allProperties.forEach((token) => {
      const attrs = token.attributes || {}
      const category = getUnoCategory(token)
      const cssVar = `var(--${token.name})`

      if (!category || !attrs.type) return
      if (!json[category]) {
        json[category] = {}
      }

      if (!isColor(token)) {
        json[category][attrs.type] = cssVar
        return
      }

      const colorName = attrs.category
      const colorLevel = attrs.type
      if (!colorName || !colorLevel) return
      if (!json[category][colorName]) {
        json[category][colorName] = {}
      }

      json[category][colorName][colorLevel] = cssVar
    })

    return JSON.stringify(json, null, 2)
  },
})

export { baseStyleDictionary }

function getUnoConfigFile() {
  const options: ExtraFilesOptions = {
    destination: `uno-config.json`,
    format: 'uno/config',
  }
  return options
}

export function getSdOverloadedConfig(tokensConfig: TokensConfig) {
  const { brand, tokens, selector, buildExtraFiles } = tokensConfig

  const extraFiles: ExtraFilesOptions[] = []

  if (buildExtraFiles?.uno) {
    extraFiles.push(getUnoConfigFile())
  }

  const webPlatFormConfig: Platform = {
    transformGroup: WEB_PLATFORM,
    prefix: CSS_VAR_PREFIX,
    buildPath,
    files: [
      {
        destination: `${brand}-variables.css`,
        format: 'css/variables',
      },
      ...extraFiles,
    ],
    options: {
      selector,
    },
  }

  return {
    tokens,
    platforms: {
      [WEB_PLATFORM]: webPlatFormConfig,
    },
  }
}
