import React, { createContext, useContext, ReactNode } from 'react'
import { useScrapbookStore } from './ScrapbookStore'

const ScrapbookContext = createContext<ReturnType<typeof useScrapbookStore> | null>(null)

export const ScrapbookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const store = useScrapbookStore()
  return (
    <ScrapbookContext.Provider value={store}>
      {children}
    </ScrapbookContext.Provider>
  )
}

export const useScrapbook = () => {
  const context = useContext(ScrapbookContext)
  if (!context) {
    throw new Error('useScrapbook must be used within a ScrapbookProvider')
  }
  return context
} 