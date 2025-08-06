import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import PhotoUploader from './PhotoUploader'
import ScrapbookCanvas from './ScrapbookCanvas'
import Toolbar from './Toolbar'
import StickerPanel from './StickerPanel'
import PageNavigator from './PageNavigator'
import ShareButton from './ShareButton'
import MusicIntegration from './MusicIntegration'
import { useScrapbookStore } from '../store/ScrapbookStore'

const ScrapbookEditor: React.FC = () => {
  const { currentScrapbook, currentPageIndex, createNewScrapbook, checkSavedData } = useScrapbookStore()
  const [showWelcome, setShowWelcome] = useState(!currentScrapbook)

  const handleCreateNew = () => {
    createNewScrapbook('My First Scrapbook')
    setShowWelcome(false)
  }

  const handleDebugSave = () => {
    console.log('Current scrapbook state:', currentScrapbook)
    checkSavedData()
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f6f1ee' }}>
        <div className="text-center p-8 max-w-md mx-4 rounded-2xl shadow-xl border-2 scrapp-panel">
          <div className="mb-6">
            <div className="scrapp-logo text-3xl mb-4">SCRAPP</div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 scrapp-icon-btn">
              <span className="text-2xl">📸</span>
            </div>
          </div>
          <p className="font-coolvetica text-lg mb-8 leading-relaxed" style={{ color: '#3f473b' }}>
            Create beautiful digital scrapbooks with photos, text, and 3D embellishments
          </p>
          <button
            onClick={handleCreateNew}
            className="scrapp-btn text-lg px-8 py-4 animate-pixel-fade font-pixel border-4 transition-all duration-200 hover:scale-105"
          >
            START NEW SCRAPBOOK
          </button>
          <div className="mt-6 text-xs font-terminal" style={{ color: '#3f473b' }}>
            Press ENTER to continue...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#f6f1ee' }}>
      <header className="p-3 border-b-2 flex items-center justify-between" style={{ backgroundColor: '#9eb492', borderColor: '#3f473b' }}>
        <div className="flex items-center space-x-3">
          <div className="scrapp-icon-btn">
            <span className="text-sm">📸</span>
          </div>
          <div className="scrapp-logo text-lg">
            {currentScrapbook?.title?.toUpperCase()}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <MusicIntegration />
          <PageNavigator />
          <ShareButton />
          {/* Debug button */}
          <button
            onClick={handleDebugSave}
            className="p-2 border-2 transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: '#3f473b', 
              color: '#f6f1ee',
              borderColor: '#3f473b'
            }}
            title="Debug Save"
          >
            <span className="text-xs font-bold">🐛</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="w-64 p-3 space-y-4 border-r-2 scrapp-scrollbar" style={{ backgroundColor: '#9eb492', borderColor: '#3f473b' }}>
          <PhotoUploader />
          <Toolbar />
          <StickerPanel />
        </div>

        <div className="flex-1 p-3">
          <ScrapbookCanvas />
        </div>
      </div>
    </div>
  )
}

export default ScrapbookEditor 