const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

const error = (msg, status = 400) => json({ error: msg }, status)

const getBody = async (req) => {
  try { return await req.json() } catch { return null }
}

const kv = {
  async get(env, key) {
    if (!env?.AVAILABILITY_KV) return null
    try { return await env.AVAILABILITY_KV.get(key, 'json') } catch { return null }
  },
  async put(env, key, val) {
    if (!env?.AVAILABILITY_KV) return
    try { await env.AVAILABILITY_KV.put(key, JSON.stringify(val)) } catch {}
  },
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const method = request.method

    if (method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })

    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response('OK: iCal proxy + API is running', {
        status: 200,
        headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    if (url.pathname === '/ical') return handleIcal(url, cors)
    if (url.pathname === '/merged.ics') return handleMergedIcal(env, cors)
    if (url.pathname === '/status') return json({ ok: true, cron: '0 * * * *' })

    // ---- API routes ----
    const matchRanges = url.pathname.match(/^\/api\/ranges\/([^/]+)$/)
    const matchRangeByIndex = url.pathname.match(/^\/api\/ranges\/([^/]+)\/(\d+)$/)
    const matchImported = url.pathname.match(/^\/api\/imported\/([^/]+)$/)
    const matchSources = url.pathname.match(/^\/api\/sources$/)
    const matchBookings = url.pathname.match(/^\/api\/bookings$/)

    if (matchRanges) {
      const calId = matchRanges[1]
      const data = (await kv.get(env, `ranges:${calId}`)) || []
      if (method === 'GET') return json(data)
      if (method === 'POST') {
        const body = await getBody(request)
        if (!body?.start || !body?.end) return error('Missing start/end')
        data.push({ start: String(body.start).slice(0, 10), end: String(body.end).slice(0, 10), reason: String(body.reason || 'Занято').slice(0, 60) })
        await kv.put(env, `ranges:${calId}`, data)
        return json(data)
      }
      if (method === 'PUT') {
        const body = await getBody(request)
        if (!body?.start || !body?.end) return error('Missing start/end')
        data.push({ start: String(body.start).slice(0, 10), end: String(body.end).slice(0, 10), reason: String(body.reason || 'Занято').slice(0, 60) })
        await kv.put(env, `ranges:${calId}`, data)
        return json(data)
      }
      if (method === 'DELETE') {
        await kv.put(env, `ranges:${calId}`, [])
        return json([])
      }
      return error('Method not allowed', 405)
    }

    if (matchRangeByIndex) {
      const calId = matchRangeByIndex[1]
      const idx = parseInt(matchRangeByIndex[2], 10)
      const data = (await kv.get(env, `ranges:${calId}`)) || []
      if (method === 'PUT') {
        const body = await getBody(request)
        if (!body) return error('Invalid body')
        if (idx < 0 || idx >= data.length) return error('Index out of bounds', 404)
        data[idx] = { start: String(body.start || data[idx].start).slice(0, 10), end: String(body.end || data[idx].end).slice(0, 10), reason: String(body.reason || data[idx].reason || 'Занято').slice(0, 60) }
        await kv.put(env, `ranges:${calId}`, data)
        return json(data)
      }
      if (method === 'DELETE') {
        if (idx < 0 || idx >= data.length) return error('Index out of bounds', 404)
        data.splice(idx, 1)
        await kv.put(env, `ranges:${calId}`, data)
        return json(data)
      }
      return error('Method not allowed', 405)
    }

    if (matchImported) {
      const calId = matchImported[1]
      if (method === 'GET') return json((await kv.get(env, `imported:${calId}`)) || [])
      if (method === 'PUT') {
        const body = await getBody(request)
        if (!Array.isArray(body)) return error('Body must be an array')
        await kv.put(env, `imported:${calId}`, body)
        return json(body)
      }
      return error('Method not allowed', 405)
    }

    if (matchSources) {
      if (method === 'GET') return json((await kv.get(env, 'sources')) || {})
      if (method === 'PUT') {
        const body = await getBody(request)
        if (!body || typeof body !== 'object') return error('Body must be an object')
        await kv.put(env, 'sources', body)
        return json(body)
      }
      return error('Method not allowed', 405)
    }

    if (matchBookings) {
      if (method === 'POST') {
        const body = await getBody(request)
        if (!body) return error('Invalid body')
        const existing = (await kv.get(env, 'bookings')) || []
        const booking = { id: String(Date.now()) + '-' + String(Math.random()).slice(2, 8), ...body, createdAt: new Date().toISOString() }
        existing.push(booking)
        await kv.put(env, 'bookings', existing)
        return json(booking, 201)
      }
      if (method === 'GET') return json((await kv.get(env, 'bookings')) || [])
      return error('Method not allowed', 405)
    }

    return new Response('Not found', { status: 404, headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' } })
  },

  async scheduled(_event, env, ctx) {
    const base = (env?.SELF_BASE_URL || 'https://gd-ical-proxy.dilbarhostel.workers.dev').replace(/\/$/, '')
    ctx.waitUntil(fetch(`${base}/merged.ics`).catch(() => {}))
  },
}

async function handleIcal(url, cors) {
  const target = url.searchParams.get('url')
  if (!target) return new Response('Missing url', { status: 400, headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' } })
  let targetUrl
  try { targetUrl = new URL(target) } catch { return new Response('Invalid url', { status: 400, headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' } }) }
  if (targetUrl.protocol !== 'https:' && targetUrl.protocol !== 'http:') return new Response('Unsupported protocol', { status: 400, headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' } })
  const resp = await fetch(targetUrl.toString(), { method: 'GET', headers: { 'User-Agent': 'GuesthouseDilbar-iCalProxy/1.0', 'Accept': 'text/calendar,*/*' } })
  if (!resp.ok) return new Response(`Upstream error: ${resp.status}`, { status: 502, headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' } })
  return new Response(await resp.text(), { status: 200, headers: { ...cors, 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=300' } })
}

async function handleMergedIcal(env, cors) {
  const airbnb = env?.AIRBNB_ICAL_URL || ''
  const booking = env?.BOOKING_ICAL_URL || ''
  const urls = []
  if (airbnb) urls.push({ label: 'Airbnb', url: airbnb })
  if (booking) urls.push({ label: 'Booking', url: booking })
  if (!urls.length) return new Response('Missing AIRBNB_ICAL_URL/BOOKING_ICAL_URL', { status: 400, headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' } })
  const parts = []
  for (const s of urls) {
    const r = await fetch(s.url, { method: 'GET', headers: { 'User-Agent': 'GuesthouseDilbar-iCalProxy/1.0', 'Accept': 'text/calendar,*/*' } })
    if (!r.ok) return new Response(`Upstream error (${s.label}): ${r.status}`, { status: 502, headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' } })
    parts.push(await r.text())
  }
  return new Response(parts.join('\n'), { status: 200, headers: { ...cors, 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=3600' } })
}
