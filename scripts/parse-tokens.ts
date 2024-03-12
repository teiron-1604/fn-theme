import { readFileSync, writeFileSync } from 'node:fs'
import {
  CSS_VAR_PREFIX,
  exportedFigmaTokensFile,
  parsedFigmaTokensFile,
} from './shared'

function setAnotherTokenType(
  tokenConfig: Record<string, any>,
  anotherType: string,
) {
  const newTokenConfig: Record<string, any> = {}
  for (const key in tokenConfig) {
    if (Object.prototype.hasOwnProperty.call(tokenConfig, key)) {
      newTokenConfig[key] = tokenConfig[key]
      newTokenConfig[key].type = anotherType
    }
  }
  return newTokenConfig
}

function addUnit(tokenConfig: Record<string, any>) {
  for (const key in tokenConfig) {
    if (Object.prototype.hasOwnProperty.call(tokenConfig, key)) {
      if (tokenConfig[key]?.type === 'number') {
        tokenConfig[key].value = `${tokenConfig[key].value}px`
      }
    }
  }
}

function addUnitToNumberTokens(config: Record<string, any>) {
  const newConfig: Record<string, any> = {}
  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      newConfig[key] = config[key]
      addUnit(newConfig[key])
    }
  }
  return newConfig
}

async function run() {
  const exported = readFileSync(exportedFigmaTokensFile, 'utf-8')
  const separator = '/* separator */'
  const prefixPattern = new RegExp(`${CSS_VAR_PREFIX}-`, 'gim')
  const replaced = exported
    .replace(prefixPattern, '')
    .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, separator)
    .replace('"radius"', '"borderRadius"')
    .replace(/radius-/g, 'size-')
    .replace(/blur-/g, '')

  const fragments = replaced
    .split(separator)
    .map((i) => {
      try {
        return JSON.parse(i)
      } catch (e) {
        console.log(i)
      }
    })
    .filter(Boolean)

  const [_light, _dark, _foundations, _global] = fragments

  const light = addUnitToNumberTokens(_light)
  const dark = addUnitToNumberTokens(_dark)
  const foundations = addUnitToNumberTokens(_foundations)
  const global = addUnitToNumberTokens(_global)

  light.text = setAnotherTokenType(light.text, 'textColor')
  light.bg = setAnotherTokenType(light.bg, 'backgroundColor')
  light.border = setAnotherTokenType(light.border, 'borderColor')

  dark.text = setAnotherTokenType(dark.text, 'textColor')
  dark.bg = setAnotherTokenType(dark.bg, 'backgroundColor')
  dark.border = setAnotherTokenType(dark.border, 'borderColor')

  const json = {
    global: { ...global, ...foundations },
    light,
    dark,
  }

  const content = JSON.stringify(json, null, 2)
  writeFileSync(parsedFigmaTokensFile, content)
}

run().catch((e) => {
  console.log(e)
})
