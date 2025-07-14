-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    display_name VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    preferred_currency VARCHAR(3) DEFAULT 'KRW',
    notification_email BOOLEAN DEFAULT true,
    notification_push BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert settings table
CREATE TABLE alert_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    currency_from VARCHAR(3) NOT NULL,
    currency_to VARCHAR(3) NOT NULL,
    target_rate DECIMAL(15,6) NOT NULL,
    condition VARCHAR(10) CHECK (condition IN ('above', 'below')) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exchange rates history
CREATE TABLE exchange_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    currency_from VARCHAR(3) NOT NULL,
    currency_to VARCHAR(3) NOT NULL,
    rate DECIMAL(15,6) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification history
CREATE TABLE notification_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    alert_setting_id UUID REFERENCES alert_settings(id) ON DELETE CASCADE,
    triggered_rate DECIMAL(15,6) NOT NULL,
    notification_type VARCHAR(20) DEFAULT 'email',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_alert_settings_user_id ON alert_settings(user_id);
CREATE INDEX idx_alert_settings_active ON alert_settings(is_active) WHERE is_active = true;
CREATE INDEX idx_exchange_rates_currency_pair ON exchange_rates(currency_from, currency_to);
CREATE INDEX idx_exchange_rates_timestamp ON exchange_rates(timestamp);

-- RLS (Row Level Security) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Alert settings policies
CREATE POLICY "Users can view own alerts" ON alert_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" ON alert_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON alert_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts" ON alert_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Notification history policies
CREATE POLICY "Users can view own notifications" ON notification_history
    FOR SELECT USING (auth.uid() = user_id);