import React, { useState, useEffect } from 'react'
import { Sticker } from '../types'

interface StickerElementProps {
  sticker: Sticker
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

const StickerElement: React.FC<StickerElementProps> = ({ sticker, isDragging, onMouseDown }) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 })
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleGlobalMouseMove = (e: any) => {
      if (isResizing) {
        const deltaX = e.clientX - resizeStartPos.x
        const deltaY = e.clientY - resizeStartPos.y
        
        const newWidth = Math.max(40, Math.min(200, resizeStartSize.width + deltaX))
        const newHeight = Math.max(40, Math.min(200, resizeStartSize.height + deltaY))
        
        // Update sticker size in store
        console.log('Resizing sticker:', { width: newWidth, height: newHeight })
      }
    }

    const handleGlobalMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isResizing, resizeStartSize, resizeStartPos])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStartSize({ width: sticker.size.width, height: sticker.size.height })
    setResizeStartPos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className={`absolute cursor-move ${isDragging ? 'opacity-50' : ''}`}
      style={{
        left: sticker.position.x,
        top: sticker.position.y,
        transform: `rotate(${sticker.rotation}deg)`,
        width: sticker.size.width,
        height: sticker.size.height
      }}
      onMouseDown={onMouseDown}
    >
      <div className="relative w-full h-full">
        <img
          src={sticker.iconUrl}
          alt={sticker.name}
          className="w-full h-full object-contain"
          draggable={false}
        />
        
        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-white border-2 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
          style={{ borderColor: '#3f473b' }}
          onMouseDown={handleResizeStart}
        />
      </div>
    </div>
  )
}

export default StickerElement 