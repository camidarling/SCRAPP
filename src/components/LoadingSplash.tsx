import React, { useState, useEffect } from 'react'

interface LoadingSplashProps {
  onComplete: () => void
}

const LoadingSplash: React.FC<LoadingSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setShowLogo(true)
            setTimeout(onComplete, 1000)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 100)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="scrapp-splash">
      <div className="text-center">
        {/* SCRAPP Logo */}
        <div className={`mb-8 transition-all duration-1000 ${showLogo ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="scrapp-logo text-4xl mb-4">
            SCRAPP
          </div>
          <div className="text-sm font-terminal" style={{ color: '#3f473b' }}>
            Virtual Scrapbooking
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-white border-2 rounded-full overflow-hidden" style={{ borderColor: '#3f473b' }}>
          <div 
            className="h-full transition-all duration-300 ease-out"
            style={{ 
              width: `${progress}%`,
              backgroundColor: '#3f473b'
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="mt-4 text-xs font-pixel" style={{ color: '#3f473b' }}>
          {progress < 100 ? 'LOADING...' : 'READY!'}
        </div>

        {/* Pixel Art Decoration */}
        <div className="mt-8 flex justify-center space-x-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 transition-all duration-300"
              style={{ 
                backgroundColor: i < Math.floor(progress / 12.5) ? '#3f473b' : '#9eb492',
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoadingSplash 