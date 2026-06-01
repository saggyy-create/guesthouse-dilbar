import { createContext, useContext, useState } from 'react'

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      rooms: 'Rooms',
      gallery: 'Gallery',
      booking: 'Booking',
      reviews: 'Reviews',
      contact: 'Contact',
      apartments: 'Apartments',
      compare: 'Compare',
      availability: 'Availability',
      faq: 'FAQ',
      apartmentsSection: 'Apartments section →',
    },
    hero: {
      title: 'Welcome to Guesthouse Dilbar',
      subtitle: 'Your Perfect Home Away From Home',
      description: 'Experience comfort, luxury and hospitality in the heart of the city',
      bookNow: 'Book Now',
      explore: 'Explore More',
    },
    about: {
      title: 'About Us',
      subtitle: 'A cozy co-living in the heart of the city. Clean, comfortable, friendly atmosphere.',
      description: 'Our guesthouse is the perfect place for those who appreciate home comfort, cleanliness, and a warm atmosphere. Spacious rooms, a fully equipped kitchen, lounge areas, and attentive staff will make your stay unforgettable. Only 5 rooms, up to 22 guests — it is never noisy or crowded here.',
    },
    rooms: {
      title: 'Our Rooms',
      subtitle: 'Choose Your Perfect Space',
      standard: 'Standard Room',
      deluxe: 'Deluxe Room',
      suite: 'Suite',
      perNight: 'per night',
      viewDetails: 'View Details',
      guests: 'guests',
      amenities: 'Amenities',
    },
    gallery: {
      title: 'Gallery',
      subtitle: 'Explore Our Beautiful Space',
    },
    booking: {
      title: 'Book Your Stay',
      subtitle: 'Reserve Your Room Today',
      checkIn: 'Check-in Date',
      checkOut: 'Check-out Date',
      guests: 'Number of Guests',
      roomType: 'Room Type',
      selectRoom: 'Select Room Type',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      specialRequests: 'Special Requests',
      submit: 'Book Now',
      success: 'Booking request sent successfully!',
      error: 'Please fill in all required fields',
      price: 'Price',
      priceNote: 'Preliminary calculation. Final price confirmed upon reply.',
      perNight: 'per night',
      seasonalMultiplier: 'seasonal multiplier',
      currency: 'currency',
      rate: 'rate',
      pickDates: 'Pick dates to see the price.',
      stayFormat: 'Accommodation type',
      guesthouse: 'Guesthouse (rooms)',
      apartmentOption: 'Apartment (flat)',
      copyRequest: 'Copy request',
      sendWhatsApp: 'Send via WhatsApp',
      done: 'Done',
      datesUnavailable: 'Selected dates are not available. Please choose other dates.',
    },
    stickyBar: {
      quickBooking: 'Quick Booking',
      pickDates: 'Pick dates to see the price',
      guesthouse: 'Guesthouse',
      apartments: 'Apartments',
      guests: 'guests',
      booked: 'Booked',
      toForm: 'To form',
      hide: 'Hide',
      show: 'Show',
      datesTaken: 'Selected dates are taken. Choose other dates.',
    },
    availability: {
      title: 'Availability Calendar',
      subtitle: 'Check available dates for your stay',
      legendAvailable: 'Available',
      legendBooked: 'Booked',
      legendSelected: 'Selected',
    },
    reviews: {
      title: 'Guest Reviews',
      subtitle: 'What Our Guests Say About Us',
    },
    location: {
      title: 'Find Us',
      subtitle: 'Visit Us Today',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      getDirections: 'Get Directions',
    },
    footer: {
      description: 'Your perfect home away from home. Experience comfort and hospitality.',
      quickLinks: 'Quick Links',
      contact: 'Contact Info',
      followUs: 'Follow Us',
      rights: 'All rights reserved.',
    },
    apartments: {
      title: 'Our Apartments',
      subtitle: 'Fully equipped flats for your stay',
      features: 'Features',
      area: 'Area',
      beds: 'Beds',
      guests: 'Guests',
      viewDetails: 'View Details',
      bookNow: 'Book Now',
      backToAll: 'Back to all apartments',
      backToHome: 'Back to home',
    },
    admin: {
      title: 'Admin: Availability Calendar',
      description: 'Data is stored in the cloud (Cloudflare KV) and locally. Available on all devices.',
      selectCalendar: 'Calendar',
      sync: 'iCal Sync',
      syncDesc: 'iCal links are fetched via Cloudflare Worker proxy.',
      workerUrl: 'Cloudflare Worker URL',
      airbnbUrl: 'Airbnb iCal URL',
      bookingUrl: 'Booking.com iCal URL',
      syncNow: 'Sync now',
      clearImport: 'Clear import',
      noRanges: 'No blocked intervals yet.',
      start: 'Start',
      end: 'End',
      reason: 'Reason',
      delete: 'Delete',
      addRange: 'Add interval',
      reset: 'Reset',
      toSite: 'To site',
      loading: 'Loading data...',
      booked: 'Booked',
    },
    notFound: {
      title: 'Page not found',
      back: 'Back to home',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      about: 'О нас',
      rooms: 'Номера',
      gallery: 'Галерея',
      booking: 'Бронирование',
      reviews: 'Отзывы',
      contact: 'Контакты',
      apartments: 'Апартаменты',
      compare: 'Сравнение',
      availability: 'Занятость',
      faq: 'FAQ',
      apartmentsSection: 'Отдельный раздел →',
    },
    hero: {
      title: 'Добро пожаловать в Guesthouse Dilbar',
      subtitle: 'Ваш идеальный дом вдали от дома',
      description: 'Испытайте комфорт, роскошь и гостеприимство в сердце города',
      bookNow: 'Забронировать',
      explore: 'Узнать больше',
    },
    about: {
      title: 'О нас',
      subtitle: 'Уютный коливинг в самом сердце города. Чисто, комфортно, дружелюбная атмосфера.',
      description: 'Наш гостевой дом — это идеальное место для тех, кто ценит домашний уют, чистоту и душевную атмосферу. Просторные номера, полностью оборудованная кухня, зоны отдыха и внимательный персонал сделают ваше пребывание незабываемым. Всего 5 номеров, до 22 гостей — у нас не бывает шумно и людно.',
    },
    rooms: {
      title: 'Наши номера',
      subtitle: 'Выберите идеальное пространство',
      standard: 'Стандартный номер',
      deluxe: 'Делюкс номер',
      suite: 'Люкс',
      perNight: 'за ночь',
      viewDetails: 'Подробнее',
      guests: 'гостей',
      amenities: 'Удобства',
    },
    gallery: {
      title: 'Галерея',
      subtitle: 'Исследуйте наше прекрасное пространство',
    },
    booking: {
      title: 'Забронировать проживание',
      subtitle: 'Забронируйте номер сегодня',
      checkIn: 'Дата заезда',
      checkOut: 'Дата выезда',
      guests: 'Количество гостей',
      roomType: 'Тип номера',
      selectRoom: 'Выберите тип номера',
      name: 'Полное имя',
      email: 'Email адрес',
      phone: 'Номер телефона',
      specialRequests: 'Особые пожелания',
      submit: 'Забронировать',
      success: 'Запрос на бронирование успешно отправлен!',
      error: 'Пожалуйста, заполните все обязательные поля',
      price: 'Стоимость',
      priceNote: 'Предварительный расчет. Финальная цена подтверждается при ответе.',
      perNight: 'за ночь',
      seasonalMultiplier: 'сезонный коэффициент',
      currency: 'валюта',
      rate: 'курс',
      pickDates: 'Выбери даты, чтобы увидеть расчет.',
      stayFormat: 'Формат размещения',
      guesthouse: 'Гостевой дом (номера)',
      apartmentOption: 'Апартаменты (квартиры)',
      copyRequest: 'Скопировать заявку',
      sendWhatsApp: 'Отправить в WhatsApp',
      done: 'Готово',
      datesUnavailable: 'Выбранные даты недоступны. Пожалуйста, выберите другие.',
    },
    stickyBar: {
      quickBooking: 'Быстрое бронирование',
      pickDates: 'Выбери даты',
      guesthouse: 'Гостевой дом',
      apartments: 'Апартаменты',
      guests: 'гостей',
      booked: 'Занято',
      toForm: 'К форме',
      hide: 'Скрыть',
      show: 'Открыть',
      datesTaken: 'Выбранные даты заняты. Выберите другие.',
    },
    availability: {
      title: 'Календарь занятости',
      subtitle: 'Проверьте свободные даты для вашего проживания',
      legendAvailable: 'Свободно',
      legendBooked: 'Занято',
      legendSelected: 'Выбрано',
    },
    reviews: {
      title: 'Отзывы гостей',
      subtitle: 'Что говорят о нас наши гости',
    },
    location: {
      title: 'Найдите нас',
      subtitle: 'Посетите нас сегодня',
      address: 'Адрес',
      phone: 'Телефон',
      email: 'Email',
      getDirections: 'Как добраться',
    },
    footer: {
      description: 'Ваш идеальный дом вдали от дома. Испытайте комфорт и гостеприимство.',
      quickLinks: 'Быстрые ссылки',
      contact: 'Контактная информация',
      followUs: 'Следите за нами',
      rights: 'Все права защищены.',
    },
    apartments: {
      title: 'Наши апартаменты',
      subtitle: 'Полностью оборудованные квартиры для вашего проживания',
      features: 'Удобства',
      area: 'Площадь',
      beds: 'Кровати',
      guests: 'Гостей',
      viewDetails: 'Подробнее',
      bookNow: 'Забронировать',
      backToAll: 'Назад ко всем апартаментам',
      backToHome: 'На главную',
    },
    admin: {
      title: 'Админка: календарь занятости',
      description: 'Данные сохраняются в облаке (Cloudflare KV) и локально. Доступны на всех устройствах.',
      selectCalendar: 'Редактируемый календарь',
      sync: 'Синхронизация iCal',
      syncDesc: 'iCal-ссылки тянутся через Cloudflare Worker-прокси.',
      workerUrl: 'Cloudflare Worker URL',
      airbnbUrl: 'Airbnb iCal URL',
      bookingUrl: 'Booking.com iCal URL',
      syncNow: 'Синхронизировать сейчас',
      clearImport: 'Очистить импорт',
      noRanges: 'Пока нет заблокированных интервалов.',
      start: 'Начало',
      end: 'Конец',
      reason: 'Причина',
      delete: 'Удалить',
      addRange: 'Добавить интервал',
      reset: 'Сбросить',
      toSite: 'На сайт',
      loading: 'Загрузка данных...',
      booked: 'Занято',
    },
    notFound: {
      title: 'Страница не найдена',
      back: 'На главную',
    },
  },
}

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('gd:lang:v1') || 'ru' } catch { return 'ru' }
  })

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'ru' : 'en'
      try { localStorage.setItem('gd:lang:v1', next) } catch {}
      return next
    })
  }

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
