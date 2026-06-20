-- Pocket 데이터베이스 스키마 (로그인 없이 사용 버전)
-- 로그인 기능 구현 전 테스트용
-- Supabase SQL Editor에서 실행하세요
-- https://supabase.com/dashboard/project/gzxbckioutctwxbevqmk/sql/new

-- ==========================================
-- 1. 가계부 테이블 (transactions)
-- ==========================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'fixed', 'variable')),
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(15, 0) NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  check_state SMALLINT NOT NULL DEFAULT 0, -- 지출 3단계 체크: 0=없음, 1=이체완료, 2=결제완료
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- 기존 프로젝트 마이그레이션: check_state 컬럼이 없으면 추가하고, 기존 완료 항목을 결제완료(2)로 이전
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS check_state SMALLINT NOT NULL DEFAULT 0;
UPDATE transactions SET check_state = 2 WHERE is_completed = TRUE AND check_state = 0;

-- ==========================================
-- 2. 자산 관리 테이블 (assets)
-- ==========================================
CREATE TABLE IF NOT EXISTS assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdraw')),
  amount DECIMAL(15, 0) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_assets_date ON assets(date);

-- ==========================================
-- 3. 부채 관리 테이블 (debts)
-- ==========================================
CREATE TABLE IF NOT EXISTS debts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('borrow', 'repay')),
  amount DECIMAL(15, 0) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_debts_date ON debts(date);

-- ==========================================
-- 4. 주식 보유 테이블 (stocks)
-- ==========================================
CREATE TABLE IF NOT EXISTS stocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market VARCHAR(10) NOT NULL CHECK (market IN ('KR', 'US')),
  broker VARCHAR(20) NOT NULL CHECK (broker IN ('namu', 'toss', 'isa')),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  quantity DECIMAL(15, 4) NOT NULL,
  avg_price DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL CHECK (currency IN ('KRW', 'USD')),
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_stocks_market ON stocks(market);
CREATE INDEX IF NOT EXISTS idx_stocks_broker ON stocks(broker);

-- ==========================================
-- 5. 사용자 설정 테이블 (settings)
-- ==========================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  theme VARCHAR(20) DEFAULT 'dark',
  default_currency VARCHAR(10) DEFAULT 'all',
  use_budget_goal BOOLEAN DEFAULT TRUE,
  budget_goal DECIMAL(15, 0) DEFAULT 5000000,
  auto_refresh_interval INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- updated_at 자동 갱신 트리거
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_debts_updated_at
  BEFORE UPDATE ON debts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stocks_updated_at
  BEFORE UPDATE ON stocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 완료 메시지
-- ==========================================
-- 테이블 생성 완료! (로그인 없이 사용 가능)
-- 로그인 기능 구현 후 schema.sql로 업그레이드하세요.

