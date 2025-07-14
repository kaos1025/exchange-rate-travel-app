import React from 'react'
import { MinimalHeader } from './components/MinimalHeader'
import { ExchangeRateCard } from './components/ExchangeRateCard'
import { CurrencyCalculator } from './components/CurrencyCalculator'
import { TravelContext } from './components/TravelContext'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <MinimalHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          <ExchangeRateCard />
          <CurrencyCalculator />
          <TravelContext />
        </div>
      </main>
    </div>
  )
}

export default App