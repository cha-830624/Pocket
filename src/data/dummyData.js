// 실제 가계부 데이터

export const currentMonth = '2025년 12월'

// 가계부 - 수입 (월별 데이터)
export const incomeData = [
  // 2025년 12월
  { id: 1, name: '정훈 월급', amount: 3900000, date: '2025-12-10', completed: true, memo: '' },
  { id: 2, name: '정훈 육아 수당', amount: 1600000, date: '2025-12-10', completed: true, memo: '' },
  { id: 3, name: '하영씨 월급', amount: 3140000, date: '2025-12-17', completed: true, memo: '' },
  // 2026년 1월
  { id: 4, name: '정훈 월급', amount: 0, date: '2026-01-10', completed: false, memo: '' },
  { id: 5, name: '정훈 육아 수당', amount: 0, date: '2026-01-10', completed: false, memo: '' },
  { id: 6, name: '하영씨 월급', amount: 0, date: '2026-01-17', completed: false, memo: '' },
]

// 가계부 - 고정 지출 (월별 데이터)
export const fixedExpenseData = [
  // 2025년 12월
  { id: 1, name: '정훈 용돈', amount: 300000, date: '2025-12-01', completed: true, memo: '식대포함' },
  { id: 2, name: '하영 용돈', amount: 730000, date: '2025-12-01', completed: true, memo: '노조포함, 하영씨 용돈 330,000원, 장모님 : 400,000원' },
  { id: 3, name: '여행통장 입금', amount: 220000, date: '2025-12-01', completed: true, memo: '여행예금 : 100,000원' },
  { id: 4, name: '여행적금', amount: 100000, date: '2025-12-10', completed: true, memo: '' },
  { id: 5, name: '친목회비', amount: 20000, date: '2025-12-10', completed: true, memo: '' },
  { id: 6, name: 'KB 손해보험', amount: 57200, date: '2025-12-20', completed: true, memo: '' },
  { id: 7, name: '현대해상 1', amount: 16140, date: '2025-12-20', completed: true, memo: '' },
  { id: 8, name: '현대해상 2', amount: 32230, date: '2025-12-20', completed: true, memo: '' },
  { id: 9, name: '하나 손해보험', amount: 10000, date: '2025-12-20', completed: true, memo: '' },
  { id: 10, name: '아름이 적금', amount: 200000, date: '2025-12-23', completed: true, memo: '새마을금고' },
  { id: 11, name: '정훈 가족 회비', amount: 70000, date: '2025-12-25', completed: true, memo: '' },
  { id: 12, name: '더샵 대출', amount: 1100000, date: '2025-12-28', completed: true, memo: '농협' },
  { id: 13, name: '하영 가족 회비', amount: 140000, date: '2025-12-30', completed: true, memo: '' },
  // 2026년 1월
  { id: 14, name: '정훈 용돈', amount: 300000, date: '2026-01-01', completed: false, memo: '식대포함' },
  { id: 15, name: '하영 용돈', amount: 730000, date: '2026-01-01', completed: false, memo: '노조포함, 하영씨 용돈 330,000원, 장모님 : 400,000원' },
  { id: 16, name: '여행통장 입금', amount: 220000, date: '2026-01-01', completed: false, memo: '여행예금 : 100,000원' },
  { id: 17, name: '여행적금', amount: 100000, date: '2026-01-10', completed: false, memo: '' },
  { id: 18, name: '친목회비', amount: 20000, date: '2026-01-10', completed: false, memo: '' },
  { id: 19, name: 'KB 손해보험', amount: 57200, date: '2026-01-20', completed: false, memo: '' },
  { id: 20, name: '현대해상 1', amount: 16140, date: '2026-01-20', completed: false, memo: '' },
  { id: 21, name: '현대해상 2', amount: 32230, date: '2026-01-20', completed: false, memo: '' },
  { id: 22, name: '하나 손해보험', amount: 10000, date: '2026-01-20', completed: false, memo: '' },
  { id: 23, name: '아름이 적금', amount: 200000, date: '2026-01-23', completed: false, memo: '새마을금고' },
  { id: 24, name: '정훈 가족 회비', amount: 70000, date: '2026-01-25', completed: false, memo: '' },
  { id: 25, name: '더샵 대출', amount: 1100000, date: '2026-01-28', completed: false, memo: '농협' },
  { id: 26, name: '하영 가족 회비', amount: 140000, date: '2026-01-30', completed: false, memo: '' },
]

