/**
 * 공용 포맷터/계산 유틸
 * - 통화/퍼센트 포맷, 주식 손익 계산 등
 * - 더미 데이터와 분리되어 있는 활성 유틸
 */

export const formatCurrency = (amount, currency = 'KRW') => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatPercent = (value) => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export const calculateStockProfit = (stock) => {
  const profit = (stock.currentPrice - stock.avgPrice) * stock.quantity
  const profitRate = ((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100
  return { profit, profitRate }
}

export const calculateTotalStockValue = (stocks, exchangeRate = 1) => {
  return stocks.reduce((total, stock) => {
    const value = stock.currentPrice * stock.quantity
    return total + (stock.currency === 'USD' ? value * exchangeRate : value)
  }, 0)
}

export const calculateTotalStockInvestment = (stocks, exchangeRate = 1) => {
  return stocks.reduce((total, stock) => {
    const value = stock.avgPrice * stock.quantity
    return total + (stock.currency === 'USD' ? value * exchangeRate : value)
  }, 0)
}

// 기본 환율 (Yahoo Finance에서 갱신되기 전 fallback)
export const exchangeRate = {
  USDKRW: 1450,
  lastUpdated: '초기값',
}
