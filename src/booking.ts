export type DurationKey = 'short' | 'long' | 'day'
export type PackageId = 'special' | 'premium' | 'luxury'
export type LegacyPackageId = 'essential' | 'styled' | 'complete'
export type MakeupService = 'men' | 'women'
export type ServiceLanguage = 'en' | 'ko' | 'zh'
export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type ColorPalette = 'warm' | 'cool' | 'neutral'
export type JewelryTone = 'gold' | 'silver' | 'both'
export type ColorQuestionnaireAnswers = {
  jewelryTone?: JewelryTone
  preferredPalette?: ColorPalette
}

export type GuestSelection = {
  hanbokId: string
  hairstyleId: string
  makeup: boolean
  makeupService?: MakeupService
  shoes: boolean
  shoeSize: string
  bag: boolean
  jeogoriId?: string
  chimaId?: string
  hairAccessoryId?: string
  norigaeId?: string
  heightCm?: number
  clothingSize?: ClothingSize
  colorPalette?: ColorPalette
}

export type ContactDetails = {
  name: string
  phone: string
  email: string
  countryOfOrigin?: string
  serviceLanguage?: ServiceLanguage
  smsReminderConsent?: boolean
}

export type BookingRecord = {
  id: string
  date: string
  startMin: number
  endMin: number
  duration: DurationKey
  guests: GuestSelection[]
  contact: ContactDetails
  tierId?: PackageId
  packageId?: LegacyPackageId
  paymentType: 'full' | 'deposit'
  total: number
  amountPaid: number
  createdAt: string
}

export type CapacityBooking = Pick<BookingRecord, 'date' | 'startMin' | 'endMin' | 'guests'>
export type HanbokOption = {
  id: string
  nameEn: string
  nameKo: string
  price: number
  color: string
  imageUrl?: string
}

export type HairstyleOption = WardrobeOption & {
  price: number
  imageUrl?: string
}

export type HanbokTier = {
  id: PackageId
  nameEn: string
  nameKo: string
  nameZh: string
  descriptionEn: string
  descriptionKo: string
  descriptionZh: string
  prices: Record<DurationKey, number>
}

export type WardrobeOption = {
  id: string
  nameEn: string
  nameKo: string
  nameZh: string
  color: string
  palette: ColorPalette
  sizes: readonly ClothingSize[]
  imageUrl?: string
}

export const MAX_CONCURRENT_GUESTS = 3
export const OPENING_MINUTE = 9 * 60
export const CLOSING_MINUTE = 19 * 60
export const BOOKING_STORAGE_KEY = 'hanbokgirls-demo-bookings'

export const DURATIONS: Record<Exclude<DurationKey, 'day'>, number> = {
  short: 120,
  long: 240,
}
export const MAKEUP_PRICES: Record<MakeupService, number> = {
  men: 70000,
  women: 100000,
}
export const SHOE_RENTAL_PRICE = 15000

const ALL_CLOTHING_SIZES: readonly ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const HANBOK_OPTIONS: HanbokOption[] = [
  { id: 'spring-garden', nameEn: 'Spring Garden', nameKo: '봄 정원', price: 20000, color: '#c4d2a2' },
  { id: 'peach-blossom', nameEn: 'Peach Blossom', nameKo: '복숭아꽃', price: 25000, color: '#e8b5a8' },
  { id: 'cloud-blue', nameEn: 'Cloud Blue', nameKo: '구름 하늘', price: 28000, color: '#a9c5d5' },
  { id: 'moonlight-cream', nameEn: 'Moonlight Cream', nameKo: '달빛 크림', price: 30000, color: '#e6d9bb' },
  { id: 'royal-plum', nameEn: 'Royal Plum', nameKo: '로열 플럼', price: 35000, color: '#9b758b' },
  { id: 'rose-garden', nameEn: 'Rose Garden', nameKo: '장미 정원', price: 38000, color: '#d58c9b' },
  { id: 'jade-elegance', nameEn: 'Jade Elegance', nameKo: '비취의 우아함', price: 40000, color: '#72998a' },
  { id: 'golden-hour', nameEn: 'Golden Hour', nameKo: '황금빛 노을', price: 42000, color: '#d2ad71' },
  { id: 'midnight-lotus', nameEn: 'Midnight Lotus', nameKo: '한밤의 연꽃', price: 45000, color: '#596c83' },
  { id: 'ceremony-heirloom', nameEn: 'Ceremony Heirloom', nameKo: '예식 명작', price: 50000, color: '#9e5362' },
] as const

