export type DurationKey = 'short' | 'long' | 'day'

export type GuestSelection = {
  hanbokId: string
  hairstyleId: string
  makeup: boolean
  shoes: boolean
  shoeSize: string
  bag: boolean
}

export type ContactDetails = {
  name: string
  phone: string
  email: string
}

export type BookingRecord = {
  id: string
  date: string
  startMin: number
  endMin: number
  duration: DurationKey
  guests: GuestSelection[]
  contact: ContactDetails
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

export type HairstyleOption = {
  id: string
  nameEn: string
  nameKo: string
  price: number
  color: string
  imageUrl?: string
}

export const MAX_CONCURRENT_GUESTS = 3
export const OPENING_MINUTE = 9 * 60
export const CLOSING_MINUTE = 19 * 60
export const BOOKING_STORAGE_KEY = 'hanbokgirls-demo-bookings'

export const DURATIONS: Record<DurationKey, number> = {
  short: 90,
  long: 180,
  day: CLOSING_MINUTE - OPENING_MINUTE,
}

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
  { id: 'natural', nameEn: 'Natural hair', nameKo: '자연스러운 헤어', price: 0, color: '#d8c3ad' },
  { id: 'soft-bun', nameEn: 'Soft bun', nameKo: '단아한 쪽머리', price: 5000, color: '#c9b29b' },
  { id: 'braided', nameEn: 'Braided accent', nameKo: '땋은 머리 장식', price: 10000, color: '#b88767' },
  { id: 'royal-updo', nameEn: 'Royal updo', nameKo: '왕실 업스타일', price: 15000, color: '#d2ad71' },
]

export const SHOE_SIZES = ['220', '225', '230', '235', '240', '245', '250', '255', '260', '265', '270', '275', '280']

export function createGuestSelection(): GuestSelection {
  return {
    hanbokId: HANBOK_OPTIONS[0].id,
    hairstyleId: HAIRSTYLES[0].id,
    makeup: false,
    shoes: false,
    shoeSize: '',
    bag: false,
  }
}

export function localDateString(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTimeSlots(
  date: string,
  duration: DurationKey,
  guestCount: number,
  bookings: CapacityBooking[],
  now = new Date(),
): { startMin: number; remainingCapacity: number }[] {
  const sessionLength = DURATIONS[duration]
  const lastStart = CLOSING_MINUTE - sessionLength
  const starts =
    duration === 'day'
      ? [OPENING_MINUTE]
      : Array.from(
          { length: Math.floor((lastStart - OPENING_MINUTE) / 30) + 1 },
          (_, index) => OPENING_MINUTE + index * 30,
        )

  return starts
    .map((startMin) => {
      const endMin = startMin + sessionLength
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
    (guest.makeup ? 20000 : 0) +
    (guest.shoes ? 15000 : 0)
  )
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
    typeof guest.shoes === 'boolean' &&
    typeof guest.shoeSize === 'string' &&
    typeof guest.bag === 'boolean'
  )
}
