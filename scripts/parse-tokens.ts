import { readFileSync, writeFileSync } from 'node:fs'
import {
  CSS_VAR_PREFIX,
  exportedFigmaTokensFile,
  parsedFigmaTokensFile,
} from './shared'

function setAnotherTokenType(config: Record<string, any>, anotherType: string) {
  const newConfig: Record<string, any> = {}
  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      newConfig[key] = config[key]
      newConfig[key].type = anotherType
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
    .replace('"blur"', '"blur"')
    .replace(/(radius|blur)-/g, '')

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

  const [light, dark, foundations, global] = fragments

  light.text = setAnotherTokenType(light.text, 'textColor')
  dark.text = setAnotherTokenType(dark.text, 'textColor')

  light.bg = setAnotherTokenType(light.bg, 'backgroundColor')
  dark.bg = setAnotherTokenType(dark.bg, 'backgroundColor')

  light.border = setAnotherTokenType(light.border, 'borderColor')
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
