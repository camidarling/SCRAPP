import React, { useState, useEffect } from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'
import { Embellishment } from '../types'
import { Trash2, RotateCw } from 'lucide-react'

interface EmbellishmentElementProps {
  embellishment: Embellishment
  isDragging?: boolean
  onMouseDown?: (e: React.MouseEvent) => void
}

const EmbellishmentElement: React.FC<EmbellishmentElementProps> = ({ embellishment, isDragging = false, onMouseDown }) => {
  const { updateEmbellishment, removeEmbellishment, setSelectedElement, selectedElement } = useScrapbookStore()
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 })

  const isSelected = selectedElement?.id === embellishment.id

  const handleRotate = () => {
    updateEmbellishment(embellishment.id, { rotation: embellishment.rotation + 15 })
  }

  const handleDelete = () => {
    removeEmbellishment(embellishment.id)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onMouseDown) {
      onMouseDown(e)
    }
    setSelectedElement(embellishment)
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      width: embellishment.size.width,
      height: embellishment.size.height,
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleResize = (e: React.MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - resizeStart.x
    const deltaY = e.clientY - resizeStart.y
    
    // Calculate new size (maintain aspect ratio)
    const aspectRatio = embellishment.size.width / embellishment.size.height
    const newWidth = Math.max(40, Math.min(200, resizeStart.width + deltaX))
    const newHeight = newWidth / aspectRatio

    updateEmbellishment(embellishment.id, { 
      size: { 
        width: Math.round(newWidth), 
        height: Math.round(newHeight) 
      } 
    })
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
  }

  // Add global mouse event listeners for resize
  useEffect(() => {
    if (isResizing) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleResize(e as any)
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
  }, [isResizing, resizeStart, embellishment.size.width, embellishment.size.height])

  return (
    <div
      className={`absolute embellishment draggable-element ${isSelected ? 'ring-2 ring-primary-500' : ''} ${isDragging ? 'dragging z-50' : ''}`}
      style={{
        left: embellishment.position.x,
        top: embellishment.position.y,
        width: embellishment.size.width,
        height: embellishment.size.height,
        transform: `rotate(${embellishment.rotation}deg)`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {embellishment.iconUrl ? (
        <img
          src={embellishment.iconUrl}
          alt={embellishment.name}
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center text-2xl pointer-events-none"
          style={{ color: embellishment.color || '#8b7355' }}
        >
          {embellishment.name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Resize Handle */}
      {isSelected && (
        <div 
          className="absolute -bottom-2 -right-2 w-4 h-4 bg-retro-primary border-2 border-retro-dark cursor-se-resize hover:bg-retro-primary-light transition-colors duration-200"
          onMouseDown={handleResizeStart}
          title="Resize"
        />
      )}

      {/* Controls */}
      {isSelected && (
        <div className="absolute -top-8 left-0 right-0 flex justify-center space-x-2">
          <button
            onClick={handleRotate}
            className="bg-white p-1 rounded shadow hover:bg-gray-50"
            title="Rotate"
          >
            <RotateCw className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={handleDelete}
            className="bg-white p-1 rounded shadow hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )}
    </div>
  )
}

export default EmbellishmentElement 