import { loadJson, saveJson, storageKeys } from './storage'

const DEFAULT = {
  primary: 'UZS',
  secondary: 'USD',
  // Simple FX rate; replace with real or fetch later.
  usdToUzs: 12600,
}

export const loadCurrencyPref = () => {
  const raw = loadJson(storageKeys.currencyPref, null)
  return {
    ...DEFAULT,
    ...(raw && typeof raw === 'object' ? raw : null),
  }
}

export const saveCurrencyPref = (pref) => {
  saveJson(storageKeys.currencyPref, pref)
}

export const formatMoney = (amount, currency) => {
  if (!Number.isFinite(amount)) return '—'
  try {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'UZS' ? 0 : 0,
    }).format(amount)
  } catch {
    return `${Math.round(amount)} ${currency}`
  }
}

export const convert = (amount, from, to, usdToUzs) => {
  if (!Number.isFinite(amount)) return NaN
  if (from === to) return amount
  if (from === 'USD' && to === 'UZS') return amount * usdToUzs
  if (from === 'UZS' && to === 'USD') return amount / usdToUzs
  return amount
}
