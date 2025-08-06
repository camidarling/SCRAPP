import React, { useState } from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'

interface MusicTrack {
  id: string
  title: string
  artist: string
  platform: 'spotify' | 'apple'
  url: string
  previewUrl?: string
}

const MusicIntegration: React.FC = () => {
  const { currentScrapbook, currentPageIndex } = useScrapbookStore()
  const [showMusicPanel, setShowMusicPanel] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<'spotify' | 'apple' | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const currentPage = currentScrapbook?.pages[currentPageIndex]

  const handleConnectSpotify = () => {
    // This would integrate with Spotify Web API
    // For now, simulate connection
    setIsConnected(true)
    setSelectedPlatform('spotify')
    console.log('Connecting to Spotify...')
  }

  const handleConnectAppleMusic = () => {
    // This would integrate with Apple Music API
    // For now, simulate connection
    setIsConnected(true)
    setSelectedPlatform('apple')
    console.log('Connecting to Apple Music...')
  }

  const handleAddTrack = (track: MusicTrack) => {
    // Add track to current page
    console.log('Adding track:', track)
    // This would update the store with the track
  }

  const handleManualTrackAdd = () => {
    const trackUrl = prompt('Enter Spotify or Apple Music track URL:')
    if (trackUrl) {
      const track: MusicTrack = {
        id: Date.now().toString(),
        title: 'Custom Track',
        artist: 'Unknown Artist',
        platform: trackUrl.includes('spotify') ? 'spotify' : 'apple',
        url: trackUrl
      }
      handleAddTrack(track)
    }
  }

  return (
    <>
      {/* Music Button */}
      <div className="scrapp-icon-btn" onClick={() => setShowMusicPanel(true)}>
        <span className="text-sm">🎵</span>
      </div>

      {/* Music Panel Modal */}
      {showMusicPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="scrapp-panel p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="scrapp-logo text-lg" style={{ color: '#3f473b' }}>
                MUSIC
              </h3>
              <button
                onClick={() => setShowMusicPanel(false)}
                className="text-2xl font-bold hover:opacity-70"
                style={{ color: '#3f473b' }}
              >
                ×
              </button>
            </div>

            {/* Platform Selection */}
            <div className="space-y-4 mb-6">
              <h4 className="font-pixel text-sm" style={{ color: '#3f473b' }}>
                CONNECT MUSIC:
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleConnectSpotify}
                  className={`scrapp-panel p-4 transition-all duration-200 micro-hover ${
                    selectedPlatform === 'spotify' ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎧</div>
                    <div className="font-pixel text-xs" style={{ color: '#3f473b' }}>
                      SPOTIFY
                    </div>
                    <div className="text-xs font-terminal opacity-75" style={{ color: '#3f473b' }}>
                      {isConnected && selectedPlatform === 'spotify' ? 'CONNECTED' : 'CONNECT'}
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={handleConnectAppleMusic}
                  className={`scrapp-panel p-4 transition-all duration-200 micro-hover ${
                    selectedPlatform === 'apple' ? 'ring-2 ring-pink-500' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🍎</div>
                    <div className="font-pixel text-xs" style={{ color: '#3f473b' }}>
                      APPLE MUSIC
                    </div>
                    <div className="text-xs font-terminal opacity-75" style={{ color: '#3f473b' }}>
                      {isConnected && selectedPlatform === 'apple' ? 'CONNECTED' : 'CONNECT'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Manual Track Addition */}
            <div className="space-y-3 mb-6">
              <h4 className="font-pixel text-sm" style={{ color: '#3f473b' }}>
                ADD TRACK:
              </h4>
              
              <div className="scrapp-panel p-4">
                <button
                  onClick={handleManualTrackAdd}
                  className="scrapp-btn w-full text-xs"
                >
                  ADD TRACK URL
                </button>
                <div className="text-xs font-terminal mt-2 opacity-75" style={{ color: '#3f473b' }}>
                  Paste Spotify or Apple Music link
                </div>
              </div>
            </div>

            {/* Current Page Music */}
            {currentPage?.music && (
              <div className="space-y-3">
                <h4 className="font-pixel text-sm" style={{ color: '#3f473b' }}>
                  PAGE MUSIC:
                </h4>
                
                <div className="scrapp-panel p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-coolvetica text-sm" style={{ color: '#3f473b' }}>
                        {currentPage.music.title}
                      </div>
                      <div className="font-terminal text-xs opacity-75" style={{ color: '#3f473b' }}>
                        {currentPage.music.artist}
                      </div>
                    </div>
                    <div className="scrapp-icon-btn w-6 h-6">
                      <span className="text-xs">▶️</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Tracks (if connected) */}
            {isConnected && (
              <div className="space-y-3">
                <h4 className="font-pixel text-sm" style={{ color: '#3f473b' }}>
                  SUGGESTED TRACKS:
                </h4>
                
                <div className="space-y-2">
                  {[
                    { title: 'Memories', artist: 'Maroon 5', platform: selectedPlatform },
                    { title: 'Photograph', artist: 'Ed Sheeran', platform: selectedPlatform },
                    { title: 'Perfect', artist: 'Ed Sheeran', platform: selectedPlatform }
                  ].map((track, index) => (
                    <div
                      key={index}
                      className="scrapp-panel p-3 cursor-pointer micro-hover"
                      onClick={() => handleAddTrack({
                        id: Date.now().toString() + index,
                        title: track.title,
                        artist: track.artist,
                        platform: track.platform as 'spotify' | 'apple',
                        url: `https://${track.platform}.com/track/${index}`
                      })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-coolvetica text-xs" style={{ color: '#3f473b' }}>
                            {track.title}
                          </div>
                          <div className="font-terminal text-xs opacity-75" style={{ color: '#3f473b' }}>
                            {track.artist}
                          </div>
                        </div>
                        <div className="text-xs opacity-75">
                          {track.platform === 'spotify' ? '🎧' : '🍎'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default MusicIntegration 