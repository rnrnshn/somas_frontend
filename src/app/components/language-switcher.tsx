import { i18n } from '@/lib/i18n'
import type { Language } from '@/lib/i18n/resources'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: 'en', label: 'EN' },
  { value: 'pt', label: 'PT' },
]

export function LanguageSwitcher() {
  const { i18n: i18nInstance } = useTranslation()
  const activeLanguage = (i18nInstance.resolvedLanguage ?? i18n.language ?? 'en') as Language

  return (
    <div
      className="inline-flex w-full items-center rounded-[calc(var(--radius)+2px)] bg-muted p-1"
      role="group"
      aria-label="Language switcher"
    >
      {languageOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            'flex-1 rounded-[calc(var(--radius)-2px)] px-4 py-2 text-sm font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring]',
            activeLanguage === option.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
          )}
          aria-pressed={activeLanguage === option.value}
          onClick={() => void i18n.changeLanguage(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
