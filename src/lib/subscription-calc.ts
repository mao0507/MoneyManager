export type Currency = 'TWD' | 'USD'
export type Cycle = 'Monthly' | 'Yearly'

export function convertCurrency(amount: number, from: Currency, to: Currency, rate: number): number {
  if (from === to) return amount
  if (!(rate > 0)) {
    throw new Error(`convertCurrency: rate must be a positive number, got ${rate}`)
  }
  return amount * rate
}

function toDateOnlyString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function calculateNextPayment(startDate: string, cycle: Cycle): string {
  if (!DATE_ONLY_PATTERN.test(startDate)) {
    throw new Error(`calculateNextPayment: startDate must be in YYYY-MM-DD format, got "${startDate}"`)
  }

  const [year, month, day] = startDate.split('-').map(Number)
  const monthsToAdd = cycle === 'Monthly' ? 1 : 12

  // Clamp to the target month's last day instead of overflowing into the month after
  // (native Date.setUTCMonth would turn Jan 31 + 1 month into Mar 3).
  const targetMonthIndex = (month - 1) + monthsToAdd
  const lastDayOfTargetMonth = new Date(Date.UTC(year, targetMonthIndex + 1, 0)).getUTCDate()
  const clampedDay = Math.min(day, lastDayOfTargetMonth)

  return toDateOnlyString(new Date(Date.UTC(year, targetMonthIndex, clampedDay)))
}

export interface SubscriptionForCalc {
  amount: number
  currency: Currency
  cycle: Cycle
  active: boolean
}

// rate = how many TWD per 1 USD (the standard quote direction).
function convertToDisplayCurrency(
  amount: number,
  from: Currency,
  displayCurrency: Currency,
  twdPerUsd: number,
): number {
  if (from === displayCurrency) return amount
  if (!(twdPerUsd > 0)) {
    throw new Error(`convertToDisplayCurrency: twdPerUsd must be a positive number, got ${twdPerUsd}`)
  }
  return from === 'USD'
    ? convertCurrency(amount, 'USD', 'TWD', twdPerUsd)
    : convertCurrency(amount, 'TWD', 'USD', 1 / twdPerUsd)
}

export function calculateMonthlyEquivalentTotal(
  subscriptions: SubscriptionForCalc[],
  displayCurrency: Currency,
  twdPerUsd: number,
): number {
  return subscriptions
    .filter((sub) => sub.active)
    .reduce((sum, sub) => {
      const converted = convertToDisplayCurrency(sub.amount, sub.currency, displayCurrency, twdPerUsd)
      return sum + (sub.cycle === 'Monthly' ? converted : converted / 12)
    }, 0)
}

export function calculateYearlyEquivalentTotal(
  subscriptions: SubscriptionForCalc[],
  displayCurrency: Currency,
  twdPerUsd: number,
): number {
  return subscriptions
    .filter((sub) => sub.active)
    .reduce((sum, sub) => {
      const converted = convertToDisplayCurrency(sub.amount, sub.currency, displayCurrency, twdPerUsd)
      return sum + (sub.cycle === 'Yearly' ? converted : converted * 12)
    }, 0)
}
