import { describe, expect, it } from 'vitest'
import { toDoughnutChartData, toTrendChartData, toVendorBarChartData } from './chart-data'

const palette = ['red', 'green', 'blue']

describe('toDoughnutChartData', () => {
  it('returns an empty chart structure for an empty input', () => {
    expect(toDoughnutChartData([], palette)).toEqual({
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    })
  })

  it('maps category labels and amounts in order', () => {
    const items = [
      { category: '音樂串流', amount: 1710 },
      { category: '影片串流', amount: 856 },
    ]
    const result = toDoughnutChartData(items, palette)
    expect(result.labels).toEqual(['音樂串流', '影片串流'])
    expect(result.datasets[0].data).toEqual([1710, 856])
  })

  it('cycles the palette when there are more items than colors', () => {
    const items = [
      { category: 'A', amount: 1 },
      { category: 'B', amount: 2 },
      { category: 'C', amount: 3 },
      { category: 'D', amount: 4 },
    ]
    const result = toDoughnutChartData(items, palette)
    expect(result.datasets[0].backgroundColor).toEqual(['red', 'green', 'blue', 'red'])
  })

  it('throws instead of producing undefined colors when the palette is empty', () => {
    expect(() => toDoughnutChartData([{ category: 'A', amount: 1 }], [])).toThrow()
  })
})

describe('toTrendChartData', () => {
  it('returns an empty chart structure for an empty input', () => {
    expect(toTrendChartData([], palette)).toEqual({
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    })
  })

  it('maps month labels and amounts in order, using a single color for every bar', () => {
    const items = [
      { month: '1月', amount: 1200 },
      { month: '2月', amount: 1400 },
    ]
    const result = toTrendChartData(items, palette)
    expect(result.labels).toEqual(['1月', '2月'])
    expect(result.datasets[0].data).toEqual([1200, 1400])
    expect(result.datasets[0].backgroundColor).toEqual(['red', 'red'])
  })

  it('throws instead of using an undefined color when the palette is empty', () => {
    expect(() => toTrendChartData([{ month: '1月', amount: 1 }], [])).toThrow()
  })
})

describe('toVendorBarChartData', () => {
  it('returns an empty chart structure for an empty input', () => {
    expect(toVendorBarChartData([], palette)).toEqual({
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    })
  })

  it('maps vendor labels and amounts in order, cycling the palette', () => {
    const items = [
      { vendor: 'Spotify', amount: 1710 },
      { vendor: 'YouTube', amount: 856 },
      { vendor: 'Monica', amount: 780 },
      { vendor: 'Cursor', amount: 716 },
    ]
    const result = toVendorBarChartData(items, palette)
    expect(result.labels).toEqual(['Spotify', 'YouTube', 'Monica', 'Cursor'])
    expect(result.datasets[0].data).toEqual([1710, 856, 780, 716])
    expect(result.datasets[0].backgroundColor).toEqual(['red', 'green', 'blue', 'red'])
  })

  it('throws instead of producing undefined colors when the palette is empty', () => {
    expect(() => toVendorBarChartData([{ vendor: 'A', amount: 1 }], [])).toThrow()
  })
})
