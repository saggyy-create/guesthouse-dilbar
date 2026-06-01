import AvailabilityAdmin from './AvailabilityAdmin'
import HomePage from '../pages/HomePage'
import ApartmentsPage from '../pages/ApartmentsPage'
import ApartmentDetailPage from '../pages/ApartmentDetailPage'
import NotFound from './NotFound'

const normalizePath = (p) => {
  if (!p) return '/'
  // Remove query/hash.
  const clean = p.split('?')[0].split('#')[0]
  if (clean.length > 1 && clean.endsWith('/')) return clean.slice(0, -1)
  return clean
}

const Routes = () => {
  // Use hash routing for static hosting compatibility.
  // Many static servers won't rewrite /admin -> index.html.
  const hash = (window.location.hash || '').replace(/^#/, '')
  const h = normalizePath(hash.startsWith('/') ? hash : `/${hash}`)
  if (h === '/admin') return <AvailabilityAdmin />
  if (h === '/apartments') return <ApartmentsPage />
  if (h.startsWith('/apartments/')) {
    const id = h.split('/')[2]
    if (id === '1' || id === '2' || id === '3') return <ApartmentDetailPage apartmentId={id} />
  }

  const path = normalizePath(window.location.pathname)
  if (path === '/') return <HomePage />
  // Allow /admin when server is configured for SPA fallback.
  if (path === '/admin') return <AvailabilityAdmin />
  if (path === '/apartments') return <ApartmentsPage />
  if (path.startsWith('/apartments/')) {
    const id = path.split('/')[2]
    if (id === '1' || id === '2' || id === '3') return <ApartmentDetailPage apartmentId={id} />
  }
  return <NotFound />
}

export default Routes
