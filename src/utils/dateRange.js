const toLocalDate = (d) => {
  const dt = new Date(d)
  dt.setHours(0, 0, 0, 0)
  return dt
}

export const parseISODate = (iso) => {
  // iso: YYYY-MM-DD
  const [y, m, day] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, day)
  dt.setHours(0, 0, 0, 0)
  return dt
}

export const isDateInRangeInclusive = (date, start, end) => {
  const d = toLocalDate(date).getTime()
  const s = toLocalDate(start).getTime()
  const e = toLocalDate(end).getTime()
  return d >= s && d <= e
}

export const doesRangeOverlapInclusive = (aStart, aEnd, bStart, bEnd) => {
  const as = toLocalDate(aStart).getTime()
  const ae = toLocalDate(aEnd).getTime()
  const bs = toLocalDate(bStart).getTime()
  const be = toLocalDate(bEnd).getTime()
  return as <= be && bs <= ae
}

export const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  const start = toLocalDate(checkIn)
  const end = toLocalDate(checkOut)
  const ms = end.getTime() - start.getTime()
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
  return Math.max(0, days)
}
