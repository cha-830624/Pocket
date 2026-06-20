/**
 * 가계부(Transactions) Supabase 서비스
 * - 수입(income), 고정지출(fixed), 변동지출(variable) 관리
 */
import { supabase } from '../lib/supabase'

/**
 * 모든 거래 내역 조회
 * @param {string} type - 거래 유형 ('income' | 'fixed' | 'variable' | null)
 * @param {string} yearMonth - 년월 필터 (예: '2025-12')
 * @param {string} dateFrom - 시작일 필터 (yearMonth 미지정 시 사용, YYYY-MM-DD)
 */
export const getTransactions = async (type = null, yearMonth = null, dateFrom = null) => {
  try {
    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: true })

    if (type) {
      query = query.eq('type', type)
    }

    if (yearMonth) {
      const startDate = `${yearMonth}-01`
      const [year, month] = yearMonth.split('-').map(Number)
      const lastDay = new Date(year, month, 0).getDate()
      const endDate = `${yearMonth}-${String(lastDay).padStart(2, '0')}`

      query = query.gte('date', startDate).lte('date', endDate)
    } else if (dateFrom) {
      query = query.gte('date', dateFrom)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('거래 내역 조회 실패:', error)
    return { data: null, error }
  }
}

/**
 * 수입 내역 조회
 */
export const getIncome = async (yearMonth = null) => {
  return getTransactions('income', yearMonth)
}

/**
 * 고정 지출 내역 조회
 */
export const getFixedExpenses = async (yearMonth = null) => {
  return getTransactions('fixed', yearMonth)
}

/**
 * 변동 지출 내역 조회
 */
export const getVariableExpenses = async (yearMonth = null) => {
  return getTransactions('variable', yearMonth)
}

/**
 * 거래 내역 추가
 * @param {Object} transaction - 거래 정보
 */
export const addTransaction = async (transaction) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        type: transaction.type,
        name: transaction.name,
        amount: transaction.amount,
        date: transaction.date,
        is_completed: transaction.is_completed || false,
        check_state: transaction.check_state ?? 0, // 0:없음 1:이체완료 2:결제완료
        memo: transaction.memo || ''
      }])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('거래 내역 추가 실패:', error)
    return { data: null, error }
  }
}

/**
 * 거래 내역 수정
 * @param {string} id - 거래 ID
 * @param {Object} updates - 수정할 정보
 */
export const updateTransaction = async (id, updates) => {
  try {
    // 수정할 필드만 담는다. check_state는 전달된 경우에만 갱신(미전달 시 기존 값 유지)
    const payload = {
      name: updates.name,
      amount: updates.amount,
      date: updates.date,
      is_completed: updates.is_completed,
      memo: updates.memo
    }
    if (updates.check_state !== undefined) payload.check_state = updates.check_state

    const { data, error } = await supabase
      .from('transactions')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('거래 내역 수정 실패:', error)
    return { data: null, error }
  }
}

/**
 * 완료 상태 토글
 * @param {string} id - 거래 ID
 * @param {boolean} isCompleted - 완료 상태
 */
export const toggleCompleted = async (id, isCompleted) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ is_completed: isCompleted })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('완료 상태 변경 실패:', error)
    return { data: null, error }
  }
}

/**
 * 지출 체크 상태 변경 (3단계: 0=없음, 1=이체완료, 2=결제완료)
 * @param {string} id - 거래 ID
 * @param {number} checkState - 체크 상태 (0/1/2)
 */
export const updateCheckState = async (id, checkState) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ check_state: checkState })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('체크 상태 변경 실패:', error)
    return { data: null, error }
  }
}

/**
 * 거래 내역 삭제
 * @param {string} id - 거래 ID
 */
export const deleteTransaction = async (id) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('거래 내역 삭제 실패:', error)
    return { error }
  }
}

/**
 * 초기 데이터 마이그레이션 (더미 데이터 → Supabase)
 * @param {Array} incomeData - 수입 데이터
 * @param {Array} fixedData - 고정 지출 데이터
 * @param {Array} variableData - 변동 지출 데이터
 */
export const migrateTransactions = async (incomeData, fixedData, variableData) => {
  try {
    // 기존 데이터 확인
    const { data: existing } = await supabase
      .from('transactions')
      .select('id')
      .limit(1)

    if (existing && existing.length > 0) {
      console.log('이미 데이터가 존재합니다. 마이그레이션을 건너뜁니다.')
      return { success: false, message: '이미 데이터가 존재합니다.' }
    }

    // 수입 데이터 변환
    const incomeItems = incomeData.map(item => ({
      type: 'income',
      name: item.name,
      amount: item.amount,
      date: item.date,
      is_completed: item.completed,
      memo: item.memo || ''
    }))

    // 고정 지출 데이터 변환
    const fixedItems = fixedData.map(item => ({
      type: 'fixed',
      name: item.name,
      amount: item.amount,
      date: item.date,
      is_completed: item.completed,
      memo: item.memo || ''
    }))

    // 변동 지출 데이터 변환
    const variableItems = variableData.map(item => ({
      type: 'variable',
      name: item.name,
      amount: item.amount,
      date: item.date,
      is_completed: item.completed,
      memo: item.memo || ''
    }))

    // 전체 데이터 삽입
    const allItems = [...incomeItems, ...fixedItems, ...variableItems]
    
    const { error } = await supabase
      .from('transactions')
      .insert(allItems)

    if (error) throw error
    
    console.log(`마이그레이션 완료: ${allItems.length}건`)
    return { success: true, count: allItems.length }
  } catch (error) {
    console.error('마이그레이션 실패:', error)
    return { success: false, error }
  }
}






