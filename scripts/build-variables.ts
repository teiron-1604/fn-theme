import lightTokens from '../assets/tokens/light.json'
import darkTokens from '../assets/tokens/dark.json'
import {
  getSdOverloadedConfig,
  baseStyleDictionary,
  type TokensConfig,
  WEB_PLATFORM,
} from './shared'

const configs: TokensConfig[] = [
  {
    brand: 'light',
    selector: ':root',
    tokens: lightTokens,
    buildExtraFiles: {
      uno: true,
      tailwind: true,
    },
  },
  {
    brand: 'dark',
    selector: ':root.dark',
    tokens: darkTokens,
  },
]

async function run() {
  console.log('')
  console.log('Build started...')

  configs.map((config) => {
    console.log('')
    console.log(`Processing:  [Web] [${config.brand}]`)

    const overloaded = getSdOverloadedConfig(config)
    const sd = baseStyleDictionary.extend(overloaded)
    sd.buildPlatform(WEB_PLATFORM)

    console.log('Done.')
    console.log('')
  })

  console.log('')
  console.log('Build completed!')
  console.log('')
}

run().catch((e) => {
  console.log(e)
})
