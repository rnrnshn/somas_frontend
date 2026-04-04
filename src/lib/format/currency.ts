type CurrencyFormatOptions = {
  maximumFractionDigits?: number
}

export function formatMetical(amount: number, options?: CurrencyFormatOptions) {
  const { maximumFractionDigits = 0 } = options ?? {}

  return `MZN ${amount.toLocaleString('pt-MZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })}`
}

export function formatCompactMetical(amount: number) {
  const absoluteAmount = Math.abs(amount)

  if (absoluteAmount >= 1_000_000) {
    return `MZN ${(amount / 1_000_000).toFixed(2)}M`
  }

  if (absoluteAmount >= 1_000) {
    return `MZN ${(amount / 1_000).toFixed(1)}K`
  }

  return formatMetical(amount)
}