// 가계부 - 변동 지출 (월별 데이터)
export const variableExpenseData = [
  // 2025년 12월
  { id: 1, name: '생활비', amount: 1600000, date: '2025-12-01', completed: true, memo: '' },
  { id: 2, name: 'KB카드 출금', amount: 893810, date: '2025-12-02', completed: true, memo: '' },
  { id: 3, name: 'KB카드 출금', amount: 1812722, date: '2025-12-20', completed: true, memo: '' },
  { id: 4, name: '롯데카드 출금', amount: 1428430, date: '2025-12-20', completed: true, memo: '' },
  { id: 5, name: '삼성카드 출금', amount: 712300, date: '2025-12-20', completed: true, memo: '' },
  // 2026년 1월
  { id: 6, name: '생활비', amount: 0, date: '2026-01-01', completed: false, memo: '' },
  { id: 7, name: 'KB카드 출금', amount: 904930, date: '2026-01-02', completed: false, memo: '' },
  { id: 8, name: 'KB카드 출금', amount: 0, date: '2026-01-20', completed: false, memo: '' },
  { id: 9, name: '롯데카드 출금', amount: 0, date: '2026-01-20', completed: false, memo: '' },
  { id: 10, name: '삼성카드 출금', amount: 0, date: '2026-01-20', completed: false, memo: '' },
]

// 자산 관리 - CMA 통장
export const assetData = [
  { id: 1, type: 'deposit', amount: 155000000, date: '2025-12-19', description: '' },
  { id: 2, type: 'withdraw', amount: 500000, date: '2025-12-19', description: '' },
  { id: 3, type: 'deposit', amount: 8360000, date: '2025-12-24', description: '' },
  { id: 4, type: 'withdraw', amount: 200000, date: '2025-12-25', description: '' },
  { id: 5, type: 'withdraw', amount: 2000000, date: '2025-12-26', description: '' },
  { id: 6, type: 'withdraw', amount: 500000, date: '2025-12-27', description: '' },
  { id: 7, type: 'withdraw', amount: 4000000, date: '2025-12-29', description: '' },
  { id: 8, type: 'withdraw', amount: 1665712, date: '2025-12-29', description: '' },
]

// 자산 잔액 추이
export const assetHistory = [
  { month: '12월', balance: 154494288 },
]

// 부채 관리 - 마이너스 통장
export const debtData = [
  { id: 1, type: 'borrow', amount: 8833878, date: '2025-02-01', description: '기존 마이너스 통장 채무' },
  { id: 2, type: 'borrow', amount: 2300000, date: '2025-02-27', description: '' },
  { id: 3, type: 'repay', amount: 5300000, date: '2025-03-21', description: '' },
  { id: 4, type: 'borrow', amount: 1000000, date: '2025-04-02', description: '' },
  { id: 5, type: 'repay', amount: 1700000, date: '2025-05-05', description: '' },
  { id: 6, type: 'repay', amount: 4000000, date: '2025-05-05', description: '' },
  { id: 7, type: 'repay', amount: 1000000, date: '2025-05-05', description: '' },
  { id: 8, type: 'borrow', amount: 3000000, date: '2025-10-15', description: '미경이 빌려줌' },
  { id: 9, type: 'borrow', amount: 1300000, date: '2025-10-16', description: '주식 투자' },
  { id: 10, type: 'borrow', amount: 8000000, date: '2025-10-16', description: '주식 투자' },
  { id: 11, type: 'borrow', amount: 500000, date: '2025-10-17', description: '' },
  { id: 12, type: 'repay', amount: 1000000, date: '2025-10-22', description: '' },
  { id: 13, type: 'repay', amount: 1000000, date: '2025-11-06', description: '' },
  { id: 14, type: 'repay', amount: 1000000, date: '2025-11-17', description: '' },
  { id: 15, type: 'repay', amount: 1300000, date: '2025-11-20', description: '' },
  { id: 16, type: 'borrow', amount: 300000, date: '2025-11-21', description: '' },
  { id: 17, type: 'borrow', amount: 1000000, date: '2025-12-01', description: '' },
  { id: 18, type: 'borrow', amount: 1000000, date: '2025-12-08', description: '' },
  { id: 19, type: 'repay', amount: 6900000, date: '2025-12-17', description: '' },
  { id: 20, type: 'repay', amount: 4500000, date: '2025-12-19', description: 'ISA에 넣을 돈으로 일단 갚음 처리' },
  { id: 21, type: 'borrow', amount: 696072, date: '2025-12-19', description: '중간 이자 체크' },
  { id: 22, type: 'repay', amount: 500000, date: '2025-12-19', description: '' },
  { id: 23, type: 'borrow', amount: 5400000, date: '2025-12-22', description: '' },
  { id: 24, type: 'borrow', amount: 535762, date: '2025-12-29', description: '중간 이자 체크' },
  { id: 25, type: 'repay', amount: 5665712, date: '2025-12-29', description: 'ISA에 넣을 돈으로 일단 갚음 처리' },
]

