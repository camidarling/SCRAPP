import React from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'

const StickerPanel: React.FC = () => {
  const { addSticker } = useScrapbookStore()

  const stickers = [
    { id: 'gem1', name: 'Gem 1', type: 'gem' as const, iconUrl: '/embellishments/gem1.png' },
    { id: 'gem2', name: 'Gem 2', type: 'gem' as const, iconUrl: '/embellishments/gem2.png' },
    { id: 'gem3', name: 'Gem 3', type: 'gem' as const, iconUrl: '/embellishments/gem3.png' },
    { id: 'gem4', name: 'Gem 4', type: 'gem' as const, iconUrl: '/embellishments/gem4.png' },
    { id: 'gem5', name: 'Gem 5', type: 'gem' as const, iconUrl: '/embellishments/gem5.png' },
    { id: 'shell1', name: 'Shell 1', type: 'shell' as const, iconUrl: '/embellishments/shell1.png' },
    { id: 'shell2', name: 'Shell 2', type: 'shell' as const, iconUrl: '/embellishments/shell2.png' }
  ]

  const handleAddSticker = (sticker: typeof stickers[0]) => {
    addSticker({
      id: Date.now().toString(),
      type: sticker.type,
      name: sticker.name,
      iconUrl: sticker.iconUrl,
      position: { x: 200, y: 200 },
      size: { width: 60, height: 60 },
      rotation: 0
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <div className="scrapp-icon-btn">
          <span className="text-sm">💎</span>
        </div>
        <span className="font-pixel text-xs" style={{ color: '#3f473b' }}>
          STICKERS
        </span>
      </div>
      
      <div className="scrapp-panel p-3">
        <div className="grid grid-cols-2 gap-2">
          {stickers.map((sticker) => (
            <button
              key={sticker.id}
              onClick={() => handleAddSticker(sticker)}
              className="scrapp-panel p-2 transition-all duration-200 micro-hover"
              title={sticker.name}
            >
              <img
                src={sticker.iconUrl}
                alt={sticker.name}
                className="w-full h-8 object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StickerPanel

 