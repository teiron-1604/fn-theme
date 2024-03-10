import { remove } from '@bassist/node-utils'
import { cleanupFiles } from './shared'

async function run() {
  cleanupFiles.forEach((filePath) => {
    try {
      remove(filePath)
    } catch (e) {
      console.log(e)
    }
  })
}

run().catch((e) => {
  console.log(e)
})
