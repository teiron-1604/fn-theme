import baseStyleDictionary, { type Platform } from 'style-dictionary'
import { CSS_VAR_PREFIX, WEB_PLATFORM, buildPath } from './config'
import { type ExtraFilesOptions, type TokensConfig } from './types'

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

baseStyleDictionary.registerFormat({
  name: 'uno/config',
  formatter({ dictionary }) {
    const json: Record<string, any> = {}

    dictionary.allProperties.forEach((token) => {
      const attrs = token.attributes || {}
      const isColor = token?.type === 'color'
      const category = isColor ? 'colors' : attrs.category
      const cssVar = `var(--${token.name})`

      if (!category || !attrs.type) return
      if (!json[category]) {
        json[category] = {}
      }

      if (!isColor) {
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
