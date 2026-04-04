import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from '@/lib/i18n/resources'

const STORAGE_KEY = 'somas.language'
const supportedLanguages = ['en', 'pt'] as const

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en'

  const storedLanguage = window.localStorage.getItem(STORAGE_KEY)
  if (storedLanguage && supportedLanguages.includes(storedLanguage as 'en' | 'pt')) {
    return storedLanguage
  }

  const browserLanguage = window.navigator.language.toLowerCase()
  if (browserLanguage.startsWith('pt')) {
    return 'pt'
  }

  return 'en'
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

  i18n.on('languageChanged', (language) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, language)
    }
  })
}

export { i18n }
