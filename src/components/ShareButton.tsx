import React, { useState } from 'react'
import SharingPanel from './SharingPanel'

const ShareButton: React.FC = () => {
  const [isSharingOpen, setIsSharingOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsSharingOpen(true)}
        className="p-2 border-2 transition-all duration-200 hover:scale-105"
        style={{ 
          backgroundColor: '#3f473b', 
          color: '#f6f1ee',
          borderColor: '#3f473b'
        }}
        title="Share Scrapbook"
      >
        <span className="text-sm font-bold">📤</span>
      </button>
      
      <SharingPanel 
        isOpen={isSharingOpen} 
        onClose={() => setIsSharingOpen(false)} 
      />
    </>
  )
}

export default ShareButton 