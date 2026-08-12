import { describe, expect, it } from 'vitest'
import {
  calculateMonthlyEquivalentTotal,
  calculateNextPayment,
  calculateYearlyEquivalentTotal,
  convertCurrency,
} from './subscription-calc'

describe('convertCurrency', () => {
  it('returns the amount unchanged when currencies match', () => {
    expect(convertCurrency(100, 'TWD', 'TWD', 31.5)).toBe(100)
  })

  it('multiplies by rate when currencies differ', () => {
    expect(convertCurrency(10, 'USD', 'TWD', 31.5)).toBe(315)
  })

  it('throws when rate is zero or negative', () => {
    expect(() => convertCurrency(10, 'USD', 'TWD', 0)).toThrow()
    expect(() => convertCurrency(10, 'USD', 'TWD', -1)).toThrow()
  })
})

describe('calculateNextPayment', () => {
  it('adds one month for a Monthly cycle', () => {
    expect(calculateNextPayment('2026-03-15', 'Monthly')).toBe('2026-04-15')
  })

  it('rolls over into the next year for a December Monthly subscription', () => {
    expect(calculateNextPayment('2026-12-05', 'Monthly')).toBe('2027-01-05')
  })

  it('clamps to the last day of the target month instead of overflowing', () => {
    // Jan 31 + 1 month must land on Feb 28 (2026 is not a leap year), not Mar 3
    expect(calculateNextPayment('2026-01-31', 'Monthly')).toBe('2026-02-28')
  })

  it('adds one year for a Yearly cycle', () => {
    expect(calculateNextPayment('2026-04-17', 'Yearly')).toBe('2027-04-17')
  })

  it('clamps Feb 29 to Feb 28 when the target year is not a leap year', () => {
    // 2028 is a leap year, 2029 is not
    expect(calculateNextPayment('2028-02-29', 'Yearly')).toBe('2029-02-28')
  })

  it('throws on a malformed startDate', () => {
    expect(() => calculateNextPayment('', 'Monthly')).toThrow()
    expect(() => calculateNextPayment('2026/03/15', 'Monthly')).toThrow()
  })
})

describe('calculateMonthlyEquivalentTotal', () => {
  it('sums active Monthly subscriptions in the display currency at face value', () => {
    const subs = [
      { amount: 100, currency: 'TWD' as const, cycle: 'Monthly' as const, active: true },
      { amount: 50, currency: 'TWD' as const, cycle: 'Monthly' as const, active: true },
    ]
    expect(calculateMonthlyEquivalentTotal(subs, 'TWD', 31.5)).toBe(150)
  })

  it('divides Yearly subscriptions by 12', () => {
    const subs = [{ amount: 1200, currency: 'TWD' as const, cycle: 'Yearly' as const, active: true }]
    expect(calculateMonthlyEquivalentTotal(subs, 'TWD', 31.5)).toBe(100)
  })

  it('combines Monthly and Yearly subscriptions in the same currency', () => {
    const subs = [
      { amount: 100, currency: 'TWD' as const, cycle: 'Monthly' as const, active: true },
      { amount: 1200, currency: 'TWD' as const, cycle: 'Yearly' as const, active: true },
    ]
    // 100 (Monthly at face value) + 1200/12 (Yearly equivalent) = 200
    expect(calculateMonthlyEquivalentTotal(subs, 'TWD', 31.5)).toBe(200)
  })

  it('converts currency before combining cycles', () => {
    const subs = [
      { amount: 100, currency: 'TWD' as const, cycle: 'Monthly' as const, active: true },
      { amount: 12, currency: 'USD' as const, cycle: 'Yearly' as const, active: true },
    ]
    // 100 TWD (Monthly) + (12 USD * 31.5 = 378 TWD) / 12 (Yearly equivalent) = 100 + 31.5 = 131.5
    expect(calculateMonthlyEquivalentTotal(subs, 'TWD', 31.5)).toBe(131.5)
  })

  it('ignores inactive subscriptions', () => {
    const subs = [
      { amount: 100, currency: 'TWD' as const, cycle: 'Monthly' as const, active: true },
      { amount: 999, currency: 'TWD' as const, cycle: 'Monthly' as const, active: false },
    ]
    expect(calculateMonthlyEquivalentTotal(subs, 'TWD', 31.5)).toBe(100)
  })
})

describe('calculateYearlyEquivalentTotal', () => {
  it('sums active Yearly subscriptions at face value', () => {
    const subs = [{ amount: 1200, currency: 'TWD' as const, cycle: 'Yearly' as const, active: true }]
    expect(calculateYearlyEquivalentTotal(subs, 'TWD', 31.5)).toBe(1200)
  })

  it('multiplies Monthly subscriptions by 12', () => {
    const subs = [{ amount: 100, currency: 'TWD' as const, cycle: 'Monthly' as const, active: true }]
    expect(calculateYearlyEquivalentTotal(subs, 'TWD', 31.5)).toBe(1200)
  })

  it('converts currency before combining cycles', () => {
    const subs = [
      { amount: 1200, currency: 'TWD' as const, cycle: 'Yearly' as const, active: true },
      { amount: 10, currency: 'USD' as const, cycle: 'Monthly' as const, active: true },
    ]
    // 1200 TWD (Yearly) + (10 USD * 31.5 = 315 TWD) * 12 (Monthly equivalent) = 1200 + 3780 = 4980
    expect(calculateYearlyEquivalentTotal(subs, 'TWD', 31.5)).toBe(4980)
  })

  it('throws instead of dividing by zero when the rate is invalid', () => {
    const subs = [{ amount: 100, currency: 'USD' as const, cycle: 'Monthly' as const, active: true }]
    expect(() => calculateYearlyEquivalentTotal(subs, 'TWD', 0)).toThrow()
  })
})
