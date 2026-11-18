import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  BOOKING_STORAGE_KEY,
  DURATIONS,
  HAIRSTYLES,
  HANBOK_OPTIONS,
  SHOE_SIZES,
  createGuestSelection,
  formatTime,
  getGuestPrice,
  getPaymentAmounts,
  getTimeSlots,
  isBookingRecord,
  localDateString,
  type BookingRecord,
  type ContactDetails,
  type DurationKey,
  type GuestSelection,
} from './booking'
import './App.css'

const messages = {
  en: {
    navHome: 'Home',
    navExperience: 'The experience',
    navVisit: 'Visit us',
    bookNow: 'Reserve a fitting',
    eyebrow: 'HANBOK RENTAL · SEOUL',
    heroTitle: 'A little Seoul,\\nstiched with joy.',
    heroText: 'Find your favorite colors, dress in a little Korean tradition, and make a memory that feels like yours.',
    explore: 'Plan your visit',
    serviceTag: 'A day to remember',
    serviceTitle: 'Your hanbok moment, made easy.',
    serviceText: 'Choose your date, look, and little finishing touches before you arrive. We’ll have your visit ready for you.',
    stepOne: 'Choose a session',
    stepOneText: 'Pick 1.5 hours, 3 hours, or a full day.',
    stepTwo: 'Make it yours',
    stepTwoText: 'Explore hanbok looks, hair, makeup, shoes, and bags.',
    stepThree: 'Arrive and enjoy',
    stepThreeText: 'Bring your booking QR and let our team take it from there.',
    visitEyebrow: 'FIND US IN SEOUL',
    visitTitle: 'A little more time for the good parts.',
    visitText: 'Reserve ahead, skip the fitting-room wait, and spend more of your day making memories.',
    hours: 'OPEN EVERY DAY',
    hourRange: '9:00 AM – 7:00 PM',
    addressLabel: 'OUR NEIGHBORHOOD',
    address: 'Seoul, South Korea',
    addressNote: 'Exact venue address can be added here.',
    footerText: 'Hanbok rental shop · Seoul, South Korea',
    bookYourVisit: 'Book your visit',
    language: 'Language',
    bookingTitle: 'Let’s plan your visit',
    bookingIntro: 'A few thoughtful choices now, and more time to enjoy Seoul later.',
    stepLabel: ['Date & time', 'Your look', 'Your details'],
    durationTitle: 'How long would you like to explore?',
    durations: {
      short: { title: 'Little escape', duration: '1.5 hours', note: 'A lovely first look' },
      long: { title: 'Slow afternoon', duration: '3 hours', note: 'Time to wander and explore' },
      day: { title: 'Full day', duration: '9 AM – 7 PM', note: 'Your whole day in hanbok' },
    },
    visitDate: 'Visit date',
    numberGuests: 'How many guests?',
    guests: 'guests',
    availableTimes: 'Choose a start time',
    timesHint: 'Start times are offered every 30 minutes.',
    noTimes: 'No times fit this selection. Try another date or session length.',
    spotsLeft: 'spots left',
    unavailable: 'Full',
    continue: 'Continue',
    back: 'Back',
    yourLookTitle: 'A look for every guest',
    lookHint: 'These sample styles and prices are ready to replace with your collection.',
    guest: 'Guest',
    chooseHanbok: 'Choose a hanbok',
    previewSlot: 'Your photo goes here',
    hairTitle: 'Hairstyle',
    makeupTitle: 'Makeup',
    shoesTitle: 'Shoes',
    bagTitle: 'Bag',
    chooseStyle: 'Choose a style',
    naturalHair: 'Natural hair',
    addMakeup: 'Add makeup',
    addShoes: 'Add shoes',
    chooseSize: 'Shoe size',
    selectSize: 'Choose a size',
    addBag: 'Add a bag',
    free: 'Free',
    contactTitle: 'Where should we send your confirmation?',
    contactHint: 'Your details are only saved in this browser demo.',
    name: 'Full name',
    phone: 'Mobile number',
    email: 'Email address',
    paymentTitle: 'Choose a payment option',
    fullPayment: 'Pay in full',
    depositPayment: 'Pay a 20% deposit',
    dueToday: 'Due now',
    dueAtVenue: 'Remaining at venue',
    orderSummary: 'Your visit',
    summaryDate: 'Date',
    summaryTime: 'Start',
    summaryDuration: 'Session',
    summaryGuests: 'Guests',
    summaryTotal: 'Total',
    payButton: 'Confirm demo booking',
    demoWarning: 'Demo only · No payment will be collected, and no SMS will be sent.',
    reminders: 'In the live service, text reminders can be sent 30 and 10 minutes before your session ends.',
    confirmedTitle: 'Your Seoul moment is on the calendar!',
    confirmedText: 'Your demo booking is saved in this browser. Show this QR to preview staff check-in.',
    bookingCode: 'BOOKING CODE',
    amountPaid: 'Demo amount selected',
    qrTitle: 'Your check-in QR',
    qrHelp: 'For this demo, staff lookup works only in the same browser where the booking was made.',
    staffPreview: 'Preview staff check-in',
    startOver: 'Back to home',
    staffTitle: 'Guest check-in',
    staffDemo: 'STAFF PREVIEW · DEMO DATA',
    bookingNotFound: 'This booking is not saved in this browser. Scan the QR on the device used to create the demo booking.',
    contactHeading: 'Contact',
    selectedLooks: 'Selected looks',
    paymentStatus: 'Payment status',
    demoDeposit: 'Deposit selected (demo only)',
    demoFull: 'Full payment selected (demo only)',
    storageError: 'The demo booking data could not be read or saved in this browser. Check browser storage and try again.',
    capacityError: 'That time just filled up. Please choose another available start time.',
    dateError: 'Please choose a valid visit date that is today or later.',
    contactError: 'Please enter your name, phone number, and email address.',
    shoeSizeError: 'Please choose a shoe size for each guest who added shoes.',
    guestCountError: 'Choose between 1 and 3 guests.',
    chooseTimeError: 'Please choose an available start time.',
    termsNote: 'By continuing, you agree that this is a non-binding website demo.',
    sample: 'SAMPLE OPTION',
  },
  ko: {
    navHome: '홈',
    navExperience: '이용 안내',
    navVisit: '오시는 길',
    bookNow: '예약하기',
    eyebrow: '한복 대여 · 서울',
    heroTitle: '서울의 하루를\\n한복으로 물들여요.',
    heroText: '마음에 드는 색을 고르고 한국의 멋을 입어 보세요. 오래 기억하고 싶은 하루를 만들어 드릴게요.',
    explore: '방문 예약하기',
    serviceTag: '기억에 남을 하루',
    serviceTitle: '더 여유롭게 즐기는 한복 체험.',
    serviceText: '방문 전에 날짜와 한복, 헤어와 소품을 골라 보세요. 예약에 맞춰 방문을 준비해 드립니다.',
    stepOne: '이용 시간 선택',
    stepOneText: '1시간 30분, 3시간 또는 종일 이용을 선택해요.',
    stepTwo: '나만의 스타일',
    stepTwoText: '한복, 헤어, 메이크업, 신발과 가방을 골라요.',
    stepThree: '편안하게 방문',
    stepThreeText: '예약 QR을 보여 주시면 직원이 안내해 드려요.',
    visitEyebrow: '서울에서 만나요',
    visitTitle: '좋아하는 순간에 더 많은 시간을.',
    visitText: '미리 예약하고 피팅 대기 시간을 줄여 서울의 하루를 더 여유롭게 즐겨 보세요.',
    hours: '운영 시간',
    hourRange: '매일 오전 9시 – 오후 7시',
    addressLabel: '위치',
    address: '대한민국 서울',
    addressNote: '정확한 매장 주소를 여기에 추가할 수 있어요.',
    footerText: '한복 대여점 · 대한민국 서울',
    bookYourVisit: '방문 예약하기',
    language: '언어',
    bookingTitle: '방문을 준비해 볼까요?',
    bookingIntro: '미리 몇 가지만 선택하면 서울에서 더 여유롭게 즐길 수 있어요.',
    stepLabel: ['날짜와 시간', '스타일 선택', '예약자 정보'],
    durationTitle: '얼마나 이용하고 싶으세요?',
    durations: {
      short: { title: '가벼운 나들이', duration: '1시간 30분', note: '한복을 처음 입어 보는 날' },
      long: { title: '여유로운 오후', duration: '3시간', note: '천천히 둘러보고 싶은 날' },
      day: { title: '종일 이용', duration: '오전 9시 – 오후 7시', note: '하루 종일 한복과 함께' },
    },
    visitDate: '방문 날짜',
    numberGuests: '방문 인원',
    guests: '명',
    availableTimes: '시작 시간 선택',
    timesHint: '30분 간격으로 시작 시간을 선택할 수 있어요.',
    noTimes: '선택한 조건에 가능한 시간이 없어요. 날짜나 이용 시간을 바꿔 주세요.',
    spotsLeft: '자리 남음',
    unavailable: '마감',
    continue: '계속하기',
    back: '뒤로',
    yourLookTitle: '한 분씩 스타일을 골라 주세요',
    lookHint: '예시 스타일과 가격입니다. 실제 한복 목록으로 바꿀 수 있어요.',
    guest: '방문객',
    chooseHanbok: '한복 선택',
    previewSlot: '한복 사진이 들어갈 자리',
    hairTitle: '헤어 스타일',
    makeupTitle: '메이크업',
    shoesTitle: '신발',
    bagTitle: '가방',
    chooseStyle: '스타일 선택',
    naturalHair: '기본 헤어',
    addMakeup: '메이크업 추가',
    addShoes: '신발 추가',
    chooseSize: '신발 사이즈',
    selectSize: '사이즈 선택',
    addBag: '가방 추가',
    free: '무료',
    contactTitle: '예약 확인을 어디로 보내 드릴까요?',
    contactHint: '입력한 정보는 이 브라우저의 데모에만 저장됩니다.',
    name: '이름',
    phone: '휴대폰 번호',
    email: '이메일 주소',
    paymentTitle: '결제 방법 선택',
    fullPayment: '전액 결제',
    depositPayment: '20% 예약금 결제',
    dueToday: '지금 선택할 금액',
    dueAtVenue: '매장 결제 잔액',
    orderSummary: '예약 내용',
    summaryDate: '날짜',
    summaryTime: '시작 시간',
    summaryDuration: '이용 시간',
    summaryGuests: '인원',
    summaryTotal: '총 금액',
    payButton: '데모 예약 확인',
    demoWarning: '데모 전용 · 실제 결제나 문자는 전송되지 않습니다.',
    reminders: '실제 서비스에서는 이용 종료 30분 전과 10분 전에 문자 알림을 보낼 수 있어요.',
    confirmedTitle: '서울에서의 특별한 하루를 예약했어요!',
    confirmedText: '데모 예약이 이 브라우저에 저장됐어요. 아래 QR로 직원 체크인을 미리 확인해 보세요.',
    bookingCode: '예약 번호',
    amountPaid: '데모 결제 선택 금액',
    qrTitle: '체크인 QR',
    qrHelp: '데모 직원 조회는 예약을 만든 브라우저에서만 이용할 수 있어요.',
    staffPreview: '직원 체크인 미리보기',
    startOver: '홈으로 돌아가기',
    staffTitle: '방문객 체크인',
    staffDemo: '직원 미리보기 · 데모 정보',
    bookingNotFound: '이 브라우저에 저장된 예약이 없어요. 데모 예약을 만든 기기에서 QR을 확인해 주세요.',
    contactHeading: '연락처',
    selectedLooks: '선택한 스타일',
    paymentStatus: '결제 상태',
    demoDeposit: '예약금 선택 (데모 전용)',
    demoFull: '전액 결제 선택 (데모 전용)',
    storageError: '이 브라우저에서 데모 예약 정보를 읽거나 저장할 수 없어요. 브라우저 저장 공간을 확인해 주세요.',
    capacityError: '방금 예약이 마감됐어요. 다른 시작 시간을 선택해 주세요.',
    dateError: '오늘 이후의 올바른 방문 날짜를 선택해 주세요.',
    contactError: '이름, 휴대폰 번호와 이메일 주소를 입력해 주세요.',
    shoeSizeError: '신발을 추가한 방문객의 사이즈를 선택해 주세요.',
    guestCountError: '방문 인원은 1명에서 3명까지 선택할 수 있어요.',
    chooseTimeError: '가능한 시작 시간을 선택해 주세요.',
    termsNote: '계속 진행하면 실제 예약이 아닌 웹사이트 데모임을 확인합니다.',
    sample: '예시 옵션',
  },
} as const

