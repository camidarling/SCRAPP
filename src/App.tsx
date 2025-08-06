import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import ScrapbookEditor from './components/ScrapbookEditor'
import { ScrapbookProvider } from './store/ScrapbookProvider'
import AudioProvider from './components/AudioProvider'
import LoadingSplash from './components/LoadingSplash'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingSplash onComplete={handleLoadingComplete} />
  }

  return (
    <ScrapbookProvider>
      <AudioProvider>
        <div className="min-h-screen" style={{ backgroundColor: '#f6f1ee' }}>
          {/* SCRAPP Watermark */}
          <div className="scrapp-watermark">
            SCRAPP
          </div>
          <ScrapbookEditor />
        </div>
      </AudioProvider>
    </ScrapbookProvider>
  )
}

export default App 