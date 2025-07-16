import React from 'react'
import { LandingPage } from './components/LandingPage'
import { MinimalHeader } from './components/MinimalHeader'
import { ExchangeRateCard } from './components/ExchangeRateCard'
import { CurrencyCalculator } from './components/CurrencyCalculator'
import { TravelContext } from './components/TravelContext'
import { ExchangeRateChart } from './components/ExchangeRateChart'
import { ConnectionStatus } from './components/ConnectionStatus'
import { ToastProvider } from './components/ui/Toast'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const [currentView, setCurrentView] = React.useState('landing')

  if (currentView === 'landing') {
    return <LandingPage />
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <MinimalHeader />
          
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="space-y-8 sm:space-y-12">
              <ExchangeRateCard />
              <CurrencyCalculator />
              <ExchangeRateChart />
              <TravelContext />
            </div>
          </main>
          
          <ConnectionStatus />
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App