import React, { useState, useEffect } from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'
import PhotoElement from './PhotoElement'
import StickerElement from './StickerElement'
import TextElement from './TextElement'

const ScrapbookCanvas: React.FC = () => {
  const { currentScrapbook, currentPageIndex, setBackgroundColor, updateElementPosition } = useScrapbookStore()
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Get current page from scrapbook
  const currentPage = currentScrapbook?.pages[currentPageIndex]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedElement) {
        const canvas = document.querySelector('.scrapbook-canvas') as HTMLElement
        if (canvas) {
          const rect = canvas.getBoundingClientRect()
          const x = e.clientX - rect.left - dragOffset.x
          const y = e.clientY - rect.top - dragOffset.y
          
          // Constrain to canvas bounds
          const maxX = rect.width - 100
          const maxY = rect.height - 100
          const constrainedX = Math.max(0, Math.min(x, maxX))
          const constrainedY = Math.max(0, Math.min(y, maxY))
          
          // Update element position in store
          if (draggedElement && currentPage) {
            if (currentPage.photos.find((p: any) => p.id === draggedElement)) {
              updateElementPosition(draggedElement, 'photo', { x: constrainedX, y: constrainedY })
            } else if (currentPage.stickers.find((s: any) => s.id === draggedElement)) {
              updateElementPosition(draggedElement, 'sticker', { x: constrainedX, y: constrainedY })
            } else if (currentPage.textElements.find((t: any) => t.id === draggedElement)) {
              updateElementPosition(draggedElement, 'text', { x: constrainedX, y: constrainedY })
            }
          }
        }
      }
    }

    const handleMouseUp = () => {
      setDraggedElement(null)
    }

    if (draggedElement) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggedElement, dragOffset, currentPage, updateElementPosition])

  const handleMouseDown = (elementId: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const canvas = document.querySelector('.scrapbook-canvas') as HTMLElement
    if (canvas) {
      const canvasRect = canvas.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setDraggedElement(elementId)
    }
  }

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value)
  }

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-2xl font-pixel mb-4" style={{ color: '#3f473b' }}>
            NO PAGE SELECTED
          </div>
          <div className="text-sm font-coolvetica" style={{ color: '#3f473b' }}>
            Create a new scrapbook to get started
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Header */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg border-2" style={{ backgroundColor: '#9eb492', borderColor: '#3f473b' }}>
        <h2 className="font-pixel text-lg" style={{ color: '#3f473b' }}>
          PAGE {currentPageIndex + 1}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-terminal" style={{ color: '#3f473b' }}>
            BACKGROUND:
          </span>
          <div className="relative">
            <input
              type="color"
              value={currentPage.backgroundColor || '#f6f1ee'}
              onChange={handleBackgroundColorChange}
              className="w-8 h-8 border-2 rounded cursor-pointer appearance-none"
              style={{ 
                borderColor: '#3f473b',
                backgroundColor: currentPage.backgroundColor || '#f6f1ee'
              }}
              title="Select background color"
            />
            <div 
              className="absolute inset-0 w-8 h-8 border-2 rounded pointer-events-none"
              style={{ 
                borderColor: '#3f473b',
                background: `linear-gradient(45deg, ${currentPage.backgroundColor || '#f6f1ee'} 50%, transparent 50%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Canvas Area - Square Aspect Ratio */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-2xl aspect-square relative overflow-hidden rounded-lg border-2 scrapbook-canvas"
          style={{ 
            backgroundColor: currentPage.backgroundColor || '#f6f1ee',
            borderColor: '#3f473b',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(158, 180, 146, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(158, 180, 146, 0.1) 0%, transparent 50%)
            `
          }}
        >
          {/* Photos */}
          {currentPage.photos.map((photo) => (
            <PhotoElement
              key={photo.id}
              photo={photo}
              isDragging={draggedElement === photo.id}
              onMouseDown={(e) => handleMouseDown(photo.id, e)}
            />
          ))}
          {/* Stickers */}
          {currentPage.stickers.map((sticker) => (
            <StickerElement
              key={sticker.id}
              sticker={sticker}
              isDragging={draggedElement === sticker.id}
              onMouseDown={(e) => handleMouseDown(sticker.id, e)}
            />
          ))}
          {/* Text Elements */}
          {currentPage.textElements.map((textElement) => (
            <TextElement
              key={textElement.id}
              textElement={textElement}
              isDragging={draggedElement === textElement.id}
              onMouseDown={(e) => handleMouseDown(textElement.id, e)}
            />
          ))}

          {/* Drop Zone Indicator */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 text-xs font-terminal opacity-50" style={{ color: '#3f473b' }}>
              DRAG ELEMENTS HERE
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScrapbookCanvas 