import React, { useState } from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'

const Toolbar: React.FC = () => {
  const { addTextElement, setBackgroundColor } = useScrapbookStore()
  const [textContent, setTextContent] = useState('')
  const [selectedFont, setSelectedFont] = useState<'coolvetica' | 'typewriter' | 'handwriting'>('coolvetica')
  const [showTextInput, setShowTextInput] = useState(false)

  const fontOptions = [
    { value: 'coolvetica', label: 'Coolvetica' },
    { value: 'typewriter', label: 'Typewriter' },
    { value: 'handwriting', label: 'Handwriting' }
  ]

  const handleAddText = () => {
    if (textContent.trim()) {
      addTextElement({
        id: Date.now().toString(),
        content: textContent,
        position: { x: 150, y: 150 },
        fontSize: 16,
        fontFamily: selectedFont,
        color: '#3f473b',
        rotation: 0
      })
      setTextContent('')
      setShowTextInput(false)
    }
  }

  const handleBackgroundChange = (color: string) => {
    setBackgroundColor(color)
  }

  return (
    <div className="space-y-4">
      {/* Text Tool */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="scrapp-icon-btn">
            <span className="text-sm">T</span>
          </div>
          <span className="font-pixel text-xs" style={{ color: '#3f473b' }}>
            TEXT
          </span>
        </div>
        
        <div className="scrapp-panel p-3">
          {!showTextInput ? (
            <button
              onClick={() => setShowTextInput(true)}
              className="scrapp-btn w-full text-xs"
            >
              ADD TEXT
            </button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter text..."
                className="w-full p-2 text-xs border-2 rounded resize-none"
                style={{ 
                  backgroundColor: '#f6f1ee', 
                  borderColor: '#3f473b',
                  color: '#3f473b'
                }}
                rows={2}
                autoFocus
              />
              
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value as any)}
                className="w-full p-1 text-xs border-2 rounded"
                style={{ 
                  backgroundColor: '#f6f1ee', 
                  borderColor: '#3f473b',
                  color: '#3f473b'
                }}
              >
                {fontOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <div className="flex space-x-1">
                <button
                  onClick={handleAddText}
                  className="scrapp-btn flex-1 text-xs"
                >
                  ADD
                </button>
                <button
                  onClick={() => setShowTextInput(false)}
                  className="scrapp-btn flex-1 text-xs"
                  style={{ backgroundColor: '#9eb492' }}
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background Colors */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="scrapp-icon-btn">
            <span className="text-sm">🎨</span>
          </div>
          <span className="font-pixel text-xs" style={{ color: '#3f473b' }}>
            BG
          </span>
        </div>
        
        <div className="scrapp-panel p-3">
          <div className="grid grid-cols-3 gap-1 mb-2">
            {[
              { name: 'Cream', color: '#f6f1ee' },
              { name: 'Sage', color: '#9eb492' },
              { name: 'Forest', color: '#3f473b' },
              { name: 'Pink', color: '#ffb3ba' },
              { name: 'Blue', color: '#bae1ff' },
              { name: 'Yellow', color: '#ffffba' }
            ].map((bg) => (
              <button
                key={bg.color}
                onClick={() => handleBackgroundChange(bg.color)}
                className="w-8 h-8 border-2 transition-all duration-200 hover:scale-110 active:scale-95"
                style={{ 
                  backgroundColor: bg.color, 
                  borderColor: '#3f473b',
                  cursor: 'pointer'
                }}
                title={bg.name}
              />
            ))}
          </div>
          
          {/* Custom Color Picker */}
          <div className="flex items-center space-x-2">
            <input
              type="color"
              onChange={(e) => handleBackgroundChange(e.target.value)}
              className="w-6 h-6 border-2 rounded cursor-pointer appearance-none"
              style={{ 
                borderColor: '#3f473b',
                backgroundColor: '#f6f1ee'
              }}
              title="Custom color"
            />
            <span className="text-xs font-terminal" style={{ color: '#3f473b' }}>
              CUSTOM
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Toolbar 