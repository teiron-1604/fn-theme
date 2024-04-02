import baseStyleDictionary, {
  type TransformedToken,
  type Platform,
} from 'style-dictionary'
import { CSS_VAR_PREFIX, WEB_PLATFORM, buildPath } from './config'
import {
  SpecialTokenType,
  type ExtraFilesOptions,
  type TokensConfig,
  LayoutCategoryName,
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

function isLayout(token: TransformedToken) {
  const { category } = token?.attributes || {}
  if (!category) return false
  return ['layout', 'size'].includes(category)
}

function handleLayoutToken(
  attrs: TransformedToken['attributes'],
  cssVar: string,
  rootJson: Record<string, any>,
) {
  const category = attrs?.category
  const level = attrs?.type
  if (!category || !level) return

  const prefix = category === 'size' ? '' : `${category}-`
  const subKey = `${prefix}${level}`
  Object.keys(LayoutCategoryName).forEach((i) => {
    const key = LayoutCategoryName[i as keyof typeof LayoutCategoryName]
    if (!rootJson[key]) {
      rootJson[key] = {}
    }
    rootJson[key][subKey] = cssVar
  })
}

function getUnoCategory(token: TransformedToken) {
  if (isColor(token)) return SpecialTokenType.Colors
  if (isTextColor(token)) return SpecialTokenType.TextColor
  if (isBackgroundColor(token)) return SpecialTokenType.BackgroundColor
  if (isBorderColor(token)) return SpecialTokenType.BorderColor

  const category = (token.attributes || {})?.category
  if (category === 'layout') return 'width'
  return category
}

baseStyleDictionary.registerFormat({
  name: 'uno/config',
  formatter({ dictionary }) {
    const json: Record<string, any> = {}

    dictionary.allProperties.forEach((token) => {
      const attrs = token.attributes || {}
      const category = getUnoCategory(token)
      const cssVar = `var(--${token.name})`

      if (isLayout(token)) {
        handleLayoutToken(attrs, cssVar, json)
        return
      }

      if (!category || !attrs.type) return
      if (!json[category]) {
        json[category] = {}
      }

      if (isColor(token)) {
        const colorName = attrs.category
        const colorLevel = attrs.type
        if (!colorName || !colorLevel) return
        if (!json[category][colorName]) {
          json[category][colorName] = {}
        }

        json[category][colorName][colorLevel] = cssVar
        return
      }

      if (isLayout(token)) {
        const subCategory = attrs.category
        const layoutLevel = attrs.type
        if (!subCategory || !layoutLevel) return
        const key = `${subCategory}-${layoutLevel}`
        json[category][key] = cssVar
        return
      }

      json[category][attrs.type] = cssVar
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

function getTailwindConfigFile() {
  const options: ExtraFilesOptions = {
    destination: `tailwind-config.json`,
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

  if (buildExtraFiles?.uno) {
    extraFiles.push(getTailwindConfigFile())
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
