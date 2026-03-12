import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, ArrowUpCircle, ArrowDownCircle, X, Edit3, Trash2, Loader2, Database } from 'lucide-react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  assetData as initialAssetData,
  formatCurrency,
} from '../data/dummyData'
import {
  getAssets,
  addAsset,
  updateAsset,
  deleteAsset,
  migrateAssets,
} from '../services/assetService'

function Asset() {
  // 팝업 state
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null) // null이면 추가, 값이 있으면 수정
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: '1',
    type: 'deposit',
    amount: '',
    description: ''
  })
  
  // 데이터 state
  const [dataList, setDataList] = useState([])
  
  // 로딩 state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [useSupabase, setUseSupabase] = useState(true)
  
  // 마이그레이션 중복 실행 방지
  const isMigratingRef = useRef(false)
  const hasLoadedRef = useRef(false)

  // DB 데이터 → 프론트엔드 형식 변환
  const transformData = (item) => ({
    id: item.id,
    type: item.type,
    amount: Number(item.amount),
    date: item.date,
    description: item.description || ''
  })

  // Supabase에서 데이터 로드
  const loadData = useCallback(async () => {
    // 이미 로드 중이면 무시 (React Strict Mode 중복 호출 방지)
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true
    
    setIsLoading(true)
    try {
      const { data, error } = await getAssets()
      
      if (error) {
        console.error('Supabase 로드 실패, 더미 데이터 사용:', error)
        setUseSupabase(false)
        setDataList([...initialAssetData])
        return
      }
      
      if (!data || data.length === 0) {
        // 마이그레이션 중복 실행 방지
        if (isMigratingRef.current) {
          console.log('마이그레이션이 이미 진행 중입니다.')
          return
        }
        isMigratingRef.current = true
        
        // 데이터가 없으면 마이그레이션 실행
        console.log('자산 데이터가 없습니다. 마이그레이션을 실행합니다...')
        const result = await migrateAssets(initialAssetData)
        
        if (result.success) {
          // 마이그레이션 후 다시 로드
          const { data: newData } = await getAssets()
          if (newData) {
            setDataList(newData.map(transformData))
          }
        } else {
          // 마이그레이션 실패 시 더미 데이터 사용
          setUseSupabase(false)
          setDataList([...initialAssetData])
        }
      } else {
        // 데이터 변환 및 설정
        setDataList(data.map(transformData))
      }
    } catch (err) {
      console.error('데이터 로드 오류:', err)
      setUseSupabase(false)
      setDataList([...initialAssetData])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadData()
  }, [loadData])

  // ESC 키로 팝업 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showModal])

  const currentBalance = dataList.reduce((balance, item) => {
    return item.type === 'deposit' ? balance + item.amount : balance - item.amount
  }, 0)
  const totalDeposited = dataList.filter(d => d.type === 'deposit').reduce((sum, d) => sum + d.amount, 0)
  const totalWithdrawn = dataList.filter(d => d.type === 'withdraw').reduce((sum, d) => sum + d.amount, 0)
  const savingsRate = totalDeposited > 0 ? ((currentBalance / totalDeposited) * 100) : 0

  // 거래건별 누적 잔액으로 차트 데이터 생성
  const chartData = [...dataList]
    .sort((a, b) => a.date.localeCompare(b.date))
    .reduce((acc, item) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].balance : 0
      const balance = item.type === 'deposit' ? prev + item.amount : prev - item.amount
      acc.push({ label: item.date.slice(5).replace('-', '/'), balance })
      return acc
    }, [])

  // 추가 팝업 열기
  const openAddModal = () => {
    setEditingItem(null)
    setFormData({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: '1',
      type: 'deposit',
      amount: '',
      description: ''
    })
    setShowModal(true)
  }

  // 수정 팝업 열기
  const openEditModal = (item) => {
    const [year, month, day] = item.date.split('-')
    setEditingItem(item)
    setFormData({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day).toString(),
      type: item.type,
      amount: item.amount.toString(),
      description: item.description
    })
    setShowModal(true)
  }

  // 팝업 닫기
  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  // 저장
  const handleSave = async () => {
    if (!formData.day || !formData.amount) {
      alert('날짜와 금액을 입력해주세요.')
      return
    }

    setIsSaving(true)
    const fullDate = `${formData.year}-${String(formData.month).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`
    const amount = parseInt(formData.amount) || 0
    
    try {
      if (editingItem) {
        // 수정
        if (useSupabase) {
          const { data, error } = await updateAsset(editingItem.id, {
            type: formData.type,
            amount,
            date: fullDate,
            description: formData.description
          })
          
          if (error) throw error
          
          const updatedItem = transformData(data)
          setDataList(dataList.map(item =>
            item.id === editingItem.id ? updatedItem : item
          ))
        } else {
          // 더미 데이터 모드
          setDataList(dataList.map(item =>
            item.id === editingItem.id
              ? { ...item, date: fullDate, type: formData.type, amount, description: formData.description }
              : item
          ))
        }
      } else {
        // 추가
        if (useSupabase) {
          const { data, error } = await addAsset({
            type: formData.type,
            amount,
            date: fullDate,
            description: formData.description
          })
          
          if (error) throw error
          
          const newItem = transformData(data)
          setDataList([...dataList, newItem])
        } else {
          // 더미 데이터 모드
          const newId = Math.max(...dataList.map(i => typeof i.id === 'number' ? i.id : 0), 0) + 1
          const newItem = {
            id: newId,
            type: formData.type,
            amount,
            date: fullDate,
            description: formData.description
          }
          setDataList([...dataList, newItem])
        }
      }
      
      closeModal()
    } catch (err) {
      console.error('저장 실패:', err)
      alert('저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  // 삭제
  const handleDelete = async (item) => {
    const confirmMsg = item.description ? `"${item.description}" 항목을 삭제하시겠습니까?` : '이 항목을 삭제하시겠습니까?'
    if (!window.confirm(confirmMsg)) return
    
    try {
      if (useSupabase) {
        const { error } = await deleteAsset(item.id)
        if (error) throw error
      }
      
      setDataList(dataList.filter(d => d.id !== item.id))
    } catch (err) {
      console.error('삭제 실패:', err)
      alert('삭제에 실패했습니다.')
    }
  }

  const MiniTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '0.7rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ color: '#94A3B8' }}>{label}</div>
          <div style={{ color: '#10B981', fontWeight: '600' }}>{formatCurrency(payload[0].value)}</div>
        </div>
      )
    }
    return null
  }

  // 로딩 중 표시
  if (isLoading) {
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
      {/* 헤더 */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">자산 관리</h1>
          <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            CMA 통장 내역
            {useSupabase ? (
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px', 
                fontSize: '0.65rem', 
                color: 'var(--income)',
                background: 'var(--income-light)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                <Database size={10} />
                DB 연결됨
              </span>
            ) : (
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '4px', 
                fontSize: '0.65rem', 
                color: 'var(--text-muted)',
                background: 'var(--bg-secondary)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                로컬 모드
              </span>
            )}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={12} />
          추가
        </button>
      </div>

      {/* 요약 카드 */}
      <div className="summary-cards">
        <div className="summary-card primary">
          <p className="summary-label">현재 잔액</p>
          <p className="summary-value">{formatCurrency(currentBalance)}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">총 입금</p>
          <p className="summary-value amount income">{formatCurrency(totalDeposited)}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">총 출금</p>
          <p className="summary-value amount expense">{formatCurrency(totalWithdrawn)}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">저축 유지율</p>
          <p className="summary-value" style={{ color: 'var(--income)' }}>{savingsRate.toFixed(1)}%</p>
          <div style={{ marginTop: '6px' }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(savingsRate, 100)}%`, background: 'var(--income)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="content-area">
        {/* 차트 + 요약 */}
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">잔액 추이</h3>
            </div>
            <div className="card-body" style={{ padding: '8px 12px' }}>
              <div className="chart-mini">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="assetGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 9 }} />
                    <Tooltip content={<MiniTooltip />} />
                    <Area type="monotone" dataKey="balance" stroke="#10B981" strokeWidth={1.5} fill="url(#assetGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">요약</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>입금 횟수</span>
                  <span style={{ fontWeight: '600', fontSize: '0.8rem' }}>{dataList.filter(d => d.type === 'deposit').length}회</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>출금 횟수</span>
                  <span style={{ fontWeight: '600', fontSize: '0.8rem' }}>{dataList.filter(d => d.type === 'withdraw').length}회</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>월평균 저축</span>
                  <span style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--income)' }}>{formatCurrency(Math.round(totalDeposited / Math.max(dataList.filter(d => d.type === 'deposit').length, 1)))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>목표 달성률</span>
                  <span style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--accent)' }}>{Math.round(currentBalance / 200000)}% (2천만원)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 거래 내역 - 나머지 공간 */}
        <div className="card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3 className="card-title">거래 내역</h3>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '14%', textAlign: 'center' }}>날짜</th>
                  <th style={{ width: '14%', textAlign: 'center' }}>구분</th>
                  <th style={{ width: '20%', textAlign: 'center' }}>금액</th>
                  <th style={{ width: '34%', textAlign: 'center' }}>내용</th>
                  <th style={{ width: '18%', textAlign: 'center' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {[...dataList].reverse().map((item) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      {item.date.slice(2).replace(/-/g, '/')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '3px',
                        color: item.type === 'deposit' ? 'var(--income)' : 'var(--expense)',
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.type === 'deposit' ? <ArrowDownCircle size={12} /> : <ArrowUpCircle size={12} />}
                        {item.type === 'deposit' ? '입금' : '출금'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`amount ${item.type === 'deposit' ? 'income' : 'expense'}`}>
                        {formatCurrency(item.amount)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.description}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'nowrap' }}>
                        <button
                          onClick={() => openEditModal(item)}
                          className="btn-action btn-edit"
                          title="수정"
                        >
                          <Edit3 size={12} />
                          <span className="btn-text">수정</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="btn-action btn-delete"
                          title="삭제"
                        >
                          <Trash2 size={12} />
                          <span className="btn-text">삭제</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 추가/수정 팝업 모달 */}
      {showModal && (
        <>
          {/* 오버레이 */}
          <div 
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              animation: 'fadeIn 0.2s ease'
            }}
          />
          {/* 모달 */}
          <div className="modal-container">
            {/* 헤더 */}
            <div className="modal-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--income-light)',
              borderRadius: '12px 12px 0 0'
            }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--income)' }}>
                  {editingItem ? '거래 수정' : '거래 추가'}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  CMA 통장 거래 내역
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* 폼 */}
            <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 날짜 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '6px' }}>
                  날짜
                </label>
                <div className="date-select-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-primary)',
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                      <option key={y} value={y}>{y}년</option>
                    ))}
                  </select>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-primary)',
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}월</option>
                    ))}
                  </select>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-primary)',
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}일</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 구분 (라디오 버튼) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '6px' }}>
                  구분
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="type"
                      value="deposit"
                      checked={formData.type === 'deposit'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      style={{ accentColor: 'var(--income)' }}
                    />
                    <span style={{ color: 'var(--income)', fontWeight: '500' }}>입금</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="type"
                      value="withdraw"
                      checked={formData.type === 'withdraw'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      style={{ accentColor: 'var(--expense)' }}
                    />
                    <span style={{ color: 'var(--expense)', fontWeight: '500' }}>출금</span>
                  </label>
                </div>
              </div>

              {/* 금액 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '6px' }}>
                  금액
                </label>
                <input
                  type="text"
                  placeholder="금액을 입력하세요"
                  value={formData.amount ? parseInt(formData.amount).toLocaleString() : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, '').replace(/[^0-9]/g, '')
                    setFormData({ ...formData, amount: value })
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)'
                  }}
                />
                <div className="amount-buttons" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: String((parseInt(formData.amount) || 0) + 10000) })}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-primary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      color: 'var(--text-primary)'
                    }}
                  >
                    +1만원
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: String((parseInt(formData.amount) || 0) + 100000) })}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-primary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      color: 'var(--text-primary)'
                    }}
                  >
                    +10만원
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: String((parseInt(formData.amount) || 0) + 1000000) })}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-primary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      color: 'var(--text-primary)'
                    }}
                  >
                    +100만원
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: '' })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--expense)',
                      background: 'transparent',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      color: 'var(--expense)'
                    }}
                  >
                    초기화
                  </button>
                </div>
              </div>

              {/* 내용 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', marginBottom: '6px' }}>
                  내용
                </label>
                <input
                  type="text"
                  placeholder="내용을 입력하세요"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
            
            {/* 하단 버튼 */}
            <div className="modal-footer" style={{ 
              padding: '16px 20px', 
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '10px'
            }}>
              <button
                onClick={closeModal}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '12px' }}
              >
                닫기
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px' }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> 저장 중...</>
                ) : '저장'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Asset
