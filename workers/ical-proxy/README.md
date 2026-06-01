# iCal Proxy (Cloudflare Worker)

This Worker fetches iCal/ICS URLs and returns them with permissive CORS headers.

## Endpoints

- `GET /ical?url=<encoded_ics_url>`

Example:

`https://<your-worker>.workers.dev/ical?url=https%3A%2F%2Fwww.airbnb.ru%2Fcalendar%2Fical%2F...ics%3Ft%3D...`

## Deploy (quick)

1. Install `wrangler`

`npm i -g wrangler`

2. Login

`wrangler login`

3. Deploy

From this folder:

`wrangler deploy`

Then use the Worker URL in the site admin.
