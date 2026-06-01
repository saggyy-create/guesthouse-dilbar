// Minimal ICS parser for iCal feeds.
// We only care about DTSTART/DTEND for VEVENT.

const unfoldLines = (text) => {
  // RFC 5545 line folding: lines starting with space/tab continue previous.
  const raw = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const out = []
  for (const line of raw) {
    if (!line) continue
    if (/^[ \t]/.test(line) && out.length) out[out.length - 1] += line.slice(1)
    else out.push(line)
  }
  return out
}

const parseDateValue = (value) => {
  // Supports YYYYMMDD and YYYYMMDDTHHMMSSZ.
  if (!value) return null
  const v = value.trim()
  if (/^\d{8}$/.test(v)) {
    const y = Number(v.slice(0, 4))
    const m = Number(v.slice(4, 6))
    const d = Number(v.slice(6, 8))
    return new Date(y, m - 1, d)
  }
  if (/^\d{8}T\d{6}Z$/.test(v)) {
    const y = Number(v.slice(0, 4))
    const m = Number(v.slice(4, 6))
    const d = Number(v.slice(6, 8))
    // Interpret UTC date-time but return local date component.
    const dt = new Date(Date.UTC(y, m - 1, d, 0, 0, 0))
    return new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate())
  }
  return null
}

const isoLocal = (d) => {
  const dt = new Date(d)
  dt.setHours(0, 0, 0, 0)
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const parseIcsToBlockedRanges = (icsText, reason = 'Импорт') => {
  const lines = unfoldLines(icsText)
  const out = []
  let inEvent = false
  let dtStart = null
  let dtEnd = null

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true
      dtStart = null
      dtEnd = null
      continue
    }
    if (line === 'END:VEVENT') {
      if (inEvent && dtStart) {
        const s = dtStart
        // DTEND in ICS is exclusive for all-day events.
        let e = dtEnd || dtStart
        const endDt = new Date(e)
        endDt.setHours(0, 0, 0, 0)
        // subtract 1 day for exclusive DTEND when available and > DTSTART
        if (dtEnd && endDt.getTime() > s.getTime()) {
          endDt.setDate(endDt.getDate() - 1)
        }
        out.push({
          start: isoLocal(s),
          end: isoLocal(endDt),
          reason,
        })
      }
      inEvent = false
      dtStart = null
      dtEnd = null
      continue
    }

    if (!inEvent) continue

    // DTSTART;VALUE=DATE:20260521
    if (line.startsWith('DTSTART')) {
      const value = line.split(':').slice(1).join(':')
      const d = parseDateValue(value)
      if (d) {
        d.setHours(0, 0, 0, 0)
        dtStart = d
      }
    }
    if (line.startsWith('DTEND')) {
      const value = line.split(':').slice(1).join(':')
      const d = parseDateValue(value)
      if (d) {
        d.setHours(0, 0, 0, 0)
        dtEnd = d
      }
    }
  }

  return out
}
