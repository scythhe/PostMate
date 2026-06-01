import { useState } from 'react'
import { BusinessAssets } from './components/BusinessAssets'
import { Dashboard } from './components/Dashboard'
import { LandingPage } from './components/LandingPage'
import { Navbar } from './components/Navbar'
import { defaultBusiness, demoBusinessAssets } from './lib/mockGenerator'
import type { BusinessAssets as BusinessAssetsData, BusinessProfile } from './types'

function App() {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [businessAssets, setBusinessAssets] = useState<BusinessAssetsData | null>(null)

  const resetFlow = () => {
    setBusinessProfile(null)
    setBusinessAssets(null)
  }

  const useDemoData = () => {
    setBusinessProfile(defaultBusiness)
    setBusinessAssets(demoBusinessAssets)
  }

  if (businessProfile && businessAssets) {
    return <Dashboard assets={businessAssets} business={businessProfile} onReset={resetFlow} />
  }

  if (businessProfile) {
    return <BusinessAssets business={businessProfile} onBack={resetFlow} onSubmit={setBusinessAssets} />
  }

  return (
    <>
      <Navbar />
      <LandingPage onBusinessSubmit={setBusinessProfile} onUseDemoData={useDemoData} />
    </>
  )
}

export default App
