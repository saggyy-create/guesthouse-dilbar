export const defaultBlockedRanges = [
  { start: '2026-06-01', end: '2026-06-05', reason: 'Тех. обслуживание' },
  { start: '2026-06-12', end: '2026-06-15', reason: 'Занято' },
]

export const seasonalPricing = {
  monthMultiplier: {
    6: 1.15,
    7: 1.25,
    8: 1.25,
    12: 1.2,
  },
}

export const roomPricing = {
  // Prices per night in USD (base for price calculator)
  standard: 15,
  deluxe: 18,
  suite: 22,
}

export const guesthousePricing = {
  pricePerBedUzs: 200000,
  pricePerBedUsd: 15,
  pricePerBedForeignUzs: 200000,
  currency: 'UZS',
}
