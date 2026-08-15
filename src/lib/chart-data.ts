export interface CategoryDatum {
  category: string
  amount: number
}

export interface ChartDataset {
  data: number[]
  backgroundColor: string[]
}

export interface ChartData {
  labels: string[]
  datasets: [ChartDataset]
}

function assertNonEmptyPalette(items: unknown[], palette: string[]): void {
  if (items.length > 0 && palette.length === 0) {
    throw new Error('chart-data: palette must not be empty when items is non-empty')
  }
}

export function toDoughnutChartData(items: CategoryDatum[], palette: string[]): ChartData {
  assertNonEmptyPalette(items, palette)
  return {
    labels: items.map((item) => item.category),
    datasets: [
      {
        data: items.map((item) => item.amount),
        backgroundColor: items.map((_, index) => palette[index % palette.length]),
      },
    ],
  }
}

export interface MonthlyDatum {
  month: string
  amount: number
}

export function toTrendChartData(items: MonthlyDatum[], palette: string[]): ChartData {
  assertNonEmptyPalette(items, palette)
  const color = palette[0]
  return {
    labels: items.map((item) => item.month),
    datasets: [
      {
        data: items.map((item) => item.amount),
        backgroundColor: items.map(() => color),
      },
    ],
  }
}

export interface VendorDatum {
  vendor: string
  amount: number
}

export function toVendorBarChartData(items: VendorDatum[], palette: string[]): ChartData {
  assertNonEmptyPalette(items, palette)
  return {
    labels: items.map((item) => item.vendor),
    datasets: [
      {
        data: items.map((item) => item.amount),
        backgroundColor: items.map((_, index) => palette[index % palette.length]),
      },
    ],
  }
}
