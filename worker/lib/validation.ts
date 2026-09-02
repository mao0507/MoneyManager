export class ValidationError extends Error {}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

function isFiniteNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function pick<T extends Record<string, unknown>, K extends keyof T>(
  source: T,
  keys: readonly K[],
): Partial<T> {
  const result: Partial<T> = {}
  for (const key of keys) {
    if (key in source) result[key] = source[key]
  }
  return result
}

const CURRENCIES = ['TWD', 'USD'] as const
const CYCLES = ['Monthly', 'Yearly'] as const
const RENEWALS = ['Automatic', 'Manual'] as const

const SUBSCRIPTION_UPDATABLE_FIELDS = [
  'name',
  'plan',
  'amount',
  'currency',
  'cycle',
  'category',
  'paymentMethod',
  'renewal',
  'startDate',
  'nextPayment',
  'active',
] as const

export function validateNewSubscription(body: Record<string, unknown>) {
  if (!isNonEmptyString(body.name)) throw new ValidationError('name 必填')
  if (!isNonEmptyString(body.plan)) throw new ValidationError('plan 必填')
  if (!isFiniteNonNegativeNumber(body.amount)) throw new ValidationError('amount 必須是非負數字')
  if (!CURRENCIES.includes(body.currency as (typeof CURRENCIES)[number]))
    throw new ValidationError('currency 必須是 TWD 或 USD')
  if (!CYCLES.includes(body.cycle as (typeof CYCLES)[number]))
    throw new ValidationError('cycle 必須是 Monthly 或 Yearly')
  if (!RENEWALS.includes(body.renewal as (typeof RENEWALS)[number]))
    throw new ValidationError('renewal 必須是 Automatic 或 Manual')
  if (!isNonEmptyString(body.paymentMethod)) throw new ValidationError('paymentMethod 必填')
  if (!isNonEmptyString(body.startDate)) throw new ValidationError('startDate 必填')
  if (!isNonEmptyString(body.nextPayment)) throw new ValidationError('nextPayment 必填')
}

export function sanitizeSubscriptionUpdate(body: Record<string, unknown>) {
  const updates = pick(body, SUBSCRIPTION_UPDATABLE_FIELDS)

  if ('amount' in updates && !isFiniteNonNegativeNumber(updates.amount))
    throw new ValidationError('amount 必須是非負數字')
  if ('currency' in updates && !CURRENCIES.includes(updates.currency as (typeof CURRENCIES)[number]))
    throw new ValidationError('currency 必須是 TWD 或 USD')
  if ('cycle' in updates && !CYCLES.includes(updates.cycle as (typeof CYCLES)[number]))
    throw new ValidationError('cycle 必須是 Monthly 或 Yearly')
  if ('renewal' in updates && !RENEWALS.includes(updates.renewal as (typeof RENEWALS)[number]))
    throw new ValidationError('renewal 必須是 Automatic 或 Manual')

  return updates
}

const EXPENSE_UPDATABLE_FIELDS = [
  'title',
  'description',
  'amount',
  'category',
  'date',
  'paymentMethod',
  'tags',
  'receipt',
  'subscriptionId',
] as const

export function validateNewExpense(body: Record<string, unknown>) {
  if (!isNonEmptyString(body.title)) throw new ValidationError('title 必填')
  if (!isFiniteNonNegativeNumber(body.amount)) throw new ValidationError('amount 必須是非負數字')
  if (!isNonEmptyString(body.category)) throw new ValidationError('category 必填')
  if (!isNonEmptyString(body.date)) throw new ValidationError('date 必填')
  if (!isNonEmptyString(body.paymentMethod)) throw new ValidationError('paymentMethod 必填')
}

export function sanitizeExpenseUpdate(body: Record<string, unknown>) {
  const updates = pick(body, EXPENSE_UPDATABLE_FIELDS)

  if ('amount' in updates && !isFiniteNonNegativeNumber(updates.amount))
    throw new ValidationError('amount 必須是非負數字')

  return updates
}
