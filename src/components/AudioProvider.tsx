import React, { useEffect } from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'

const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isPlaying } = useScrapbookStore()

  useEffect(() => {
    // Audio functionality will be implemented here
    // For now, just a placeholder for the audio context
    if (isPlaying) {
      console.log('Audio playing...')
    } else {
      console.log('Audio paused...')
    }
  }, [isPlaying])

  return <>{children}</>
}

export default AudioProvider 