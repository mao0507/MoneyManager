import { describe, expect, it } from 'vitest'
import {
  ValidationError,
  sanitizeExpenseUpdate,
  sanitizeSubscriptionUpdate,
  validateNewExpense,
  validateNewSubscription,
} from './validation'

describe('sanitizeSubscriptionUpdate', () => {
  it('drops fields outside the whitelist, including userId', () => {
    const updates = sanitizeSubscriptionUpdate({
      name: 'Netflix',
      userId: 'attacker-controlled-id',
      id: 'also-not-allowed',
      createdAt: 'nope',
    })

    expect(updates).toEqual({ name: 'Netflix' })
  })

  it('rejects an invalid cycle value', () => {
    expect(() => sanitizeSubscriptionUpdate({ cycle: 'Weekly' })).toThrow(ValidationError)
  })

  it('rejects a negative amount', () => {
    expect(() => sanitizeSubscriptionUpdate({ amount: -1 })).toThrow(ValidationError)
  })
})

describe('validateNewSubscription', () => {
  it('accepts a well-formed payload', () => {
    expect(() =>
      validateNewSubscription({
        name: 'Netflix',
        plan: 'Standard',
        amount: 390,
        currency: 'TWD',
        cycle: 'Monthly',
        paymentMethod: 'Credit Card',
        renewal: 'Automatic',
        startDate: '2026-01-15',
        nextPayment: '2026-02-15',
      }),
    ).not.toThrow()
  })

  it('rejects a non-numeric amount', () => {
    expect(() =>
      validateNewSubscription({
        name: 'Netflix',
        plan: 'Standard',
        amount: 'abc',
        currency: 'TWD',
        cycle: 'Monthly',
        paymentMethod: 'Credit Card',
        renewal: 'Automatic',
        startDate: '2026-01-15',
        nextPayment: '2026-02-15',
      }),
    ).toThrow(ValidationError)
  })

  it('rejects an unrecognised currency', () => {
    expect(() =>
      validateNewSubscription({
        name: 'Netflix',
        plan: 'Standard',
        amount: 390,
        currency: 'JPY',
        cycle: 'Monthly',
        paymentMethod: 'Credit Card',
        renewal: 'Automatic',
        startDate: '2026-01-15',
        nextPayment: '2026-02-15',
      }),
    ).toThrow(ValidationError)
  })
})

describe('sanitizeExpenseUpdate', () => {
  it('drops fields outside the whitelist, including userId', () => {
    const updates = sanitizeExpenseUpdate({
      title: '午餐',
      userId: 'attacker-controlled-id',
      id: 'also-not-allowed',
    })

    expect(updates).toEqual({ title: '午餐' })
  })

  it('rejects a negative amount', () => {
    expect(() => sanitizeExpenseUpdate({ amount: -1 })).toThrow(ValidationError)
  })
})

describe('validateNewExpense', () => {
  it('accepts a well-formed payload', () => {
    expect(() =>
      validateNewExpense({
        title: '午餐',
        amount: 180,
        category: '餐飲',
        date: '2026-01-15',
        paymentMethod: '信用卡',
      }),
    ).not.toThrow()
  })

  it('rejects a missing title', () => {
    expect(() =>
      validateNewExpense({
        amount: 180,
        category: '餐飲',
        date: '2026-01-15',
        paymentMethod: '信用卡',
      }),
    ).toThrow(ValidationError)
  })
})