export const HAIRSTYLES: HairstyleOption[] = [
  { id: 'natural', nameEn: 'Natural hair', nameKo: '자연스러운 헤어', nameZh: '自然发型', price: 0, color: '#d8c3ad', palette: 'neutral', sizes: ALL_CLOTHING_SIZES },
  { id: 'soft-bun', nameEn: 'Soft bun', nameKo: '단아한 쪽머리', nameZh: '优雅发髻', price: 5000, color: '#c9b29b', palette: 'warm', sizes: ALL_CLOTHING_SIZES },
  { id: 'braided', nameEn: 'Braided accent', nameKo: '땋은 머리 장식', nameZh: '编发造型', price: 10000, color: '#b88767', palette: 'warm', sizes: ALL_CLOTHING_SIZES },
  { id: 'royal-updo', nameEn: 'Royal updo', nameKo: '왕실 업스타일', nameZh: '宫廷盘发', price: 15000, color: '#d2ad71', palette: 'neutral', sizes: ALL_CLOTHING_SIZES },
]

export const HANBOK_TIERS: HanbokTier[] = [
  {
    id: 'special',
    nameEn: 'Special Hanbok',
    nameKo: '스페셜 한복',
    nameZh: '特别韩服',
    descriptionEn: 'A charming Hanbok rental for your Seoul day.',
    descriptionKo: '서울에서의 하루를 위한 특별한 한복 대여예요.',
    descriptionZh: '为您的首尔之旅准备的特别韩服租赁。',
    prices: { short: 20000, long: 30000, day: 60000 },
  },
  {
    id: 'premium',
    nameEn: 'Premium Hanbok',
    nameKo: '프리미엄 한복',
    nameZh: '高级韩服',
    descriptionEn: 'A refined Hanbok rental with elevated details.',
    descriptionKo: '한층 더 섬세한 디테일을 갖춘 한복 대여예요.',
    descriptionZh: '细节更精致的韩服租赁体验。',
    prices: { short: 30000, long: 40000, day: 70000 },
  },
  {
    id: 'luxury',
    nameEn: 'Luxury Hanbok',
    nameKo: '럭셔리 한복',
    nameZh: '奢华韩服',
    descriptionEn: 'An elegant Hanbok rental for a special occasion.',
    descriptionKo: '특별한 날을 위한 우아한 한복 대여예요.',
    descriptionZh: '适合特别场合的优雅韩服租赁。',
    prices: { short: 40000, long: 50000, day: 80000 },
  },
]

export const JEOGORI_OPTIONS: WardrobeOption[] = [
  { id: 'rose-jeogori', nameEn: 'Rose Garden', nameKo: '장미 정원', nameZh: '玫瑰花园', color: '#d58c9b', palette: 'warm', sizes: ALL_CLOTHING_SIZES },
  { id: 'cloud-jeogori', nameEn: 'Cloud Blue', nameKo: '구름 하늘', nameZh: '云朵蓝', color: '#a9c5d5', palette: 'cool', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 'jade-jeogori', nameEn: 'Jade Elegance', nameKo: '비취의 우아함', nameZh: '翡翠雅韵', color: '#72998a', palette: 'cool', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'moon-jeogori', nameEn: 'Moonlight Cream', nameKo: '달빛 크림', nameZh: '月光奶油', color: '#e6d9bb', palette: 'neutral', sizes: ALL_CLOTHING_SIZES },
]

export const CHIMA_OPTIONS: WardrobeOption[] = [
  { id: 'peach-chima', nameEn: 'Peach Blossom', nameKo: '복숭아꽃', nameZh: '桃花', color: '#e8b5a8', palette: 'warm', sizes: ALL_CLOTHING_SIZES },
  { id: 'midnight-chima', nameEn: 'Midnight Lotus', nameKo: '한밤의 연꽃', nameZh: '午夜莲花', color: '#596c83', palette: 'cool', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 'golden-chima', nameEn: 'Golden Hour', nameKo: '황금빛 노을', nameZh: '鎏金时刻', color: '#d2ad71', palette: 'warm', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'spring-chima', nameEn: 'Spring Garden', nameKo: '봄 정원', nameZh: '春日花园', color: '#c4d2a2', palette: 'neutral', sizes: ALL_CLOTHING_SIZES },
]

export const HAIR_ACCESSORIES: WardrobeOption[] = [
  { id: 'silk-ribbon', nameEn: 'Silk ribbon', nameKo: '실크 댕기', nameZh: '丝绸发带', color: '#b76f78', palette: 'warm', sizes: ALL_CLOTHING_SIZES },
  { id: 'pearl-pin', nameEn: 'Pearl hairpin', nameKo: '진주 비녀', nameZh: '珍珠发簪', color: '#eee1c7', palette: 'neutral', sizes: ALL_CLOTHING_SIZES },
  { id: 'jade-pin', nameEn: 'Jade hairpin', nameKo: '비취 비녀', nameZh: '翡翠发簪', color: '#72998a', palette: 'cool', sizes: ALL_CLOTHING_SIZES },
]