// 주식 - 국장 (한국)
export const koreanStocks = [
  // 나무증권
  { 
    id: 1, 
    name: 'KODEX 200', 
    code: '069500', 
    market: 'KR',
    broker: 'namu',
    quantity: 273, 
    avgPrice: 55147, 
    currentPrice: 59110,
    currency: 'KRW',
    memo: '매도 1순위 (2026년 말)'
  },
  { 
    id: 2, 
    name: 'TIGER 미국S&P500', 
    code: '360750', 
    market: 'KR',
    broker: 'namu',
    quantity: 849, 
    avgPrice: 24296, 
    currentPrice: 24905,
    currency: 'KRW',
    memo: '매도 2순위 (ISA로 이동)'
  },
  { 
    id: 3, 
    name: 'KODEX 미국나스닥100', 
    code: '379810', 
    market: 'KR',
    broker: 'namu',
    quantity: 391, 
    avgPrice: 25099, 
    currentPrice: 24605,
    currency: 'KRW',
    memo: '매도 3순위 (2029년 예상)'
  },
  { 
    id: 4, 
    name: 'TIGER 미국테크TOP10', 
    code: '381170', 
    market: 'KR',
    broker: 'namu',
    quantity: 460, 
    avgPrice: 31444, 
    currentPrice: 31430,
    currency: 'KRW',
    memo: '최후 보존 (핵심 성장 동력)'
  },
  // ISA
  { 
    id: 5, 
    name: 'TIGER 미국배당다우존스', 
    code: '458730', 
    market: 'KR',
    broker: 'isa',
    quantity: 1586, 
    avgPrice: 12635, 
    currentPrice: 12810,
    currency: 'KRW',
    memo: '현재 비중 100%'
  },
  // 토스
  { 
    id: 6, 
    name: '펄어비스', 
    code: '263750', 
    market: 'KR',
    broker: 'toss',
    quantity: 10, 
    avgPrice: 31667, 
    currentPrice: 37050,
    currency: 'KRW',
    memo: '신작 기대감 반영'
  },
]

// 주식 - 미장 (미국)
export const usStocks = [
  // 나무증권
  { 
    id: 7, 
    name: '테슬라', 
    code: 'TSLA', 
    market: 'US',
    broker: 'namu',
    quantity: 13, 
    avgPrice: 435.00, 
    currentPrice: 485.00,
    currency: 'USD',
    memo: '보너스 수익원'
  },
  { 
    id: 8, 
    name: '아이렌', 
    code: 'IREN', 
    market: 'US',
    broker: 'namu',
    quantity: 57, 
    avgPrice: 66.68, 
    currentPrice: 42.00,
    currency: 'USD',
    memo: '아픈 손가락'
  },
  // 토스
  { 
    id: 9, 
    name: '아이렌', 
    code: 'IREN', 
    market: 'US',
    broker: 'toss',
    quantity: 23.09, 
    avgPrice: 49.27, 
    currentPrice: 42.00,
    currency: 'USD',
    memo: '가족계좌보다 나음'
  },
]

// 환율 — formatters.js로 이동, 호환을 위해 re-export
export { exchangeRate } from '../utils/formatters'

// 월별 통계 데이터
// monthlyStats는 Dashboard.jsx에서 실제 데이터 기반으로 동적 계산됨

// 부채 잔액 추이
export const debtHistory = [
  { month: '2월', balance: 11133878 },
  { month: '3월', balance: 5833878 },
  { month: '4월', balance: 6833878 },
  { month: '5월', balance: 133878 },
  { month: '10월', balance: 12933878 },
  { month: '11월', balance: 9633878 },
  { month: '12월', balance: 0 },
]

// 유틸리티 함수들
// 활성 유틸은 src/utils/formatters.js로 이동했습니다.
// 이 파일은 더미 시드 데이터만 보유합니다. 신규 코드는 formatters에서 직접 import 하세요.
// 기존 import 호환을 위해 일부 유틸은 여기서 re-export 합니다.
export {
  formatCurrency,
  formatPercent,
  calculateStockProfit,
  calculateTotalStockValue,
  calculateTotalStockInvestment,
} from '../utils/formatters'

// 더미 데이터 의존 계산 함수 — 마이그레이션 시드 외 사용 안 함
export const calculateTotalIncome = () => incomeData.reduce((sum, item) => sum + item.amount, 0)
export const calculateTotalFixedExpense = () => fixedExpenseData.reduce((sum, item) => sum + item.amount, 0)
export const calculateTotalVariableExpense = () => variableExpenseData.reduce((sum, item) => sum + item.amount, 0)
export const calculateTotalExpense = () => calculateTotalFixedExpense() + calculateTotalVariableExpense()
export const calculateBalance = () => calculateTotalIncome() - calculateTotalExpense()
export const calculateDebtBalance = () => debtData.reduce((b, i) => i.type === 'borrow' ? b + i.amount : b - i.amount, 0)
export const calculateAssetBalance = () => assetData.reduce((b, i) => i.type === 'deposit' ? b + i.amount : b - i.amount, 0)

