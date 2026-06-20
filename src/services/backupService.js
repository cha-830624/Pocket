/**
 * 데이터 백업/복구 서비스
 * - 모든 테이블 데이터를 JSON으로 내보내기/가져오기
 */
import { supabase } from '../lib/supabase'

/**
 * 모든 데이터 내보내기 (백업)
 * @returns {Object} 백업 데이터
 */
export const exportAllData = async () => {
  try {
    // 가계부 데이터
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: true })
    
    if (transError) throw transError

    // 자산 데이터
    const { data: assets, error: assetError } = await supabase
      .from('assets')
      .select('*')
      .order('date', { ascending: true })
    
    if (assetError) throw assetError

    // 부채 데이터
    const { data: debts, error: debtError } = await supabase
      .from('debts')
      .select('*')
      .order('date', { ascending: true })
    
    if (debtError) throw debtError

    // 주식 데이터
    const { data: stocks, error: stockError } = await supabase
      .from('stocks')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (stockError) throw stockError

    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        transactions: transactions || [],
        assets: assets || [],
        debts: debts || [],
        stocks: stocks || []
      }
    }

    return { data: backupData, error: null }
  } catch (error) {
    console.error('백업 실패:', error)
    return { data: null, error }
  }
}

/**
 * JSON 파일로 다운로드
 * @param {Object} data - 백업 데이터
 */
export const downloadBackup = (data) => {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const today = new Date().toISOString().split('T')[0]
  const filename = `pocket_backup_${today}.json`
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 모든 데이터 가져오기 (복구)
 * @param {Object} backupData - 백업 데이터
 * @param {boolean} clearExisting - 기존 데이터 삭제 여부
 * @returns {Object} 복구 결과
 */
export const importAllData = async (backupData, clearExisting = false) => {
  try {
    // 백업 데이터 검증
    if (!backupData || !backupData.data) {
      throw new Error('유효하지 않은 백업 파일입니다.')
    }

    const { transactions, assets, debts, stocks } = backupData.data
    const result = {
      transactions: 0,
      assets: 0,
      debts: 0,
      stocks: 0
    }

    // 기존 데이터 삭제 (선택적)
    if (clearExisting) {
      await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('assets').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('debts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('stocks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    }

    // 가계부 복구
    if (transactions && transactions.length > 0) {
      const transToInsert = transactions.map(t => ({
        type: t.type,
        name: t.name,
        amount: t.amount,
        date: t.date,
        is_completed: t.is_completed,
        check_state: t.check_state ?? (t.is_completed ? 2 : 0), // 구버전 백업 호환
        memo: t.memo || ''
      }))
      
      const { error } = await supabase.from('transactions').insert(transToInsert)
      if (error) throw error
      result.transactions = transToInsert.length
    }

    // 자산 복구
    if (assets && assets.length > 0) {
      const assetsToInsert = assets.map(a => ({
        type: a.type,
        amount: a.amount,
        date: a.date,
        description: a.description || ''
      }))
      
      const { error } = await supabase.from('assets').insert(assetsToInsert)
      if (error) throw error
      result.assets = assetsToInsert.length
    }

    // 부채 복구
    if (debts && debts.length > 0) {
      const debtsToInsert = debts.map(d => ({
        type: d.type,
        amount: d.amount,
        date: d.date,
        description: d.description || ''
      }))
      
      const { error } = await supabase.from('debts').insert(debtsToInsert)
      if (error) throw error
      result.debts = debtsToInsert.length
    }

    // 주식 복구
    if (stocks && stocks.length > 0) {
      const stocksToInsert = stocks.map(s => ({
        market: s.market,
        broker: s.broker,
        name: s.name,
        code: s.code,
        quantity: s.quantity,
        avg_price: s.avg_price,
        currency: s.currency,
        memo: s.memo || '',
        sort_order: s.sort_order ?? null
      }))
      
      const { error } = await supabase.from('stocks').insert(stocksToInsert)
      if (error) throw error
      result.stocks = stocksToInsert.length
    }

    return { 
      success: true, 
      result,
      message: `복구 완료: 가계부 ${result.transactions}건, 자산 ${result.assets}건, 부채 ${result.debts}건, 주식 ${result.stocks}건`
    }
  } catch (error) {
    console.error('복구 실패:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 파일 읽기
 * @param {File} file - 업로드된 파일
 * @returns {Promise<Object>} 파싱된 JSON 데이터
 */
export const readBackupFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch (error) {
        reject(new Error('JSON 파일을 파싱할 수 없습니다.'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('파일을 읽을 수 없습니다.'))
    }
    
    reader.readAsText(file)
  })
}

/**
 * 데이터 통계 조회
 * @returns {Object} 각 테이블의 레코드 수
 */
export const getDataStats = async () => {
  try {
    const [trans, assets, debts, stocks] = await Promise.all([
      supabase.from('transactions').select('id', { count: 'exact', head: true }),
      supabase.from('assets').select('id', { count: 'exact', head: true }),
      supabase.from('debts').select('id', { count: 'exact', head: true }),
      supabase.from('stocks').select('id', { count: 'exact', head: true })
    ])

    return {
      transactions: trans.count || 0,
      assets: assets.count || 0,
      debts: debts.count || 0,
      stocks: stocks.count || 0,
      total: (trans.count || 0) + (assets.count || 0) + (debts.count || 0) + (stocks.count || 0)
    }
  } catch (error) {
    console.error('통계 조회 실패:', error)
    return { transactions: 0, assets: 0, debts: 0, stocks: 0, total: 0 }
  }
}




