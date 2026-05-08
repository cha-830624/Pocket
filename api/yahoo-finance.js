// Vercel Function: 야후 파이낸스 API 프록시
// CORS 문제를 해결하기 위한 서버리스 함수

// 허용 origin 화이트리스트 (production + 프리뷰 + localhost)
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/pocket-silk\.vercel\.app$/,
  /^https:\/\/pocket-[a-z0-9-]+-cha-projects\.vercel\.app$/,
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
]

// 야후 심볼 형식 검증 (영숫자, 점, 하이픈, 등호, 캐럿 — 약 15자 이내)
const SYMBOL_PATTERN = /^[A-Za-z0-9.\-=^]{1,15}$/
const ALLOWED_INTERVALS = new Set(['1m', '5m', '15m', '30m', '1h', '1d', '1wk', '1mo'])
const ALLOWED_RANGES = new Set(['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'max'])

export default async function handler(req, res) {
  // CORS 헤더 — 허용된 origin만 통과
  const origin = req.headers.origin || ''
  const isAllowed = ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin))
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Content-Type', 'application/json')

  // OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { symbol, type, interval, range } = req.query

    // 환율 모드는 symbol 불필요 — 그 외에는 symbol 형식 엄격 검증
    if (type !== 'exchange') {
      if (!symbol || typeof symbol !== 'string' || !SYMBOL_PATTERN.test(symbol)) {
        return res.status(400).json({ error: 'Invalid symbol' })
      }
    }

    // interval/range 화이트리스트 검증 (미지정 시 기본값)
    const chartInterval = interval || '1d'
    const chartRange = range || '1d'
    if (!ALLOWED_INTERVALS.has(chartInterval) || !ALLOWED_RANGES.has(chartRange)) {
      return res.status(400).json({ error: 'Invalid interval or range' })
    }

    // URL 조립 — 검증된 값만 사용 (쿼리스트링은 URLSearchParams로 인코딩)
    const params = new URLSearchParams({ interval: chartInterval, range: chartRange })
    const targetSymbol = type === 'exchange' ? 'USDKRW=X' : symbol
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(targetSymbol)}?${params.toString()}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: `Yahoo API error: ${response.status}` })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Yahoo Finance API error:', error)
    return res.status(500).json({ error: error.message })
  }
}




