import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Wallet, 
  Landmark,
  CreditCard, 
  TrendingUp, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useSettings } from '../context/SettingsContext'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '대시보드' },
  { path: '/budget', icon: Wallet, label: '가계부' },
  { path: '/asset', icon: Landmark, label: '자산 관리' },
  { path: '/debt', icon: CreditCard, label: '부채 관리' },
  { path: '/stock', icon: TrendingUp, label: '주식 관리' },
  { path: '/settings', icon: Settings, label: '설정' },
]

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { settings } = useSettings()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const hasRedirected = useRef(false)
  // 첫 렌더에서 startPage가 '/'가 아닐 때 Dashboard가 잠시 보이는 깜빡임 방지
  const [isResolvingStartPage, setIsResolvingStartPage] = useState(
    location.pathname === '/' && settings.startPage && settings.startPage !== '/'
  )

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // 첫 로드 시 시작 페이지로 이동
  useEffect(() => {
    if (!hasRedirected.current && location.pathname === '/' && settings.startPage !== '/') {
      hasRedirected.current = true
      navigate(settings.startPage, { replace: true })
    }
    // 리다이렉트가 필요했다면 navigation 이후 게이트 해제
    setIsResolvingStartPage(false)
  }, [settings.startPage, navigate, location.pathname])

  return (
    <div className="app-container">
      {/* 모바일 메뉴 버튼 */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 사이드바 */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="logo">
            <span className="logo-icon">P</span>
            <span className="logo-text">Pocket</span>
          </h1>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>로그아웃</span>
          </button>
          <p className="version">v0.1.0</p>
        </div>
      </aside>

      {/* 오버레이 (모바일) */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 메인 콘텐츠 — 시작페이지 리다이렉트 진행 중에는 빈 영역 유지 (깜빡임 방지) */}
      <main className="main-content">
        {isResolvingStartPage ? null : <Outlet />}
      </main>
    </div>
  )
}

export default Layout

