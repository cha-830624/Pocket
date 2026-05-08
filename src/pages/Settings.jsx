import { useState, useRef, useEffect } from 'react'
import { User, Lock, Database, Info, ExternalLink, Moon, Sun, DollarSign, Target, Home, LogOut, Download, Upload, AlertCircle, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../data/dummyData'
import { exportAllData, downloadBackup, importAllData, readBackupFile, getDataStats } from '../services/backupService'

function Settings() {
  const { settings, updateSetting, toggleDarkMode } = useSettings()
  const { user, signOut, updatePassword } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  // 백업/복구 상태
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [backupMessage, setBackupMessage] = useState(null)
  const [dataStats, setDataStats] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingBackupData, setPendingBackupData] = useState(null)
  
  // 데이터 통계 로드
  useEffect(() => {
    const loadStats = async () => {
      const stats = await getDataStats()
      setDataStats(stats)
    }
    loadStats()
  }, [])
  
  // 백업 (내보내기)
  const handleExport = async () => {
    setIsExporting(true)
    setBackupMessage(null)
    
    try {
      const { data, error } = await exportAllData()
      if (error) throw error
      
      downloadBackup(data)
      setBackupMessage({ type: 'success', text: '백업 파일이 다운로드되었습니다.' })
    } catch (error) {
      setBackupMessage({ type: 'error', text: '백업 실패: ' + error.message })
    } finally {
      setIsExporting(false)
    }
  }
  
  // 복구 (가져오기) - 파일 선택
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }
  
  // 파일 선택 후 처리
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const backupData = await readBackupFile(file)
      setPendingBackupData(backupData)
      setShowConfirmModal(true)
    } catch (error) {
      setBackupMessage({ type: 'error', text: error.message })
    }
    
    // 파일 입력 초기화
    e.target.value = ''
  }
  
  // 복구 확인
  const handleConfirmImport = async (clearExisting) => {
    setShowConfirmModal(false)
    setIsImporting(true)
    setBackupMessage(null)
    
    try {
      const result = await importAllData(pendingBackupData, clearExisting)
      if (result.success) {
        setBackupMessage({ type: 'success', text: result.message })
        // 통계 새로고침
        const stats = await getDataStats()
        setDataStats(stats)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setBackupMessage({ type: 'error', text: '복구 실패: ' + error.message })
    } finally {
      setIsImporting(false)
      setPendingBackupData(null)
    }
  }

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // 사용자 이름 추출 (이메일에서 @ 앞부분)
  const userName = user?.email?.split('@')[0] || '사용자'
  const userEmail = user?.email || 'user@example.com'
  const userInitial = userName.charAt(0).toUpperCase()

  // 예산 목표 변경 핸들러
  const handleBudgetChange = (e) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0
    updateSetting('budgetGoal', value)
  }

  // 비밀번호 변경 핸들러 (간단한 prompt 기반 — 8자 이상)
  const handlePasswordChange = async () => {
    const newPassword = window.prompt('새 비밀번호를 입력하세요 (8자 이상):')
    if (!newPassword) return
    if (newPassword.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    const confirm = window.prompt('확인을 위해 새 비밀번호를 다시 입력하세요:')
    if (newPassword !== confirm) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    try {
      await updatePassword(newPassword)
      alert('비밀번호가 변경되었습니다.')
    } catch (err) {
      alert('비밀번호 변경 실패: ' + err.message)
    }
  }

  // 토글 스위치 컴포넌트
  const Toggle = ({ isOn, onToggle }) => (
    <div 
      onClick={onToggle}
      style={{ 
        width: '44px', 
        height: '24px', 
        background: isOn ? 'var(--accent)' : 'var(--border)', 
        borderRadius: '12px',
        position: 'relative', 
        cursor: 'pointer',
        transition: 'background 0.2s ease'
      }}
    >
      <div style={{ 
        width: '20px', 
        height: '20px', 
        background: 'white', 
        borderRadius: '50%',
        position: 'absolute', 
        top: '2px',
        left: isOn ? '22px' : '2px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s ease'
      }} />
    </div>
  )

  return (
    <div className="fade-in page-container">
      <div className="page-header">
        <h1 className="page-title">설정</h1>
        <p className="page-subtitle">앱 설정 관리</p>
      </div>

      <div className="content-area">
        {/* 계정 & 데이터 */}
        <div className="grid-2">
          {/* 계정 */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} style={{ color: 'var(--accent)' }} />
                계정
              </h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '700'
                }}>
                  {userInitial}
                </div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.85rem' }}>{userName}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{userEmail}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handlePasswordChange}>
                  <Lock size={12} />
                  비밀번호 변경
                </button>
                <button 
                  className="btn" 
                  style={{ 
                    flex: 1, 
                    background: 'var(--expense-light)', 
                    color: 'var(--expense)',
                    border: '1px solid var(--expense)'
                  }}
                  onClick={handleLogout}
                >
                  <LogOut size={12} />
                  로그아웃
                </button>
              </div>
            </div>
          </div>

          {/* 데이터 백업/복구 */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={14} style={{ color: 'var(--accent)' }} />
                데이터 백업/복구
              </h3>
            </div>
            <div className="card-body">
              {/* 연결 상태 & 통계 */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem' }}>Supabase 연결</span>
                  <span className="badge completed">연결됨</span>
                </div>
                {dataStats && (
                  <div style={{ 
                    background: 'var(--bg-secondary)', 
                    borderRadius: '8px', 
                    padding: '10px',
                    fontSize: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>총 데이터</span>
                      <span style={{ fontWeight: '600' }}>{dataStats.total}건</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      <span>가계부 {dataStats.transactions}</span>
                      <span>자산 {dataStats.assets}</span>
                      <span>부채 {dataStats.debts}</span>
                      <span>주식 {dataStats.stocks}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 백업 메시지 */}
              {backupMessage && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  fontSize: '0.8rem',
                  background: backupMessage.type === 'success' ? 'var(--income-light)' : 'var(--expense-light)',
                  color: backupMessage.type === 'success' ? 'var(--income)' : 'var(--expense)'
                }}>
                  {backupMessage.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {backupMessage.text}
                </div>
              )}
              
              {/* 백업/복구 버튼 */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  <Download size={14} />
                  {isExporting ? '내보내는 중...' : '백업 (내보내기)'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={handleImportClick}
                  disabled={isImporting}
                >
                  <Upload size={14} />
                  {isImporting ? '복구 중...' : '복구 (가져오기)'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '8px' }}>
                💡 백업 파일은 JSON 형식으로 저장됩니다
              </p>
            </div>
          </div>
        </div>
        
        {/* 복구 확인 모달 */}
        {showConfirmModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>📦 데이터 복구</h3>
              
              {pendingBackupData && (
                <div style={{ 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '8px', 
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '0.8rem'
                }}>
                  <p style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>
                    백업 날짜: {new Date(pendingBackupData.exportedAt).toLocaleString('ko-KR')}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>가계부 {pendingBackupData.data.transactions?.length || 0}건</span>
                    <span>자산 {pendingBackupData.data.assets?.length || 0}건</span>
                    <span>부채 {pendingBackupData.data.debts?.length || 0}건</span>
                    <span>주식 {pendingBackupData.data.stocks?.length || 0}건</span>
                  </div>
                </div>
              )}
              
              <p style={{ marginBottom: '20px', fontSize: '0.85rem', lineHeight: '1.5' }}>
                복구 방법을 선택하세요:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleConfirmImport(false)}
                  style={{ padding: '12px' }}
                >
                  기존 데이터 유지하고 추가
                </button>
                <button 
                  className="btn"
                  onClick={() => handleConfirmImport(true)}
                  style={{ 
                    padding: '12px',
                    background: 'var(--expense-light)',
                    color: 'var(--expense)',
                    border: '1px solid var(--expense)'
                  }}
                >
                  ⚠️ 기존 데이터 삭제 후 복구
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowConfirmModal(false)
                    setPendingBackupData(null)
                  }}
                  style={{ padding: '12px' }}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 화면 설정 & 예산 목표 */}
        <div className="grid-2">
          {/* 화면 설정 */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {settings.darkMode ? <Moon size={14} style={{ color: 'var(--accent)' }} /> : <Sun size={14} style={{ color: 'var(--accent)' }} />}
                화면 설정
              </h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {/* 다크모드 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)'
              }}>
                <div>
                  <p style={{ fontWeight: '500', fontSize: '0.85rem' }}>다크 모드</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>어두운 테마로 전환</p>
                </div>
                <Toggle isOn={settings.darkMode} onToggle={toggleDarkMode} />
              </div>
              
              {/* 시작 페이지 */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ marginBottom: '8px' }}>
                  <p style={{ fontWeight: '500', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Home size={12} />
                    시작 페이지
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>앱 시작 시 첫 화면</p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { value: '/', label: '대시보드' },
                    { value: '/budget', label: '가계부' },
                    { value: '/debt', label: '부채' },
                    { value: '/stock', label: '주식' },
                    { value: '/settings', label: '설정' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateSetting('startPage', value)}
                      className={`btn ${settings.startPage === value ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 기본 통화 */}
              <div style={{ padding: '12px 16px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <p style={{ fontWeight: '500', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={12} />
                    주식 기본 탭
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>주식 페이지 첫 화면</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { value: 'all', label: '전체' },
                    { value: 'KR', label: '한국' },
                    { value: 'US', label: '미국' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateSetting('defaultCurrency', value)}
                      className={`btn ${settings.defaultCurrency === value ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '8px 12px' }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 예산 목표 */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={14} style={{ color: 'var(--accent)' }} />
                예산 목표
              </h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {/* 예산 목표 사용 여부 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)'
              }}>
                <div>
                  <p style={{ fontWeight: '500', fontSize: '0.85rem' }}>예산 목표 사용</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>가계부에서 지출 진행률 표시</p>
                </div>
                <Toggle 
                  isOn={settings.useBudgetGoal} 
                  onToggle={() => updateSetting('useBudgetGoal', !settings.useBudgetGoal)} 
                />
              </div>
              
              {/* 목표 금액 설정 (사용 시에만 표시) */}
              {settings.useBudgetGoal && (
                <div style={{ padding: '12px 16px' }}>
                  <p style={{ fontWeight: '500', fontSize: '0.85rem', marginBottom: '4px' }}>월 지출 목표</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '12px' }}>
                    이 금액을 초과하면 경고가 표시됩니다
                  </p>
                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={settings.budgetGoal.toLocaleString()}
                      onChange={handleBudgetChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: '40px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        textAlign: 'right',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem'
                    }}>원</span>
                  </div>
                  
                  {/* 금액 조절 버튼 */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[
                      { amount: 10000, label: '+1만' },
                      { amount: 100000, label: '+10만' },
                      { amount: 1000000, label: '+100만' }
                    ].map(({ amount, label }) => (
                      <button
                        key={amount}
                        onClick={() => updateSetting('budgetGoal', settings.budgetGoal + amount)}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      onClick={() => updateSetting('budgetGoal', 0)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--expense)' }}
                    >
                      초기화
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 정보 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={14} style={{ color: 'var(--accent)' }} />
              정보
            </h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>버전</span>
              <span style={{ fontWeight: '500', fontSize: '0.8rem' }}>0.1.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>개발자</span>
              <span style={{ fontWeight: '500', fontSize: '0.8rem' }}>Pocket Team</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>GitHub</span>
              <a href="https://github.com/carro-nux/Pocket" target="_blank" rel="noopener noreferrer" 
                style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500', fontSize: '0.8rem' }}>
                carro-nux/Pocket
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
