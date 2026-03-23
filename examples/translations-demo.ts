import { initializeApi, translations } from '../src'

async function main() {
  initializeApi({
    baseURL: 'https://smartlinks.app/api/v1',
  })

  const collectionId = 'demo-collection'

  const response = await translations.resolve(collectionId, {
    targetLanguage: 'fr',
    sourceLanguage: 'en',
    context: {
      surface: 'portal-product-page',
      field: 'description',
    },
    texts: [
      'Welcome to the product page',
      'Scan to verify authenticity',
      'Welcome to the product page',
    ],
  })

  for (const item of response.items) {
    console.log({
      index: item.index,
      cacheSource: item.cacheSource,
      translatedText: item.translatedText,
    })
  }

  const hash = await translations.hashText('Claim your item')
  console.log('Local hash:', hash)
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})