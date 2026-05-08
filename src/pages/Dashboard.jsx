import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { TrendingUp, TrendingDown, ArrowRight, Wallet, BarChart3, RefreshCw, Loader2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {
  formatCurrency,
  formatPercent,
  exchangeRate as initialExchangeRate,
  calculateTotalStockValue,
  calculateTotalStockInvestment,
} from '../data/dummyData'
import { fetchMultipleStockPrices, fetchExchangeRate } from '../services/yahooFinance'
import { getTransactions } from '../services/transactionService'
import { getAssets } from '../services/assetService'
import { getDebts } from '../services/debtService'
import { getStocks } from '../services/stockService'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

function Dashboard() {
  // 기간 선택: 'all', '2024', '2025' 등
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  
  // Supabase 데이터 상태
  const [transactions, setTransactions] = useState([])
  const [assets, setAssets] = useState([])
  const [debts, setDebts] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  
  // 실시간 주식 데이터 상태
  const [koreanStocks, setKoreanStocks] = useState([])
  const [usStocks, setUsStocks] = useState([])
  const [exchangeRate, setExchangeRate] = useState(initialExchangeRate)
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Supabase에서 모든 데이터 로드 (가계부는 최근 2년치만 — 누적 부담 완화)
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoadingData(true)
      try {
        const twoYearsAgo = new Date()
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
        const dateFrom = twoYearsAgo.toISOString().slice(0, 10)

        const [txResult, assetResult, debtResult, stockResult] = await Promise.all([
          getTransactions(null, null, dateFrom),
          getAssets(),
          getDebts(),
          getStocks()
        ])

        if (txResult.data) setTransactions(txResult.data)
        if (assetResult.data) setAssets(assetResult.data)
        if (debtResult.data) setDebts(debtResult.data)
        
        if (stockResult.data) {
          setKoreanStocks(stockResult.data.filter(s => s.market === 'KR'))
          setUsStocks(stockResult.data.filter(s => s.market === 'US'))
        }
      } catch (error) {
        console.error('대시보드 데이터 로드 실패:', error)
      } finally {
        setIsLoadingData(false)
      }
    }
    loadAllData()
  }, [])

  // 최신 종목 목록을 ref에 보관 (인터벌이 stale closure에 갇히지 않도록)
  const stocksRef = useRef({ kr: [], us: [] })
  useEffect(() => {
    stocksRef.current = { kr: koreanStocks, us: usStocks }
  }, [koreanStocks, usStocks])

  // 실시간 가격 조회 (의존성 없이 ref에서 최신값 읽음)
  const refreshPrices = useCallback(async () => {
    const allStocksToFetch = [...stocksRef.current.kr, ...stocksRef.current.us]
    if (allStocksToFetch.length === 0) return

    setIsLoadingPrices(true)
    try {
      const [priceResults, rateResult] = await Promise.all([
        fetchMultipleStockPrices(allStocksToFetch),
        fetchExchangeRate()
      ])

      const priceMap = {}
      priceResults.forEach(result => {
        if (result.success) {
          priceMap[result.stockId] = result.currentPrice
        }
      })

      setKoreanStocks(prev => prev.map(stock => ({
        ...stock,
        currentPrice: priceMap[stock.id] ?? stock.currentPrice
      })))

      setUsStocks(prev => prev.map(stock => ({
        ...stock,
        currentPrice: priceMap[stock.id] ?? stock.currentPrice
      })))

      if (rateResult.success) {
        setExchangeRate({
          USDKRW: rateResult.rate,
          lastUpdated: new Date().toLocaleString('ko-KR')
        })
      }

      setLastUpdated(new Date().toLocaleTimeString('ko-KR'))
    } catch (error) {
      console.error('가격 조회 실패:', error)
    } finally {
      setIsLoadingPrices(false)
    }
  }, [])

  // 주식 데이터 로드 완료 후 가격 조회 + 1분마다 자동 갱신
  useEffect(() => {
    if (isLoadingData) return
    if (koreanStocks.length === 0 && usStocks.length === 0) return

    refreshPrices()
    const intervalId = setInterval(refreshPrices, 60000)
    return () => clearInterval(intervalId)
  }, [isLoadingData, koreanStocks.length, usStocks.length, refreshPrices])

  // 트랜잭션을 유형별로 분리
  const incomeData = useMemo(() => transactions.filter(t => t.type === 'income'), [transactions])
  const fixedExpenseData = useMemo(() => transactions.filter(t => t.type === 'fixed'), [transactions])
  const variableExpenseData = useMemo(() => transactions.filter(t => t.type === 'variable'), [transactions])

  // 사용 가능한 연도 목록 (데이터에서 추출)
  const allDates = [
    ...incomeData.map(d => d.date),
    ...fixedExpenseData.map(d => d.date),
    ...variableExpenseData.map(d => d.date),
    ...debts.map(d => d.date)
  ]
  const years = [...new Set(allDates.map(date => date?.slice(0, 4)))].filter(Boolean).sort().reverse()

  // 월별 통계 동적 계산 (selectedPeriod 반영)
  const monthlyStats = useMemo(() => {
    const matchPeriod = (item) =>
      selectedPeriod === 'all' || (item.date && item.date.startsWith(selectedPeriod))

    const monthMap = {}

    incomeData.filter(matchPeriod).forEach(item => {
      const yearMonth = item.date.slice(0, 7)
      if (!monthMap[yearMonth]) monthMap[yearMonth] = { income: 0, expense: 0 }
      monthMap[yearMonth].income += Number(item.amount)
    })

    ;[...fixedExpenseData, ...variableExpenseData].filter(matchPeriod).forEach(item => {
      const yearMonth = item.date.slice(0, 7)
      if (!monthMap[yearMonth]) monthMap[yearMonth] = { income: 0, expense: 0 }
      monthMap[yearMonth].expense += Number(item.amount)
    })

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([yearMonth, data]) => {
        const [year, month] = yearMonth.split('-')
        return {
          month: `${year.slice(2)}.${month}`,
          income: data.income,
          expense: data.expense,
          balance: data.income - data.expense
        }
      })
  }, [incomeData, fixedExpenseData, variableExpenseData, selectedPeriod])

  // 데이터 필터링 함수
  const filterByPeriod = (data) => {
    if (selectedPeriod === 'all') return data
    return data.filter(item => item.date && item.date.startsWith(selectedPeriod))
  }

  // ==================== 기본 재무 (수입/지출) ====================
  const filteredIncome = filterByPeriod(incomeData)
  const filteredFixedExpense = filterByPeriod(fixedExpenseData)
  const filteredVariableExpense = filterByPeriod(variableExpenseData)
  const filteredDebt = filterByPeriod(debts)
  const filteredAsset = filterByPeriod(assets)

  const totalIncome = filteredIncome.reduce((sum, item) => sum + Number(item.amount), 0)
  const totalFixedExpense = filteredFixedExpense.reduce((sum, item) => sum + Number(item.amount), 0)
  const totalVariableExpense = filteredVariableExpense.reduce((sum, item) => sum + Number(item.amount), 0)
  const totalExpense = totalFixedExpense + totalVariableExpense
  
  // 현금 잔액: 자산 데이터에서 계산 (입금 - 출금)
  const totalDeposit = filteredAsset.filter(a => a.type === 'deposit').reduce((sum, a) => sum + Number(a.amount), 0)
  const totalWithdraw = filteredAsset.filter(a => a.type === 'withdraw').reduce((sum, a) => sum + Number(a.amount), 0)
  const cashBalance = totalDeposit - totalWithdraw

  // 부채 계산
  const totalBorrowed = filteredDebt.filter(d => d.type === 'borrow').reduce((sum, d) => sum + Number(d.amount), 0)
  const totalRepaid = filteredDebt.filter(d => d.type === 'repay').reduce((sum, d) => sum + Number(d.amount), 0)
  const debtBalance = totalBorrowed - totalRepaid
  const repaymentRate = totalBorrowed > 0 ? (totalRepaid / totalBorrowed) * 100 : 0

  // 최근 지출 (체크된 항목 중 최근 확인순)
  const recentExpenses = [...filteredFixedExpense, ...filteredVariableExpense]
    .filter(item => item.is_completed)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 4)

  // 최근 부채 거래
  const recentDebt = [...filteredDebt]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  // ==================== 주식 재무 ====================
  const allStocks = [...koreanStocks, ...usStocks]
  const totalStockValue = calculateTotalStockValue(allStocks, exchangeRate.USDKRW)
  const totalStockInvestment = calculateTotalStockInvestment(allStocks, exchangeRate.USDKRW)
  const stockProfit = totalStockValue - totalStockInvestment
  const stockProfitRate = totalStockInvestment > 0 ? (stockProfit / totalStockInvestment) * 100 : 0

  // 수익/손실 종목 분류
  const profitStocks = allStocks.filter(s => s.currentPrice >= s.avgPrice)
  const lossStocks = allStocks.filter(s => s.currentPrice < s.avgPrice)

  // ==================== 총 자산 ====================
  const netWorth = cashBalance + totalStockValue - debtBalance

  const MiniTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '0.7rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <span style={{ color: payload[0].color, fontWeight: '600' }}>
            {formatCurrency(payload[0].value)}
          </span>
        </div>
      )
    }
    return null
  }

  // 기간 표시 텍스트
  const periodLabel = selectedPeriod === 'all' ? '전체' : `${selectedPeriod}년`

  if (isLoadingData) {
    return (
      <div className="fade-in page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
          <p>데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in page-container">
      {/* 헤더 + 기간 선택 탭 */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">대시보드</h1>
          <p className="page-subtitle">재무 현황 요약</p>
        </div>
        <div className="tabs" style={{ transform: 'scale(0.9)', transformOrigin: 'right center' }}>
          <button
            className={`tab ${selectedPeriod === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('all')}
          >
            전체
          </button>
          {years.map(year => (
            <button
              key={year}
              className={`tab ${selectedPeriod === year ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== 기본 재무 섹션 ==================== */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '10px',
          paddingLeft: '4px'
        }}>
          <Wallet size={16} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            기본 재무
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            ({periodLabel} 수입/지출)
          </span>
        </div>
        
        <div className="summary-cards" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <div className="summary-card primary">
            <p className="summary-label">{selectedPeriod === 'all' ? '현금 잔액' : '기간 순현금흐름'}</p>
            <p className="summary-value">{formatCurrency(cashBalance)}</p>
            <div className={`summary-change ${cashBalance >= 0 ? 'positive' : 'negative'}`}>
              {cashBalance >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              <span>{cashBalance >= 0 ? '흑자' : '적자'}</span>
            </div>
          </div>
          <div className="summary-card">
            <p className="summary-label">수입</p>
            <p className="summary-value amount income">{formatCurrency(totalIncome)}</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {filteredIncome.length}건
            </p>
          </div>
          <div className="summary-card">
            <p className="summary-label">지출</p>
            <p className="summary-value amount expense">{formatCurrency(totalExpense)}</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              고정 {formatCurrency(totalFixedExpense)}
            </p>
          </div>
          <div className="summary-card">
            <p className="summary-label">{selectedPeriod === 'all' ? '부채 잔액' : '기간 순부채 변동'}</p>
            <p className="summary-value amount expense">{formatCurrency(Math.abs(debtBalance))}</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              상환률 {repaymentRate.toFixed(0)}%
            </p>
          </div>
          <div className="summary-card">
            <p className="summary-label">저축률</p>
            <p className="summary-value" style={{ color: 'var(--accent)' }}>
              {totalIncome > 0 ? ((cashBalance / totalIncome) * 100).toFixed(1) : 0}%
            </p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              수입 대비
            </p>
          </div>
        </div>
      </div>

      {/* ==================== 주식 재무 섹션 ==================== */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '10px',
          paddingLeft: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              투자 자산
            </h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              (실시간)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {lastUpdated && (
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {lastUpdated} 기준
              </span>
            )}
            <button
              onClick={refreshPrices}
              disabled={isLoadingPrices}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: isLoadingPrices ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                opacity: isLoadingPrices ? 0.6 : 1,
              }}
            >
              <RefreshCw size={12} style={{ 
                animation: isLoadingPrices ? 'spin 1s linear infinite' : 'none' 
              }} />
              새로고침
            </button>
          </div>
        </div>
        
        <div className="summary-cards" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <div className="summary-card primary">
            <p className="summary-label">평가 금액</p>
            <p className="summary-value">{formatCurrency(totalStockValue)}</p>
            <div className={`summary-change ${stockProfit >= 0 ? 'positive' : 'negative'}`}>
              {stockProfit >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              <span>{formatPercent(stockProfitRate)}</span>
            </div>
          </div>
          <div className="summary-card">
            <p className="summary-label">투자 원금</p>
            <p className="summary-value">{formatCurrency(totalStockInvestment)}</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {allStocks.length}종목
            </p>
          </div>
          <div className="summary-card">
            <p className="summary-label">평가 손익</p>
            <p className={`summary-value amount ${stockProfit >= 0 ? 'profit' : 'loss'}`}>
              {stockProfit >= 0 ? '+' : ''}{formatCurrency(stockProfit)}
            </p>
          </div>
          <div className="summary-card">
            <p className="summary-label">수익 종목</p>
            <p className="summary-value amount profit">{profitStocks.length}개</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              손실 {lossStocks.length}개
            </p>
          </div>
          <div className="summary-card">
            <p className="summary-label">순자산</p>
            <p className="summary-value" style={{ color: 'var(--accent)', fontWeight: '700' }}>
              {formatCurrency(netWorth)}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              현금+주식-부채
            </p>
          </div>
        </div>
      </div>

      {/* ==================== 상세 콘텐츠 ==================== */}
      <div className="content-area" style={{ flex: 1 }}>
        {/* 상단: 차트 + 지출 */}
        <div className="grid-2" style={{ flex: 1, minHeight: 0 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <h3 className="card-title">수입/지출 추이</h3>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.65rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
                  수입
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F43F5E' }}></span>
                  지출
                </span>
              </div>
            </div>
            <div className="card-body" style={{ padding: '8px 12px', flex: 1 }}>
              <div style={{ height: '100%', minHeight: '80px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyStats}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
                    <Tooltip content={<MiniTooltip />} />
                    <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={1.5} fill="url(#incomeGrad)" />
                    <Area type="monotone" dataKey="expense" stroke="#F43F5E" strokeWidth={1.5} fill="url(#expenseGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <h3 className="card-title">최근 지출</h3>
              <NavLink to="/budget" className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.7rem' }}>
                전체 <ArrowRight size={10} />
              </NavLink>
            </div>
            <div className="card-body" style={{ padding: 0, flex: 1, overflow: 'auto' }}>
              {recentExpenses.length > 0 ? (
                <table className="data-table">
                  <tbody>
                    {recentExpenses.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="amount expense">-{formatCurrency(item.amount)}</span>
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--text-muted)', width: '60px' }}>
                          {item.date.slice(5).replace('-', '/')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  height: '100%', color: 'var(--text-muted)', fontSize: '0.8rem'
                }}>
                  지출 내역이 없습니다
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단: 부채 + 주식 */}
        <div className="grid-2" style={{ flex: 1, minHeight: 0 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <h3 className="card-title">부채 현황</h3>
              <NavLink to="/debt" className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.7rem' }}>
                전체 <ArrowRight size={10} />
              </NavLink>
            </div>
            <div className="card-body" style={{ flex: 1, overflow: 'auto' }}>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>상환률</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--accent)' }}>{repaymentRate.toFixed(1)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill accent" style={{ width: `${Math.min(repaymentRate, 100)}%` }} />
                </div>
              </div>
              {recentDebt.length > 0 ? (
                <table className="data-table">
                  <tbody>
                    {recentDebt.map((item) => (
                      <tr key={item.id}>
                        <td style={{ color: item.type === 'borrow' ? 'var(--expense)' : 'var(--income)', fontWeight: '500' }}>
                          {item.type === 'borrow' ? '대출' : '상환'}
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{item.description}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`amount ${item.type === 'borrow' ? 'expense' : 'income'}`}>
                            {item.type === 'borrow' ? '+' : '-'}{formatCurrency(item.amount)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  height: '60px', color: 'var(--text-muted)', fontSize: '0.8rem'
                }}>
                  부채 거래가 없습니다
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <h3 className="card-title">주식 포트폴리오</h3>
              <NavLink to="/stock" className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.7rem' }}>
                전체 <ArrowRight size={10} />
              </NavLink>
            </div>
            <div className="card-body" style={{ padding: 0, flex: 1, overflow: 'auto' }}>
              <table className="data-table">
                <tbody>
                  {allStocks.slice(0, 4).map((stock) => {
                    const profit = (stock.currentPrice - stock.avgPrice) * stock.quantity
                    const profitRate = ((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100
                    return (
                      <tr key={stock.id}>
                        <td>
                          <span style={{ marginRight: '6px' }}>{stock.market === 'KR' ? '🇰🇷' : '🇺🇸'}</span>
                          {stock.name}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`amount ${profit >= 0 ? 'profit' : 'loss'}`}>{formatPercent(profitRate)}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`amount ${profit >= 0 ? 'profit' : 'loss'}`}>
                            {profit >= 0 ? '+' : ''}{formatCurrency(profit, stock.currency)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
