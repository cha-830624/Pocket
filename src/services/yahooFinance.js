/**
 * 야후 파이낸스 API 서비스
 * - 국장/미장 주식 현재가 조회
 * - 환율 정보 조회
 * 
 * 로컬 개발: Vite 프록시 사용 (/api/yahoo)
 * 프로덕션: Vercel Functions 사용 (/api/yahoo-finance)
 */

// 환경에 따라 API URL 결정
const isDevelopment = import.meta.env.DEV
const YAHOO_API_BASE = isDevelopment ? '/api/yahoo' : '/api/yahoo-finance'

/**
 * 야후 파이낸스 심볼 변환
 * - 국장: 종목코드.KS (KOSPI) 또는 종목코드.KQ (KOSDAQ)
 * - 미장: 티커 심볼 그대로
 * 
 * 한국 주식은 KOSPI(.KS)와 KOSDAQ(.KQ)을 모두 반환하여
 * 호출 측에서 폴백 처리할 수 있도록 함
 */
export const getYahooSymbol = (stock) => {
  if (stock.market === 'KR') {
    return `${stock.code}.KS` // 기본값은 KOSPI
  }
  // 미국 주식: 티커 그대로
  return stock.code
}

/**
 * 한국 주식의 대체 심볼 반환 (KOSDAQ)
 */
export const getAlternativeSymbol = (stock) => {
  if (stock.market === 'KR') {
    return `${stock.code}.KQ` // KOSDAQ
  }
  return null
}

/**
 * 단일 종목 현재가 조회 (심볼로 직접 조회)
 */
const fetchPriceBySymbol = async (symbol) => {
  try {
    let url
    if (isDevelopment) {
      // 로컬: Vite 프록시
      url = `${YAHOO_API_BASE}/v8/finance/chart/${symbol}?interval=1d&range=1d`
    } else {
      // 프로덕션: Vercel Function
      url = `${YAHOO_API_BASE}?symbol=${encodeURIComponent(symbol)}`
    }
    
    const response = await fetch(url)
    
    if (!response.ok) {
      return { symbol, success: false, error: `HTTP error! status: ${response.status}`, status: response.status }
    }
    
    const data = await response.json()
    
    if (data.chart?.result?.[0]?.meta) {
      const meta = data.chart.result[0].meta
      return {
        symbol,
        currentPrice: meta.regularMarketPrice,
        previousClose: meta.previousClose,
        currency: meta.currency,
        exchangeName: meta.exchangeName,
        regularMarketTime: meta.regularMarketTime,
        success: true
      }
    }
    
    return { symbol, success: false, error: 'No data' }
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error)
    return { symbol, success: false, error: error.message }
  }
}

/**
 * 단일 종목 현재가 조회 (폴백 로직 포함)
 * - 한국 주식: .KS (KOSPI) 먼저 시도, 실패하면 .KQ (KOSDAQ) 재시도
 */
export const fetchStockPrice = async (symbol) => {
  const result = await fetchPriceBySymbol(symbol)
  
  // 성공하거나 한국 주식이 아니면 바로 반환
  if (result.success || !symbol.endsWith('.KS')) {
    return result
  }
  
  // 한국 주식이고 실패한 경우 (404 등), .KQ로 재시도
  if (result.status === 404 || result.error?.includes('404')) {
    const kosdaq = symbol.replace('.KS', '.KQ')
    console.log(`${symbol} 조회 실패, ${kosdaq}로 재시도...`)
    const retryResult = await fetchPriceBySymbol(kosdaq)
    if (retryResult.success) {
      return retryResult
    }
  }
  
  return result
}

/**
 * 여러 종목 현재가 일괄 조회
 */
export const fetchMultipleStockPrices = async (stocks) => {
  const promises = stocks.map(stock => {
    const symbol = getYahooSymbol(stock)
    return fetchStockPrice(symbol).then(result => ({
      ...result,
      stockId: stock.id,
      originalStock: stock
    }))
  })
  
  const results = await Promise.all(promises)
  return results
}

/**
 * 환율 조회 (USD/KRW)
 */