export const NORIGAE_OPTIONS: WardrobeOption[] = [
  { id: 'lotus-norigae', nameEn: 'Lotus Norigae', nameKo: '연꽃 노리개', nameZh: '莲花韩服挂饰', color: '#d58c9b', palette: 'warm', sizes: ALL_CLOTHING_SIZES },
  { id: 'jade-norigae', nameEn: 'Jade Norigae', nameKo: '비취 노리개', nameZh: '翡翠韩服挂饰', color: '#72998a', palette: 'cool', sizes: ALL_CLOTHING_SIZES },
  { id: 'cream-norigae', nameEn: 'Cream Norigae', nameKo: '크림 노리개', nameZh: '奶油色韩服挂饰', color: '#e6d9bb', palette: 'neutral', sizes: ALL_CLOTHING_SIZES },
]

export const SHOE_SIZES = ['220', '225', '230', '235', '240', '245', '250', '255', '260', '265', '270', '275', '280']
export const CLOTHING_SIZES: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export function createGuestSelection(): GuestSelection {
  return {
    hanbokId: HANBOK_OPTIONS[0].id,
    hairstyleId: HAIRSTYLES[0].id,
    makeup: false,
    shoes: false,
    shoeSize: '',
    bag: false,
    jeogoriId: JEOGORI_OPTIONS[0].id,
    chimaId: CHIMA_OPTIONS[0].id,
  }
}

