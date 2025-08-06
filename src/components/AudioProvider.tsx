import React, { createContext, useContext, ReactNode } from 'react'

interface AudioContextType {
  // Add audio-related methods here when needed
}

const AudioContext = createContext<AudioContextType | null>(null)

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AudioContext.Provider value={{}}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
} 