export const fetchExchangeRate = async () => {
  try {
    let url
    if (isDevelopment) {
      // 로컬: Vite 프록시
      const symbol = 'USDKRW=X'
      url = `${YAHOO_API_BASE}/v8/finance/chart/${symbol}?interval=1d&range=1d`
    } else {
      // 프로덕션: Vercel Function (api/yahoo-finance.js)
      url = `${YAHOO_API_BASE}?type=exchange`
    }
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.chart?.result?.[0]?.meta) {
      const meta = data.chart.result[0].meta
      return {
        rate: meta.regularMarketPrice,
        previousClose: meta.previousClose,
        timestamp: new Date().toISOString(),
        success: true
      }
    }
    
    return { success: false, error: 'No data' }
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 모든 주식 데이터 업데이트
 * - 현재가 조회 후 기존 데이터와 병합
 */
export const updateStockPrices = async (koreanStocks, usStocks) => {
  const allStocks = [...koreanStocks, ...usStocks]
  const results = await fetchMultipleStockPrices(allStocks)
  
  // 결과를 stock ID로 매핑
  const priceMap = {}
  results.forEach(result => {
    if (result.success) {
      priceMap[result.stockId] = result.currentPrice
    }
  })
  
  // 기존 데이터에 현재가 업데이트
  const updatedKorean = koreanStocks.map(stock => ({
    ...stock,
    currentPrice: priceMap[stock.id] ?? stock.currentPrice
  }))
  
  const updatedUS = usStocks.map(stock => ({
    ...stock,
    currentPrice: priceMap[stock.id] ?? stock.currentPrice
  }))
  
  return { koreanStocks: updatedKorean, usStocks: updatedUS }
}

/**
 * 차트 기간 설정 매핑
 * - 30M: 30분봉 → 1일 범위, 5분 간격 (약 78개 봉)
 * - 1D: 일봉 → 3개월 범위, 1일 간격 (약 60개 봉)
 * - 1W: 주봉 → 6개월 범위, 1일 간격 (약 120개 봉)
 * - 1M: 월봉 → 2년 범위, 1일 간격 (약 480개 봉)
 */
const CHART_PERIODS = {
  '30M': { interval: '5m', range: '1d' },
  '1D': { interval: '1d', range: '3mo' },
  '1W': { interval: '1d', range: '6mo' },
  '1M': { interval: '1d', range: '2y' }
}

/**
 * 차트 데이터 조회 (심볼로 직접)
 */
const fetchChartBySymbol = async (symbol, period) => {
  const { interval, range } = CHART_PERIODS[period] || CHART_PERIODS['1D']
  
  let url
  if (isDevelopment) {
    // 로컬: Vite 프록시
    url = `${YAHOO_API_BASE}/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`
  } else {
    // 프로덕션: Vercel Function
    url = `${YAHOO_API_BASE}?symbol=${encodeURIComponent(symbol)}&interval=${interval}&range=${range}`
  }
  
  const response = await fetch(url)
  
  if (!response.ok) {
    return { success: false, error: `HTTP error! status: ${response.status}`, status: response.status, data: [] }
  }
  
  const data = await response.json()
  
  if (data.chart?.result?.[0]) {
    const result = data.chart.result[0]
    const timestamps = result.timestamp || []
    const quotes = result.indicators?.quote?.[0] || {}
    
    const { open, high, low, close, volume } = quotes
    
    // 차트 데이터 배열 생성
    const chartData = timestamps.map((timestamp, index) => {
      const date = new Date(timestamp * 1000)
      const dateStr = period === '30M' 
        ? `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
        : `${date.getMonth() + 1}/${date.getDate()}`
      
      const openPrice = open?.[index]
      const closePrice = close?.[index]
      const highPrice = high?.[index]
      const lowPrice = low?.[index]
      const vol = volume?.[index]
      
      // 유효한 데이터만 반환
      if (openPrice == null || closePrice == null) {
        return null
      }
      
      const roundedHigh = Math.round(highPrice * 100) / 100
      const roundedLow = Math.round(lowPrice * 100) / 100
      
      return {
        date: dateStr,
        timestamp,
        open: Math.round(openPrice * 100) / 100,
        high: roundedHigh,
        low: roundedLow,
        close: Math.round(closePrice * 100) / 100,
        candleRange: roundedHigh - roundedLow,
        volume: vol || 0,
        isUp: closePrice >= openPrice
      }
    }).filter(item => item !== null)
    
    // 이동평균선 계산
    for (let i = 0; i < chartData.length; i++) {
      if (i >= 4) {
        const sum5 = chartData.slice(i - 4, i + 1).reduce((acc, d) => acc + d.close, 0)
        chartData[i].ma5 = Math.round(sum5 / 5 * 100) / 100
      }
      if (i >= 19) {
        const sum20 = chartData.slice(i - 19, i + 1).reduce((acc, d) => acc + d.close, 0)
        chartData[i].ma20 = Math.round(sum20 / 20 * 100) / 100
      }
      if (i >= 59) {
        const sum60 = chartData.slice(i - 59, i + 1).reduce((acc, d) => acc + d.close, 0)
        chartData[i].ma60 = Math.round(sum60 / 60 * 100) / 100
      }
      if (i >= 119) {
        const sum120 = chartData.slice(i - 119, i + 1).reduce((acc, d) => acc + d.close, 0)
        chartData[i].ma120 = Math.round(sum120 / 120 * 100) / 100
      }
    }
    
    return {
      success: true,
      data: chartData,
      symbol,
      period
    }
  }
  
  return { success: false, error: 'No chart data', data: [] }
}

/**
 * 차트 데이터 조회 (OHLCV) - 폴백 로직 포함
 * @param {Object} stock - 종목 정보
 * @param {string} period - 기간 ('30M', '1D', '1W', '1M')
 */
export const fetchChartData = async (stock, period = '1D') => {
  try {
    const symbol = getYahooSymbol(stock)
    const result = await fetchChartBySymbol(symbol, period)
    
    // 성공하거나 한국 주식이 아니면 바로 반환
    if (result.success || stock.market !== 'KR') {
      return result
    }
    
    // 한국 주식이고 실패한 경우, .KQ로 재시도
    if (result.status === 404 || result.error?.includes('404')) {
      const kosdaqSymbol = getAlternativeSymbol(stock)
      if (kosdaqSymbol) {
        console.log(`차트: ${symbol} 조회 실패, ${kosdaqSymbol}로 재시도...`)
        const retryResult = await fetchChartBySymbol(kosdaqSymbol, period)
        if (retryResult.success) {
          return retryResult
        }
      }
    }
    
    return result
  } catch (error) {
    console.error(`Error fetching chart for ${stock.name}:`, error)
    return { success: false, error: error.message, data: [] }
  }
}
