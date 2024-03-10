import { readFileSync, writeFileSync } from 'node:fs'
import {
  CSS_VAR_PREFIX,
  exportedFigmaTokensFile,
  parsedFigmaTokensFile,
} from './shared'

async function run() {
  const exported = readFileSync(exportedFigmaTokensFile, 'utf-8')
  const separator = '/* separator */'
  const prefixPattern = new RegExp(`${CSS_VAR_PREFIX}-`, 'gim')
  const replaced = exported
    .replace(prefixPattern, '')
    .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, separator)

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
