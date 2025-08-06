import React, { useState } from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'
import { TextElement as TextElementType } from '../types'
import { Edit3, Trash2, RotateCw } from 'lucide-react'

interface TextElementProps {
  textElement: TextElementType
  isDragging?: boolean
  onMouseDown?: (e: React.MouseEvent) => void
}

const TextElement: React.FC<TextElementProps> = ({ textElement, isDragging = false, onMouseDown }) => {
  const { updateTextElement, removeTextElement, setSelectedElement, selectedElement } = useScrapbookStore()
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(textElement.content)

  const isSelected = selectedElement === textElement.id

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    updateTextElement(textElement.id, { content })
    setIsEditing(false)
  }

  const handleRotate = () => {
    updateTextElement(textElement.id, { rotation: textElement.rotation + 15 })
  }

  const handleDelete = () => {
    removeTextElement(textElement.id)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onMouseDown) {
      onMouseDown(e)
    }
    setSelectedElement(textElement.id)
  }

  const handleResize = (direction: 'increase' | 'decrease') => {
    const currentSize = textElement.fontSize
    const newSize = direction === 'increase' 
      ? Math.min(72, currentSize + 4) 
      : Math.max(12, currentSize - 4)
    
    updateTextElement(textElement.id, { fontSize: newSize })
  }

  const getFontClass = (fontFamily: string) => {
    switch (fontFamily) {
      case 'coolvetica':
        return 'font-coolvetica'
      case 'coolvetica-italic':
        return 'font-coolvetica-italic'
      case 'coolvetica-condensed':
        return 'font-coolvetica-condensed'
      case 'coolvetica-bold':
        return 'font-coolvetica-bold'
      case 'typewriter':
        return 'font-typewriter'
      case 'handwriting':
        return 'font-handwriting'
      case 'pixel':
        return 'font-pixel'
      case 'terminal':
        return 'font-terminal'
      default:
        return 'font-coolvetica'
    }
  }

  return (
    <div
      className={`absolute draggable-element ${isSelected ? 'ring-2 ring-primary-500' : ''} ${isDragging ? 'dragging z-50' : ''}`}
      style={{
        left: textElement.position.x,
        top: textElement.position.y,
        transform: `rotate(${textElement.rotation}deg)`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`text-caption ${getFontClass(textElement.fontFamily)}`}
        style={{
          fontSize: textElement.fontSize,
          color: textElement.color,
        }}
      >
        {textElement.content}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg min-w-64">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Enter text..."
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
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

      {/* Resize Controls */}
      {isSelected && (
        <div className="absolute -top-8 left-0 right-0 flex justify-center space-x-2">
          <button
            onClick={() => handleResize('decrease')}
            className="bg-white p-1 rounded shadow hover:bg-gray-50"
            title="Decrease Size"
          >
            <span className="text-xs font-bold">A-</span>
          </button>
          <button
            onClick={() => handleResize('increase')}
            className="bg-white p-1 rounded shadow hover:bg-gray-50"
            title="Increase Size"
          >
            <span className="text-xs font-bold">A+</span>
          </button>
        </div>
      )}

      {/* Controls */}
      {isSelected && (
        <div className="absolute -top-16 left-0 right-0 flex justify-center space-x-2">
          <button
            onClick={handleRotate}
            className="bg-white p-1 rounded shadow hover:bg-gray-50"
            title="Rotate"
          >
            <RotateCw className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={handleDoubleClick}
            className="bg-white p-1 rounded shadow hover:bg-gray-50"
            title="Edit Text"
          >
            <Edit3 className="h-4 w-4 text-gray-600" />
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

export default TextElement 