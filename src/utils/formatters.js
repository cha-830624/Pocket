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

/**
 * 잔액 추이 차트용 보간:
 * 마지막 거래일 이후 변동이 없어도, 매주 "일요일"과 "오늘"에 동일 잔액 포인트를 채워
 * 차트 선이 오늘까지 이어지게 한다. (채워 넣은 포인트는 isFilled: true 로 표시 → 점 숨김 등에 사용)
 * DB에는 저장하지 않고, 차트 렌더링 시 거래 내역으로부터 계산만 한다.
 *
 * @param {Array<{fullDate:string,date:string,balance:number,isFilled:boolean}>} points
 *        거래 누적 포인트 배열(날짜 오름차순). fullDate는 'YYYY-MM-DD'.
 * @param {Date} [now] 기준 현재 시각(기본: 오늘). 테스트 시 주입 가능.
 * @returns {Array} 보간 포인트가 뒤에 추가된 배열
 */
export const appendWeeklyPoints = (points, now = new Date()) => {
  if (!points || points.length === 0) return points || []

  // 'YYYY-MM-DD' → 로컬 자정 Date
  const toDate = (ymd) => {
    const [y, m, d] = ymd.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  // Date + 잔액 → 보간 차트 포인트
  const stamp = (date, balance) => {
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return {
      fullDate: `${date.getFullYear()}-${m}-${d}`,
      date: `${m}/${d}`,
      balance,
      isFilled: true,
    }
  }
  // 주어진 날짜 "이후"의 첫 일요일 (그 날이 일요일이면 다음 주 일요일)
  const nextSunday = (date) => {
    const c = new Date(date)
    const offset = (7 - c.getDay()) % 7 // 일요일 getDay()===0
    c.setDate(c.getDate() + (offset === 0 ? 7 : offset))
    return c
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const result = []

  // 각 거래 포인트와 "다음 경계"(다음 거래일, 마지막은 오늘) 사이의 일요일을 직전 잔액으로 채운다
  for (let i = 0; i < points.length; i++) {
    const cur = points[i]
    result.push(cur)

    const boundary = i < points.length - 1 ? toDate(points[i + 1].fullDate) : today
    const cursor = nextSunday(toDate(cur.fullDate))
    while (cursor < boundary) {
      result.push(stamp(cursor, cur.balance))
      cursor.setDate(cursor.getDate() + 7)
    }
  }

  // 마지막 일요일 이후 오늘까지도 선이 닿도록 오늘 포인트 추가(중복 방지)
  const last = points[points.length - 1]
  if (today > toDate(last.fullDate)) {
    const todayStamp = stamp(today, last.balance)
    if (result[result.length - 1].fullDate !== todayStamp.fullDate) {
      result.push(todayStamp)
    }
  }

  return result
}
