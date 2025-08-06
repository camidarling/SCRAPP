import { useState } from 'react'
import ScrapbookEditor from './components/ScrapbookEditor'
import { ScrapbookProvider } from './store/ScrapbookProvider'
import './index.css'

function App() {
  return (
    <ScrapbookProvider>
      <ScrapbookEditor />
    </ScrapbookProvider>
  )
}

export default App 