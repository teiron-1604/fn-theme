import { resolve } from 'node:path'
import { copy } from '@bassist/node-utils'
import { distPath, variablesPath } from './shared'

async function run() {
  const filenames = ['light-variables.css', 'dark-variables.css']

  const files = filenames.map((name) => {
    return {
      src: resolve(variablesPath, name),
      dest: resolve(distPath, name),
    }
  })

  files.forEach((i) => copy(i.src, i.dest))
}

run().catch((e) => {
  console.log(e)
})
