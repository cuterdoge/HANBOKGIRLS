import { describe, expect, it } from 'vitest'
import {
  CLOSING_MINUTE,
  JEOGORI_OPTIONS,
  DURATIONS,
  getGuestPrice,
  getCompatibleOptions,
  getPackageTotal,
  getPaymentAmounts,
  getTimeSlots,
  type CapacityBooking,
  createGuestSelection,
  isBookingRecord,
} from './booking'

describe('booking time slots', () => {
  const future = new Date(2030, 0, 1, 8, 0)

  it('only offers starts that fit the selected duration within opening hours', () => {
    const short = getTimeSlots('2030-01-02', 'short', 1, [], future)
    const long = getTimeSlots('2030-01-02', 'long', 1, [], future)
    const day = getTimeSlots('2030-01-02', 'day', 1, [], future)

    expect(short[0].startMin).toBe(9 * 60)
    expect(short.at(-1)?.startMin).toBe(CLOSING_MINUTE - DURATIONS.short)
    expect(long.at(-1)?.startMin).toBe(CLOSING_MINUTE - DURATIONS.long)
    expect(day.map((slot) => slot.startMin)).toEqual([9 * 60])
  })

  it('accounts for customers in overlapping bookings and leaves other dates untouched', () => {
    const existing: CapacityBooking[] = [
      {
        date: '2030-01-02',
        startMin: 10 * 60,
        endMin: 11 * 60 + 30,
        guests: [createGuestSelection(), createGuestSelection()],
      },
    ]

    const oneGuestSlots = getTimeSlots('2030-01-02', 'short', 1, existing, future)
    const twoGuestSlots = getTimeSlots('2030-01-02', 'short', 2, existing, future)
    const differentDateSlots = getTimeSlots('2030-01-03', 'short', 3, existing, future)

    expect(oneGuestSlots.some((slot) => slot.startMin === 9 * 60 + 30)).toBe(true)
    expect(twoGuestSlots.some((slot) => slot.startMin === 9 * 60 + 30)).toBe(false)
    expect(differentDateSlots.some((slot) => slot.startMin === 9 * 60 + 30)).toBe(true)
  })

  it('does not offer slots already in the past today', () => {
    const now = new Date(2030, 0, 2, 10, 0)
    const slots = getTimeSlots('2030-01-02', 'short', 1, [], now)

    expect(slots.some((slot) => slot.startMin <= 10 * 60)).toBe(false)
    expect(slots[0].startMin).toBe(10 * 60 + 30)
  })
})

describe('booking price calculations', () => {
  it('adds paid options while keeping natural hair and bags free', () => {
    const guest = createGuestSelection()
    guest.hanbokId = 'ceremony-heirloom'
    guest.hairstyleId = 'royal-updo'
    guest.makeup = true
    guest.shoes = true
    guest.bag = true

    expect(getGuestPrice(guest)).toBe(50000 + 15000 + 20000 + 15000)
  })

  it('calculates the 20 percent deposit and remaining amount', () => {
    expect(getPaymentAmounts(235000, 'deposit')).toEqual({
      amountDueNow: 47000,
      remainingBalance: 188000,
    })
    expect(getPaymentAmounts(235000, 'full')).toEqual({
      amountDueNow: 235000,
      remainingBalance: 0,
    })
  })

  describe('demo packages and wardrobe sizing', () => {
    it('charges a fixed sample package price per guest', () => {
      expect(getPackageTotal('styled', 2)).toBe(130000)
      expect(getPackageTotal('complete', 1)).toBe(100000)
    })

    it('filters sample Jeogori options by clothing size', () => {
      expect(getCompatibleOptions(JEOGORI_OPTIONS, 'XXL').map((option) => option.id)).toEqual([
        'rose-jeogori',
        'jade-jeogori',
        'moon-jeogori',
      ])
    })

    it('continues to accept older browser-saved bookings without the new demo fields', () => {
      expect(isBookingRecord({
        id: 'HG-LEGACY',
        date: '2030-01-02',
        startMin: 540,
        endMin: 630,
        duration: 'short',
        guests: [{
          hanbokId: 'spring-garden',
          hairstyleId: 'natural',
          makeup: false,
          shoes: false,
          shoeSize: '',
          bag: false,
        }],
        contact: { name: 'Guest', phone: '+821012345678', email: 'guest@example.com' },
        paymentType: 'full',
        total: 20000,
        amountPaid: 20000,
        createdAt: '2030-01-01T00:00:00.000Z',
      })).toBe(true)
    })
  })
})
