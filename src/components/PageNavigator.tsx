import React from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'

const PageNavigator: React.FC = () => {
  const { currentScrapbook, currentPageIndex, setCurrentPage, addPage } = useScrapbookStore()

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPage(currentPageIndex - 1)
    }
  }

  const handleNextPage = () => {
    if (currentScrapbook && currentPageIndex < currentScrapbook.pages.length - 1) {
      setCurrentPage(currentPageIndex + 1)
    }
  }

  const handleAddPage = () => {
    addPage()
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPageIndex === 0}
          className="p-2 border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: currentPageIndex === 0 ? '#9eb492' : '#3f473b', 
            color: '#f6f1ee',
            borderColor: '#3f473b'
          }}
        >
          <span className="text-sm font-bold">◀</span>
        </button>
        
        <div className="text-center">
          <div className="text-xs font-terminal" style={{ color: '#3f473b' }}>
            PAGE
          </div>
          <div className="font-pixel text-sm" style={{ color: '#3f473b' }}>
            {currentPageIndex + 1} / {currentScrapbook?.pages.length || 1}
          </div>
        </div>
        
        <button
          onClick={handleNextPage}
          disabled={!currentScrapbook || currentPageIndex >= currentScrapbook.pages.length - 1}
          className="p-2 border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: (!currentScrapbook || currentPageIndex >= currentScrapbook.pages.length - 1) ? '#9eb492' : '#3f473b', 
            color: '#f6f1ee',
            borderColor: '#3f473b'
          }}
        >
          <span className="text-sm font-bold">▶</span>
        </button>
      </div>
      
      <button
        onClick={handleAddPage}
        className="p-2 border-2 transition-all duration-200 hover:scale-105"
        style={{ 
          backgroundColor: '#3f473b', 
          color: '#f6f1ee',
          borderColor: '#3f473b'
        }}
      >
        <span className="text-xs font-pixel">+ PAGE</span>
      </button>
    </div>
  )
}

export default PageNavigator 