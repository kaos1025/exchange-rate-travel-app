import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 시스템 다크모드 설정 확인
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 로컬 스토리지에서 테마 설정 확인
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(mediaQuery.matches);
    }

    // 시스템 테마 변경 감지
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // DOM에 다크모드 클래스 적용
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const setTheme = (theme) => {
    setIsDark(theme === 'dark');
    localStorage.setItem('theme', theme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        isDark, 
        toggleTheme, 
        setTheme,
        theme: isDark ? 'dark' : 'light'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};