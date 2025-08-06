import React, { useState, useEffect } from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'
import { Photo } from '../types'

interface PhotoElementProps {
  photo: Photo
  isDragging?: boolean
  onMouseDown?: (e: React.MouseEvent) => void
}

const PhotoElement: React.FC<PhotoElementProps> = ({ photo, isDragging = false, onMouseDown }) => {
  const { updatePhoto, removePhoto, setSelectedElement, selectedElement } = useScrapbookStore()
  const [isEditing, setIsEditing] = useState(false)
  const [caption, setCaption] = useState(photo.caption || '')
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 })

  const isSelected = selectedElement === photo.id

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleCaptionSave = () => {
    updatePhoto(photo.id, { caption })
    setIsEditing(false)
  }

  const handleRotate = () => {
    updatePhoto(photo.id, { rotation: photo.rotation + 15 })
  }

  const handleDelete = () => {
    removePhoto(photo.id)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onMouseDown) {
      onMouseDown(e)
    }
    setSelectedElement(photo.id)
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      width: photo.size.width,
      height: photo.size.height,
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleResize = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - resizeStart.x
    const deltaY = e.clientY - resizeStart.y
    
    // Calculate new size (maintain aspect ratio)
    const aspectRatio = photo.size.width / photo.size.height
    const newWidth = Math.max(100, Math.min(400, resizeStart.width + deltaX))
    const newHeight = newWidth / aspectRatio

    updatePhoto(photo.id, { 
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
  }, [isResizing, resizeStart, photo.size.width, photo.size.height])

  return (
    <div
      className={`absolute photo-frame draggable-element ${isSelected ? 'ring-2 ring-primary-500' : ''} ${isDragging ? 'dragging z-50' : ''}`}
      style={{
        left: photo.position.x,
        top: photo.position.y,
        width: photo.size.width,
        height: photo.size.height,
        transform: `rotate(${photo.rotation}deg)`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={photo.url}
        alt={photo.name}
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      
      {/* Caption */}
      {photo.caption && !isEditing && (
        <div 
          className="absolute bottom-0 left-0 right-0 text-caption text-center pointer-events-none"
          onDoubleClick={handleDoubleClick}
        >
          {photo.caption}
        </div>
      )}

      {/* Edit Caption Modal */}
      {isEditing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Enter caption..."
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={handleCaptionSave}
                className="bg-primary-500 text-white px-3 py-1 rounded text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resize Handle */}
      {isSelected && (
        <div 
          className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 cursor-se-resize hover:bg-gray-100 transition-colors duration-200"
          style={{ borderColor: '#3f473b' }}
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
            <span className="text-xs">🔄</span>
          </button>
          <button
            onClick={handleDoubleClick}
            className="bg-white p-1 rounded shadow hover:bg-gray-50"
            title="Edit Caption"
          >
            <span className="text-xs">✏️</span>
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
  )
}

export default PhotoElement 