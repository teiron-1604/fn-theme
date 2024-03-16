import { readFileSync, writeFileSync } from 'node:fs'
import {
  CSS_VAR_PREFIX,
  exportedFigmaTokensFile,
  parsedFigmaTokensFile,
} from '../shared'
import { FigmaTokenParser } from './parser'

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

  const [light, dark] = [_light, _dark].map((tokens) => {
    return new FigmaTokenParser(tokens)
      .addUnitToNumberTokens()
      .setAnotherTokenType('text', 'textColor')
      .setAnotherTokenType('bg', 'backgroundColor')
      .setAnotherTokenType('border', 'borderColor')
      .done()
  })

  const foundations = new FigmaTokenParser(_foundations)
    .addUnitToNumberTokens()
    .done()

  const global = new FigmaTokenParser(_global).addUnitToNumberTokens().done()

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