export function localDateString(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getBookingEndMinute(startMin: number, duration: DurationKey): number {
  return duration === 'day' ? CLOSING_MINUTE : startMin + DURATIONS[duration]
}

export function suggestColorPalette(answers: ColorQuestionnaireAnswers): ColorPalette | undefined {
  if (answers.preferredPalette) return answers.preferredPalette
  if (answers.jewelryTone === 'gold') return 'warm'
  if (answers.jewelryTone === 'silver') return 'cool'
  if (answers.jewelryTone === 'both') return 'neutral'
  return undefined
}

export function getTimeSlots(
  date: string,
  duration: DurationKey,
  guestCount: number,
  bookings: CapacityBooking[],
  now = new Date(),
): { startMin: number; remainingCapacity: number }[] {
  const lastStart =
    duration === 'day' ? 16 * 60 - 30 : CLOSING_MINUTE - DURATIONS[duration]
  const starts = Array.from(
    { length: Math.floor((lastStart - OPENING_MINUTE) / 30) + 1 },
    (_, index) => OPENING_MINUTE + index * 30,
  )

  return starts
    .map((startMin) => {
      const endMin = getBookingEndMinute(startMin, duration)
      let remainingCapacity = MAX_CONCURRENT_GUESTS

      for (let minute = startMin; minute < endMin; minute += 30) {
        const occupied = bookings.reduce((total, booking) => {
          const overlaps =
            booking.date === date &&
            booking.startMin < minute + 30 &&
            booking.endMin > minute
          return total + (overlaps ? booking.guests.length : 0)
        }, 0)
        remainingCapacity = Math.min(remainingCapacity, MAX_CONCURRENT_GUESTS - occupied)
      }

      return { startMin, remainingCapacity }
    })
    .filter(({ startMin }) => {
      if (date !== localDateString(now)) return true
      return startMin > now.getHours() * 60 + now.getMinutes()
    })
    .filter(({ remainingCapacity }) => remainingCapacity >= guestCount)
}

export function formatTime(startMin: number): string {
  const hour = Math.floor(startMin / 60)
  const minute = startMin % 60
  const suffix = hour < 12 ? 'AM' : 'PM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`
}

export function getGuestPrice(guest: GuestSelection): number {
  const hanbok = HANBOK_OPTIONS.find((option) => option.id === guest.hanbokId)
  const hairstyle = HAIRSTYLES.find((option) => option.id === guest.hairstyleId)
  return (
    (hanbok?.price ?? 0) +
    (hairstyle?.price ?? 0) +
    (guest.makeupService ? MAKEUP_PRICES[guest.makeupService] : 0) +
    (guest.shoes ? SHOE_RENTAL_PRICE : 0)
  )
}

export function getPackageTotal(
  tierId: PackageId,
  duration: DurationKey,
  guestCount: number,
): number {
  const tier = HANBOK_TIERS.find((option) => option.id === tierId)
  if (!tier) throw new Error(`Unknown Hanbok tier: ${tierId}`)
  if (!Number.isInteger(guestCount) || guestCount < 1) {
    throw new Error('Guest count must be a positive integer')
  }
  return tier.prices[duration] * guestCount
}

export function getMakeupTotal(guests: readonly GuestSelection[]): number {
  return guests.reduce(
    (total, guest) => total + (guest.makeupService ? MAKEUP_PRICES[guest.makeupService] : 0),
    0,
  )
}

export function getBookingTotal(
  tierId: PackageId,
  duration: DurationKey,
  guests: readonly GuestSelection[],
): number {
  const shoeTotal = guests.filter((guest) => guest.shoes).length * SHOE_RENTAL_PRICE
  return getPackageTotal(tierId, duration, guests.length) + getMakeupTotal(guests) + shoeTotal
}

export function getCompatibleOptions<T extends WardrobeOption>(
  options: readonly T[],
  size: ClothingSize,
): T[] {
  return options.filter((option) => option.sizes.includes(size))
}

export function getPaymentAmounts(total: number, paymentType: 'full' | 'deposit'): {
  amountDueNow: number
  remainingBalance: number
} {
  const amountDueNow = paymentType === 'full' ? total : Math.round(total * 0.2)
  return { amountDueNow, remainingBalance: total - amountDueNow }
}

export function isBookingRecord(value: unknown): value is BookingRecord {
  if (!value || typeof value !== 'object') return false
  const booking = value as Partial<BookingRecord>
  const validDuration =
    booking.duration === 'short' || booking.duration === 'long' || booking.duration === 'day'
  const validContact =
    !!booking.contact &&
    typeof booking.contact.name === 'string' &&
    typeof booking.contact.phone === 'string' &&
    typeof booking.contact.email === 'string'
  const validOptionalContact =
    (booking.contact?.countryOfOrigin === undefined ||
      typeof booking.contact.countryOfOrigin === 'string') &&
    (booking.contact?.serviceLanguage === undefined ||
      booking.contact.serviceLanguage === 'en' ||
      booking.contact.serviceLanguage === 'ko' ||
      booking.contact.serviceLanguage === 'zh') &&
    (booking.contact?.smsReminderConsent === undefined ||
      typeof booking.contact.smsReminderConsent === 'boolean')
  const validOptionalPackage =
    booking.packageId === undefined ||
    booking.packageId === 'essential' ||
    booking.packageId === 'styled' ||
    booking.packageId === 'complete'
  const validOptionalTier =
    booking.tierId === undefined ||
    booking.tierId === 'special' ||
    booking.tierId === 'premium' ||
    booking.tierId === 'luxury'
  return (
    typeof booking.id === 'string' &&
    typeof booking.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(booking.date) &&
    typeof booking.startMin === 'number' &&
    Number.isFinite(booking.startMin) &&
    typeof booking.endMin === 'number' &&
    Number.isFinite(booking.endMin) &&
    booking.endMin > booking.startMin &&
    validDuration &&
    (booking.paymentType === 'full' || booking.paymentType === 'deposit') &&
    Array.isArray(booking.guests) &&
    booking.guests.length > 0 &&
    booking.guests.every(isGuestSelection) &&
    validOptionalContact &&
    validOptionalPackage &&
    validOptionalTier &&
    typeof booking.total === 'number' &&
    Number.isFinite(booking.total) &&
    typeof booking.amountPaid === 'number' &&
    Number.isFinite(booking.amountPaid) &&
    validContact &&
    typeof booking.createdAt === 'string'
  )
}

function isGuestSelection(value: unknown): value is GuestSelection {
  if (!value || typeof value !== 'object') return false
  const guest = value as Partial<GuestSelection>
  return (
    typeof guest.hanbokId === 'string' &&
    typeof guest.hairstyleId === 'string' &&
    typeof guest.makeup === 'boolean' &&
    (guest.makeupService === undefined ||
      guest.makeupService === 'men' ||
      guest.makeupService === 'women') &&
    typeof guest.shoes === 'boolean' &&
    typeof guest.shoeSize === 'string' &&
    typeof guest.bag === 'boolean' &&
    (guest.jeogoriId === undefined || typeof guest.jeogoriId === 'string') &&
    (guest.chimaId === undefined || typeof guest.chimaId === 'string') &&
    (guest.hairAccessoryId === undefined || typeof guest.hairAccessoryId === 'string') &&
    (guest.norigaeId === undefined || typeof guest.norigaeId === 'string') &&
    (guest.heightCm === undefined ||
      (typeof guest.heightCm === 'number' && Number.isFinite(guest.heightCm))) &&
    (guest.clothingSize === undefined ||
      CLOTHING_SIZES.includes(guest.clothingSize as ClothingSize)) &&
    (guest.colorPalette === undefined ||
      guest.colorPalette === 'warm' ||
      guest.colorPalette === 'cool' ||
      guest.colorPalette === 'neutral')
  )
}
