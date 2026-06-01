import { nightsBetween } from './dateRange'
import { roomPricing, seasonalPricing } from '../data/availability'

const getMonthMultiplier = (date) => {
  if (!date) return 1
  const m = new Date(date).getMonth() + 1
  return seasonalPricing?.monthMultiplier?.[m] || 1
}

export const calculatePriceUsd = ({
  stayType,
  roomType,
  checkIn,
  checkOut,
  guests,
}) => {
  const nights = nightsBetween(checkIn, checkOut)
  if (!nights) return { nights: 0, totalUsd: 0, nightlyUsd: 0, multiplier: 1 }

  // Base nightly USD
  let nightlyUsd = 0
  if (stayType === 'apartments') {
    // Temporary baseline; we'll set per-apartment later.
    nightlyUsd = 95
  } else {
    nightlyUsd = roomPricing?.[roomType] || 0
  }

  // Simple seasonal multiplier based on check-in month.
  const multiplier = getMonthMultiplier(checkIn)

  // Simple guest surcharge for apartments if >2 (placeholder)
  const guestCount = Number(guests || 0)
  const extra = stayType === 'apartments' && guestCount > 2 ? (guestCount - 2) * 5 : 0

  const nightlyFinal = (nightlyUsd + extra) * multiplier
  const totalUsd = nightlyFinal * nights

  return {
    nights,
    totalUsd,
    nightlyUsd: nightlyFinal,
    multiplier,
  }
}
