import { resolve } from 'node:path'

export const CSS_VAR_PREFIX = 'fn'

export const WEB_PLATFORM = 'web'

export const OUTPUT_DIR = 'dist'

export const ASSETS_DIR = 'assets'

const cwd = process.cwd()

export const distPath = resolve(cwd, `./${OUTPUT_DIR}`)

export const assetsPath = resolve(cwd, `./${ASSETS_DIR}`)

export const figmaTokensPath = resolve(assetsPath, `./figma-tokens`)

export const exportedFigmaTokensFile = resolve(
  figmaTokensPath,
  `./fn-tokens-exported.txt`,
)

export const parsedFigmaTokensFile = resolve(
  figmaTokensPath,
  `./fn-tokens.json`,
)

export const tokensPath = resolve(assetsPath, `./tokens`)

export const variablesPath = resolve(assetsPath, `./variables`)

export const cleanupFiles = [
  distPath,
  parsedFigmaTokensFile,
  tokensPath,
  variablesPath,
]

export const buildPath = `./${ASSETS_DIR}/variables/`
