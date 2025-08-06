import React from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'

const EmbellishmentPanel: React.FC = () => {
  const { addEmbellishment } = useScrapbookStore()

  const embellishments = [
    { id: 'gem1', name: 'Gem 1', iconUrl: '/embellishments/gem1.png' },
    { id: 'gem2', name: 'Gem 2', iconUrl: '/embellishments/gem2.png' },
    { id: 'gem3', name: 'Gem 3', iconUrl: '/embellishments/gem3.png' },
    { id: 'gem4', name: 'Gem 4', iconUrl: '/embellishments/gem4.png' }
  ]

  const handleAddEmbellishment = (embellishment: typeof embellishments[0]) => {
    addEmbellishment({
      id: Date.now().toString(),
      type: 'decoration',
      name: embellishment.name,
      iconUrl: embellishment.iconUrl,
      position: { x: 200, y: 200 },
      rotation: 0,
      size: { width: 80, height: 80 }
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-pixel text-lg text-shadow-pixel" style={{ color: '#3f473b' }}>
        EMBELLISHMENTS
      </h3>
      <div className="p-4 rounded-lg border-2" style={{ backgroundColor: '#f6f1ee', borderColor: '#3f473b' }}>
        <div className="grid grid-cols-2 gap-3">
          {embellishments.map((embellishment) => (
            <button
              key={embellishment.id}
              onClick={() => handleAddEmbellishment(embellishment)}
              className="p-3 border-2 transition-all duration-200 hover:scale-105 flex flex-col items-center space-y-2"
              style={{ 
                backgroundColor: '#f6f1ee', 
                borderColor: '#3f473b'
              }}
            >
              <img
                src={embellishment.iconUrl}
                alt={embellishment.name}
                className="w-8 h-8 object-contain"
              />
              <span className="text-xs font-terminal" style={{ color: '#3f473b' }}>
                {embellishment.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmbellishmentPanel

 