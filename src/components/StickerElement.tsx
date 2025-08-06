import React, { useState, useEffect } from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'
import { Sticker } from '../types'

interface StickerElementProps {
  sticker: Sticker
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

const StickerElement: React.FC<StickerElementProps> = ({ sticker, isDragging, onMouseDown }) => {
  const { updateSticker, removeSticker, setSelectedElement, selectedElement } = useScrapbookStore()
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 })

  const isSelected = selectedElement === sticker.id

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onMouseDown) {
      onMouseDown(e)
    }
    setSelectedElement(sticker.id)
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      width: sticker.size.width,
      height: sticker.size.height,
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleResize = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - resizeStart.x
    
    // Calculate new size (maintain aspect ratio)
    const aspectRatio = sticker.size.width / sticker.size.height
    const newWidth = Math.max(40, Math.min(200, resizeStart.width + deltaX))
    const newHeight = newWidth / aspectRatio

    updateSticker(sticker.id, { 
      size: { 
        width: Math.round(newWidth), 
        height: Math.round(newHeight) 
      } 
    })
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
  }

  const handleRotate = () => {
    updateSticker(sticker.id, { rotation: sticker.rotation + 15 })
  }

  const handleDelete = () => {
    removeSticker(sticker.id)
  }

  // Add global mouse event listeners for resize
  useEffect(() => {
    if (isResizing) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleResize(e)
      }
      const handleGlobalMouseUp = () => {
        handleResizeEnd()
      }

      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [isResizing, resizeStart, sticker.size.width, sticker.size.height])

  return (
    <div
      className={`absolute cursor-move ${isDragging ? 'opacity-50' : ''} ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
      style={{
        left: sticker.position.x,
        top: sticker.position.y,
        width: sticker.size.width,
        height: sticker.size.height,
        transform: `rotate(${sticker.rotation}deg)`
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative w-full h-full">
        <img
          src={sticker.iconUrl}
          alt={sticker.name}
          className="w-full h-full object-contain"
          draggable={false}
        />
        
        {/* Resize Handle */}
        {isSelected && (
          <div
            className="absolute bottom-0 right-0 w-3 h-3 bg-white border-2 cursor-se-resize hover:bg-gray-100 transition-opacity"
            style={{ borderColor: '#3f473b' }}
            onMouseDown={handleResizeStart}
          />
        )}

        {/* Controls */}
        {isSelected && (
          <div className="absolute -top-6 left-0 right-0 flex justify-center space-x-1">
            <button
              onClick={handleRotate}
              className="bg-white p-1 rounded shadow hover:bg-gray-50"
              title="Rotate"
            >
              <span className="text-xs">🔄</span>
            </button>
            <button
              onClick={handleDelete}
              className="bg-white p-1 rounded shadow hover:bg-red-50"
              title="Delete"
            >
              <span className="text-xs">🗑️</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StickerElement 