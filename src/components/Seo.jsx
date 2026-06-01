import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../context/LanguageContext'

const Seo = ({ title, description, image }) => {
  const { language } = useLanguage()
  const lang = language === 'ru' ? 'ru' : 'en'
  const siteName = 'Guesthouse Dilbar'
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Гостевой дом в центре города`
  const desc = description || 'Guesthouse Dilbar — уютный гостевой дом и апартаменты. Бронирование онлайн, удобное расположение, доступные цены.'
  const img = image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200'

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  )
}

export default Seo
