import { Button } from '@/app/components/ui/button'
import { i18n } from '@/lib/i18n'
import type { Language } from '@/lib/i18n/resources'
import { useTranslation } from 'react-i18next'

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: 'en', label: 'EN' },
  { value: 'pt', label: 'PT' },
]

export function LanguageSwitcher() {
  const { i18n: i18nInstance } = useTranslation()
  const activeLanguage = (i18nInstance.resolvedLanguage ?? i18n.language ?? 'en') as Language

  return (
    <div className="flex items-center gap-1 rounded-[--radius] border border-border p-1">
      {languageOptions.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={activeLanguage === option.value ? 'default' : 'ghost'}
          size="sm"
          className="h-8 px-3"
          onClick={() => void i18n.changeLanguage(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