type Language = keyof typeof messages

const durationKeys: DurationKey[] = ['short', 'long', 'day']

function money(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}

function displayDate(date: string, language: Language): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat(language === 'ko' ? 'ko-KR' : 'en-US', {
    dateStyle: 'long',
  }).format(new Date(`${date}T12:00:00`))
}

function readBookings(): BookingRecord[] {
  const raw = window.localStorage.getItem(BOOKING_STORAGE_KEY)
  if (!raw) return []

  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    throw new Error('Invalid saved demo booking data')
  }
  if (!Array.isArray(value) || !value.every(isBookingRecord)) {
    throw new Error('Unexpected saved demo booking data')
  }
  return value
}

function updateGuest(
  guests: GuestSelection[],
  index: number,
  update: Partial<GuestSelection>,
): GuestSelection[] {
  return guests.map((guest, guestIndex) =>
    guestIndex === index ? { ...guest, ...update } : guest,
  )
}

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [page, setPage] = useState<'home' | 'booking' | 'confirmation'>('home')
  const [step, setStep] = useState(1)
  const [duration, setDuration] = useState<DurationKey>('short')
  const [date, setDate] = useState(localDateString())
  const [guests, setGuests] = useState<GuestSelection[]>([createGuestSelection()])
  const [startMin, setStartMin] = useState<number | null>(null)
  const [contact, setContact] = useState<ContactDetails>({ name: '', phone: '', email: '' })
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full')
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [storageError, setStorageError] = useState(false)
  const [formError, setFormError] = useState('')
  const [currentBooking, setCurrentBooking] = useState<BookingRecord | null>(null)
  const queryStaffId = new URLSearchParams(window.location.search).get('staff')
  const [staffId, setStaffId] = useState<string | null>(queryStaffId)
  const t = messages[language]
  const isStaffMode = staffId !== null

  useEffect(() => {
    const refresh = () => {
      try {
        setBookings(readBookings())
        setStorageError(false)
      } catch {
        setStorageError(true)
      }
    }
    refresh()
    const onStorage = (event: StorageEvent) => {
      if (event.key === BOOKING_STORAGE_KEY) refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const availableSlots = useMemo(
    () => getTimeSlots(date, duration, guests.length, bookings),
    [date, duration, guests.length, bookings],
  )
  const total = guests.reduce((sum, guest) => sum + getGuestPrice(guest), 0)
  const payment = getPaymentAmounts(total, paymentType)
  const staffBooking = bookings.find((booking) => booking.id === staffId) ?? null
  const durationMinutes = DURATIONS[duration]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  function beginBooking() {
    setPage('booking')
    setStep(1)
    setFormError('')
    setStartMin(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function changeDuration(value: DurationKey) {
    setDuration(value)
    setStartMin(null)
    setFormError('')
  }

  function changeGuestCount(value: number) {
    if (value < 1 || value > 3) {
      setFormError(t.guestCountError)
      return
    }
    setGuests((current) =>
      Array.from({ length: value }, (_, index) => current[index] ?? createGuestSelection()),
    )
    setStartMin(null)
    setFormError('')
  }

  function navigateHome(sectionId?: string) {
    setPage('home')
    setStaffId(null)
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${sectionId ? `#${sectionId}` : ''}`,
    )
    if (sectionId) {
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 0)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function toLookStep() {
    if (guests.length < 1 || guests.length > 3) {
      setFormError(t.guestCountError)
      return
    }
    if (!date || date < localDateString()) {
      setFormError(t.dateError)
      return
    }
    if (startMin === null || !availableSlots.some((slot) => slot.startMin === startMin)) {
      setFormError(t.chooseTimeError)
      return
    }
    setFormError('')
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toContactStep() {
    if (guests.some((guest) => guest.shoes && !guest.shoeSize)) {
      setFormError(t.shoeSizeError)
      return
    }
    setFormError('')
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function confirmBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!contact.name.trim() || !contact.phone.trim() || !contact.email.trim()) {
      setFormError(t.contactError)
      return
    }
    if (!date || date < localDateString()) {
      setFormError(t.dateError)
      setStep(1)
      return
    }
    if (startMin === null) {
      setFormError(t.chooseTimeError)
      return
    }
    if (guests.some((guest) => guest.shoes && !guest.shoeSize)) {
      setFormError(t.shoeSizeError)
      return
    }

    let latestBookings: BookingRecord[]
    try {
      latestBookings = readBookings()
    } catch {
      setStorageError(true)
      return
    }
    const stillAvailable = getTimeSlots(date, duration, guests.length, latestBookings).some(
      (slot) => slot.startMin === startMin,
    )
    if (!stillAvailable) {
      setBookings(latestBookings)
      setStartMin(null)
      setStep(1)
      setFormError(t.capacityError)
      return
    }

    const totalPrice = guests.reduce((sum, guest) => sum + getGuestPrice(guest), 0)
    const amounts = getPaymentAmounts(totalPrice, paymentType)
    const booking: BookingRecord = {
      id: `HG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      date,
      startMin,
      endMin: startMin + durationMinutes,
      duration,
      guests,
      contact,
      paymentType,
      total: totalPrice,
      amountPaid: amounts.amountDueNow,
      createdAt: new Date().toISOString(),
    }
    const updatedBookings = [...latestBookings, booking]

    try {
      window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updatedBookings))
    } catch {
      setStorageError(true)
      return
    }

    setBookings(updatedBookings)
    setCurrentBooking(booking)
    setFormError('')
    setPage('confirmation')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openStaffPreview(id: string) {
    setStaffId(id)
    window.history.pushState({}, '', `${window.location.pathname}?staff=${encodeURIComponent(id)}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeStaffPreview() {
    setStaffId(null)
    window.history.replaceState({}, '', window.location.pathname)
  }

  function renderHeader() {
    return (
      <header className="site-header">
        <a
          href="#home"
          className="brand"
          aria-label="Hanbok Girls home"
          onClick={(event) => {
            event.preventDefault()
            navigateHome()
          }}
        >
          <img src="/hanbokgirls-logo.png" alt="Hanbok Girls 한복소녀" />
          <span className="brand-caption">HANBOK RENTAL SHOP</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              navigateHome()
            }}
          >
            {t.navHome}
          </a>
          <a href="#experience" onClick={(event) => { event.preventDefault(); navigateHome('experience') }}>{t.navExperience}</a>
          <a href="#visit" onClick={(event) => { event.preventDefault(); navigateHome('visit') }}>{t.navVisit}</a>
        </nav>
        <div className="header-actions">
          <div className="language-toggle" aria-label={t.language}>
            <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
            <span aria-hidden="true">/</span>
            <button type="button" aria-pressed={language === 'ko'} onClick={() => setLanguage('ko')}>한국어</button>
          </div>
          {!isStaffMode && page !== 'confirmation' && (
            <button className="button button-small button-plum" type="button" onClick={beginBooking}>
              {t.bookNow}
            </button>
          )}
        </div>
      </header>
    )
  }

  function renderHome() {
    return (
      <>
        <main id="home">
          <section className="hero-section">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-flower">✿</span> {t.eyebrow}</p>
              <h1>{t.heroTitle.split('\\n').map((line) => <span key={line}>{line}</span>)}</h1>
              <p className="hero-description">{t.heroText}</p>
              <div className="hero-actions">
                <button className="button button-plum" type="button" onClick={beginBooking}>
                  {t.explore}<span aria-hidden="true">↗</span>
                </button>
                <span className="hero-note">♡ &nbsp; {t.serviceTag}</span>
              </div>
              <div className="hero-stamp" aria-hidden="true">
                <span>서울</span><small>SEOUL<br />WITH LOVE</small>
              </div>
            </div>
            <div className="hero-art" aria-label="Hanbok photo placeholder">
              <div className="photo-frame photo-frame-main">
                <div className="photo-placeholder">
                  <span className="placeholder-mark">✿</span>
                  <span>HANBOK<br />MOMENTS</span>
                  <small>YOUR PHOTO HERE</small>
                </div>
              </div>
              <div className="photo-frame photo-frame-small">
                <div className="photo-placeholder photo-placeholder-sage">
                  <span>STYLE<br />YOUR DAY</span>
                  <small>YOUR PHOTO HERE</small>
                </div>
              </div>
              <div className="art-flower art-flower-one">✿</div>
              <div className="art-flower art-flower-two">✽</div>
              <span className="art-caption">a beautiful day, your way</span>
            </div>
          </section>

          <section className="experience-section" id="experience">
            <div className="section-heading">
              <p className="eyebrow">{t.serviceTag}</p>
              <h2>{t.serviceTitle}</h2>
              <p>{t.serviceText}</p>
            </div>
            <div className="experience-grid">
              {[
                { number: '01', title: t.stepOne, text: t.stepOneText, symbol: '◷' },
                { number: '02', title: t.stepTwo, text: t.stepTwoText, symbol: '✿' },
                { number: '03', title: t.stepThree, text: t.stepThreeText, symbol: '♡' },
              ].map((item) => (
                <article className="experience-card" key={item.number}>
                  <div className="experience-card-top"><span>{item.number}</span><span className="card-symbol">{item.symbol}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="visit-section" id="visit">
            <div className="visit-ornament" aria-hidden="true">❀</div>
            <div>
              <p className="eyebrow">{t.visitEyebrow}</p>
              <h2>{t.visitTitle}</h2>
              <p>{t.visitText}</p>
              <button className="text-link" type="button" onClick={beginBooking}>
                {t.bookYourVisit}<span aria-hidden="true"> ↗</span>
              </button>
            </div>
            <div className="visit-details">
              <div><span className="detail-icon">◷</span><p className="detail-label">{t.hours}</p><p>{t.hourRange}</p></div>
              <div><span className="detail-icon">⌖</span><p className="detail-label">{t.addressLabel}</p><p>{t.address}</p><small>{t.addressNote}</small></div>
            </div>
          </section>
        </main>
        <footer className="site-footer">
          <span>한복소녀 · HANBOK GIRLS</span>
          <span>{t.footerText}</span>
          <span>Seoul · Korea</span>
        </footer>
      </>
    )
  }

  function renderSummary() {
    return (
      <aside className="booking-summary">
        <p className="eyebrow">{t.orderSummary}</p>
        <h2>{displayDate(date, language)}</h2>
        <dl>
          <div><dt>{t.summaryTime}</dt><dd>{startMin === null ? '—' : formatTime(startMin)}</dd></div>
          <div><dt>{t.summaryDuration}</dt><dd>{t.durations[duration].duration}</dd></div>
          <div><dt>{t.summaryGuests}</dt><dd>{guests.length}</dd></div>
        </dl>
        {step > 1 && (
          <ul className="summary-looks">
            {guests.map((guest, index) => {
              const hanbok = HANBOK_OPTIONS.find((option) => option.id === guest.hanbokId)
              return (
                <li key={`${index}-${guest.hanbokId}`}>
                  <span>{t.guest} {index + 1} · {language === 'ko' ? hanbok?.nameKo : hanbok?.nameEn}</span>
                  <span>{money(getGuestPrice(guest))}</span>
                </li>
              )
            })}
          </ul>
        )}
        <div className="summary-total"><span>{t.summaryTotal}</span><strong>{money(total)}</strong></div>
        {step === 3 && (
          <>
            <div className="summary-total summary-due"><span>{t.dueToday}</span><strong>{money(payment.amountDueNow)}</strong></div>
            {payment.remainingBalance > 0 && <p className="balance-note">{t.dueAtVenue}: {money(payment.remainingBalance)}</p>}
          </>
        )}
        <p className="summary-demo">{t.demoWarning}</p>
      </aside>
    )
  }

  function renderBooking() {
    return (
      <main className="booking-page">
        <div className="booking-heading">
          <button className="back-link" type="button" onClick={() => setPage('home')}>← {t.back}</button>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.bookingTitle}</h1>
          <p>{t.bookingIntro}</p>
        </div>
        <div className="stepper" aria-label="Reservation steps">
          {t.stepLabel.map((label, index) => (
            <div className={`stepper-item ${step === index + 1 ? 'is-active' : ''} ${step > index + 1 ? 'is-complete' : ''}`} key={label}>
              <span className="stepper-number">{step > index + 1 ? '✓' : `0${index + 1}`}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="booking-layout">
          <section className="booking-panel">
            {step === 1 && (
              <div className="booking-step">
                <h2>{t.durationTitle}</h2>
                <div className="duration-grid">
                  {durationKeys.map((key) => (
                    <button className={`duration-card ${duration === key ? 'is-selected' : ''}`} type="button" key={key} aria-pressed={duration === key} onClick={() => changeDuration(key)}>
                      <span className="duration-card-icon">{key === 'day' ? '☼' : '◷'}</span>
                      <strong>{t.durations[key].title}</strong>
                      <span>{t.durations[key].duration}</span>
                      <small>{t.durations[key].note}</small>
                    </button>
                  ))}
                </div>

                <div className="field-row">
                  <label className="form-field">
                    <span>{t.visitDate}</span>
                    <input type="date" min={localDateString()} value={date} onChange={(event) => { setDate(event.target.value); setStartMin(null); setFormError('') }} required />
                  </label>
                  <fieldset className="guest-count-field">
                    <legend>{t.numberGuests}</legend>
                    <div className="guest-count-options">
                      {[1, 2, 3].map((count) => (
                        <button className={guests.length === count ? 'is-selected' : ''} type="button" key={count} aria-pressed={guests.length === count} onClick={() => changeGuestCount(count)}>
                          {count}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <div className="time-section">
                  <div className="time-heading"><h3>{t.availableTimes}</h3><span>{t.timesHint}</span></div>
                  <div className="time-grid">
                    {availableSlots.map((slot) => (
                      <button className={`time-slot ${startMin === slot.startMin ? 'is-selected' : ''}`} type="button" key={slot.startMin} aria-pressed={startMin === slot.startMin} onClick={() => { setStartMin(slot.startMin); setFormError('') }}>
                        <strong>{formatTime(slot.startMin)}</strong>
                        <small>{slot.remainingCapacity} {t.spotsLeft}</small>
                      </button>
                    ))}
                    {availableSlots.length === 0 && <p className="empty-slots">{t.noTimes}</p>}
                  </div>
                </div>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <div className="step-actions"><button className="button button-plum" type="button" onClick={toLookStep}>{t.continue}<span aria-hidden="true"> →</span></button></div>
              </div>
            )}

            {step === 2 && (
              <div className="booking-step">
                <div className="step-title-row"><div><h2>{t.yourLookTitle}</h2><p>{t.lookHint}</p></div><span className="sample-label">{t.sample}</span></div>
                <div className="guest-style-list">
                  {guests.map((guest, index) => {
                    const selectedHanbok = HANBOK_OPTIONS.find((option) => option.id === guest.hanbokId) ?? HANBOK_OPTIONS[0]
                    return (
                      <article className="guest-style-card" key={`guest-${index}`}>
                        <div className="guest-style-heading"><span className="guest-badge">{String(index + 1).padStart(2, '0')}</span><h3>{t.guest} {index + 1}</h3></div>
                        <div className="hanbok-picker">
                          {selectedHanbok.imageUrl ? (
                            <img className="hanbok-preview-image" src={selectedHanbok.imageUrl} alt={language === 'ko' ? selectedHanbok.nameKo : selectedHanbok.nameEn} />
                          ) : (
                            <div className="hanbok-preview" style={{ '--hanbok-color': selectedHanbok.color } as CSSProperties}>
                              <span className="preview-flower">✿</span><span>{t.previewSlot}</span><small>PHOTO SLOT</small>
                            </div>
                          )}
                          <div className="hanbok-fields">
                            <label className="form-field">
                              <span>{t.chooseHanbok}</span>
                              <select value={guest.hanbokId} onChange={(event) => setGuests((current) => updateGuest(current, index, { hanbokId: event.target.value }))}>
                                {HANBOK_OPTIONS.map((option) => <option value={option.id} key={option.id}>{language === 'ko' ? option.nameKo : option.nameEn} — {money(option.price)}</option>)}
                              </select>
                            </label>
                            <div className="selected-hanbok-name"><span className="color-dot" style={{ backgroundColor: selectedHanbok.color }} />{language === 'ko' ? selectedHanbok.nameKo : selectedHanbok.nameEn}</div>
                          </div>
                        </div>
                        <div className="add-on-grid">
                          <label className="form-field">
                            <span>{t.hairTitle}</span>
                            <select value={guest.hairstyleId} onChange={(event) => setGuests((current) => updateGuest(current, index, { hairstyleId: event.target.value }))}>
                              {HAIRSTYLES.map((style) => <option value={style.id} key={style.id}>{language === 'ko' ? style.nameKo : style.nameEn} — {style.price === 0 ? t.free : money(style.price)}</option>)}
                            </select>
                          </label>
                          <label className="checkbox-option">
                            <input type="checkbox" checked={guest.makeup} onChange={(event) => setGuests((current) => updateGuest(current, index, { makeup: event.target.checked }))} />
                            <span><strong>{t.makeupTitle}</strong><small>{t.addMakeup} · {money(20000)}</small></span>
                          </label>
                          <div className="shoe-option">
                            <label className="checkbox-option">
                              <input type="checkbox" checked={guest.shoes} onChange={(event) => setGuests((current) => updateGuest(current, index, { shoes: event.target.checked, shoeSize: event.target.checked ? guest.shoeSize : '' }))} />
                              <span><strong>{t.shoesTitle}</strong><small>{t.addShoes} · {money(150000)}</small></span>
                            </label>
                            {guest.shoes && (
                              <label className="form-field shoe-size-field">
                                <span>{t.chooseSize}</span>
                                <select value={guest.shoeSize} onChange={(event) => setGuests((current) => updateGuest(current, index, { shoeSize: event.target.value }))} required>
                                  <option value="">{t.selectSize}</option>
                                  {SHOE_SIZES.map((size) => <option value={size} key={size}>{size} mm</option>)}
                                </select>
                              </label>
                            )}
                          </div>
                          <label className="checkbox-option">
                            <input type="checkbox" checked={guest.bag} onChange={(event) => setGuests((current) => updateGuest(current, index, { bag: event.target.checked }))} />
                            <span><strong>{t.bagTitle}</strong><small>{t.addBag} · {t.free}</small></span>
                          </label>
                        </div>
                      </article>
                    )
                  })}
                </div>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <div className="step-actions step-actions-between">
                  <button className="button button-outline" type="button" onClick={() => { setStep(1); setFormError('') }}>← {t.back}</button>
                  <button className="button button-plum" type="button" onClick={toContactStep}>{t.continue}<span aria-hidden="true"> →</span></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form className="booking-step contact-step" onSubmit={confirmBooking}>
                <h2>{t.contactTitle}</h2>
                <p>{t.contactHint}</p>
                <div className="contact-grid">
                  <label className="form-field"><span>{t.name}</span><input autoComplete="name" value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} required /></label>
                  <label className="form-field"><span>{t.phone}</span><input type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+()\\-\\s]{8,20}" value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} required /></label>
                  <label className="form-field field-full"><span>{t.email}</span><input type="email" autoComplete="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} required /></label>
                </div>
                <fieldset className="payment-options">
                  <legend>{t.paymentTitle}</legend>
                  <label className={`payment-option ${paymentType === 'full' ? 'is-selected' : ''}`}>
                    <input type="radio" name="payment" value="full" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} />
                    <span><strong>{t.fullPayment}</strong><small>{money(total)}</small></span>
                  </label>
                  <label className={`payment-option ${paymentType === 'deposit' ? 'is-selected' : ''}`}>
                    <input type="radio" name="payment" value="deposit" checked={paymentType === 'deposit'} onChange={() => setPaymentType('deposit')} />
                    <span><strong>{t.depositPayment}</strong><small>{money(getPaymentAmounts(total, 'deposit').amountDueNow)}</small></span>
                  </label>
                  <p className="payment-note">{t.demoWarning}</p>
                </fieldset>
                <p className="terms-note">{t.termsNote}</p>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <div className="step-actions step-actions-between">
                  <button className="button button-outline" type="button" onClick={() => { setStep(2); setFormError('') }}>← {t.back}</button>
                  <button className="button button-plum" type="submit">{t.payButton}<span aria-hidden="true"> →</span></button>
                </div>
              </form>
            )}
          </section>
          <div className="summary-column">{renderSummary()}</div>
        </div>
      </main>
    )
  }

  function renderConfirmation() {
    if (!currentBooking) return renderHome()
    const qrValue = `${window.location.origin}${window.location.pathname}?staff=${encodeURIComponent(currentBooking.id)}`
    const paid = getPaymentAmounts(currentBooking.total, currentBooking.paymentType)
    return (
      <main className="confirmation-page">
        <div className="confirmation-card">
          <div className="confirmation-icon">✿</div>
          <p className="eyebrow">{t.bookingCode} · {currentBooking.id}</p>
          <h1>{t.confirmedTitle}</h1>
          <p className="confirmation-lead">{t.confirmedText}</p>
          <div className="confirmation-details">
            <div><span>{t.summaryDate}</span><strong>{displayDate(currentBooking.date, language)}</strong></div>
            <div><span>{t.summaryTime}</span><strong>{formatTime(currentBooking.startMin)}</strong></div>
            <div><span>{t.summaryDuration}</span><strong>{t.durations[currentBooking.duration].duration}</strong></div>
            <div><span>{t.summaryGuests}</span><strong>{currentBooking.guests.length}</strong></div>
            <div><span>{t.summaryTotal}</span><strong>{money(currentBooking.total)}</strong></div>
            <div><span>{t.amountPaid}</span><strong>{money(paid.amountDueNow)}</strong></div>
          </div>
          <div className="qr-card">
            <div className="qr-code"><QRCodeSVG value={qrValue} size={176} level="M" includeMargin /></div>
            <div className="qr-copy"><p className="eyebrow">{t.qrTitle}</p><p>{t.qrHelp}</p></div>
          </div>
          <div className="reminder-note"><span>♡</span><p>{t.reminders}</p></div>
          <div className="confirmation-actions">
            <button className="button button-plum" type="button" onClick={() => openStaffPreview(currentBooking.id)}>{t.staffPreview}</button>
            <button className="button button-outline" type="button" onClick={() => { setPage('home'); setStaffId(null) }}>{t.startOver}</button>
          </div>
        </div>
      </main>
    )
  }

  function renderStaff() {
    if (!staffBooking) {
      return (
        <main className="staff-page">
          <div className="staff-card">
            <p className="eyebrow">{t.staffDemo}</p>
            <h1>{t.staffTitle}</h1>
            <p>{t.bookingNotFound}</p>
            <button className="button button-outline" type="button" onClick={closeStaffPreview}>{t.startOver}</button>
          </div>
        </main>
      )
    }
    return (
      <main className="staff-page">
        <div className="staff-card">
          <p className="eyebrow">{t.staffDemo}</p>
          <h1>{t.staffTitle}</h1>
          <p className="staff-code">{staffBooking.id}</p>
          <div className="staff-details">
            <div><span>{t.summaryDate}</span><strong>{displayDate(staffBooking.date, language)}</strong></div>
            <div><span>{t.summaryTime}</span><strong>{formatTime(staffBooking.startMin)}</strong></div>
            <div><span>{t.summaryDuration}</span><strong>{t.durations[staffBooking.duration].duration}</strong></div>
            <div><span>{t.summaryGuests}</span><strong>{staffBooking.guests.length}</strong></div>
            <div><span>{t.contactHeading}</span><strong>{staffBooking.contact.name}</strong><small>{staffBooking.contact.phone} · {staffBooking.contact.email}</small></div>
            <div><span>{t.paymentStatus}</span><strong>{staffBooking.paymentType === 'deposit' ? t.demoDeposit : t.demoFull}</strong></div>
          </div>
          <h2>{t.selectedLooks}</h2>
          <ul className="staff-guest-list">
            {staffBooking.guests.map((guest, index) => {
              const hanbok = HANBOK_OPTIONS.find((option) => option.id === guest.hanbokId)
              const hair = HAIRSTYLES.find((style) => style.id === guest.hairstyleId)
              return (
                <li key={`${staffBooking.id}-${index}`}>
                  <strong>{t.guest} {index + 1} · {language === 'ko' ? hanbok?.nameKo : hanbok?.nameEn}</strong>
                  <span>{language === 'ko' ? hair?.nameKo : hair?.nameEn}{guest.makeup ? ` · ${t.makeupTitle}` : ''}{guest.shoes ? ` · ${t.shoesTitle} ${guest.shoeSize} mm` : ''}{guest.bag ? ` · ${t.bagTitle}` : ''}</span>
                  <small>{money(getGuestPrice(guest))}</small>
                </li>
              )
            })}
          </ul>
          <div className="staff-total"><span>{t.summaryTotal}</span><strong>{money(staffBooking.total)}</strong></div>
          <p className="demo-banner">{t.qrHelp}</p>
          <button className="button button-outline" type="button" onClick={closeStaffPreview}>{t.startOver}</button>
        </div>
      </main>
    )
  }

  return (
    <div className="app-shell">
      {renderHeader()}
      {storageError && <div className="storage-alert" role="alert">{t.storageError}</div>}
      {isStaffMode ? renderStaff() : page === 'home' ? renderHome() : page === 'booking' ? renderBooking() : renderConfirmation()}
    </div>
  )
}

export default App
