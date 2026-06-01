import { useLanguage } from '../context/LanguageContext'

const NotFound = () => {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-display font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 font-body mb-8">{t.notFound.title}</p>
        <a className="btn-primary inline-block" href="/">{t.notFound.back}</a>
      </div>
    </div>
  )
}

export default NotFound
