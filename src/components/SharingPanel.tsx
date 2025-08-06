import React, { useState, useRef } from 'react'
import { useScrapbookStore } from '../store/ScrapbookStore'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { 
  trackShareEvent, 
  addWatermark, 
  formatShareText, 
  isMobileDevice, 
  isWebShareSupported 
} from '../utils/sharing'

interface SharingPanelProps {
  isOpen: boolean
  onClose: () => void
}

const SharingPanel: React.FC<SharingPanelProps> = ({ isOpen, onClose }) => {
  const { currentScrapbook, currentPageIndex } = useScrapbookStore()
  const [isExporting, setIsExporting] = useState(false)
  const [shareType, setShareType] = useState<'page' | 'book'>('page')
  const canvasRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const currentPage = currentScrapbook?.pages[currentPageIndex]

  const exportAsPNG = async () => {
    if (!canvasRef.current || !currentPage) return
    
    setIsExporting(true)
    try {
      // Wait a bit for images to load
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: currentPage.backgroundColor || '#f6f1ee',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: 800,
        logging: true, // Enable logging to debug
        onclone: (clonedDoc) => {
          // Ensure all images are loaded in the cloned document
          const images = clonedDoc.querySelectorAll('img')
          images.forEach(img => {
            if (img.complete === false) {
              console.log('Image not loaded:', img.src)
            }
          })
        }
      })
      
      // Add watermark
      const watermarkedCanvas = addWatermark(canvas, 'SCRAPP')
      
      const link = document.createElement('a')
      link.download = `scrapp-${shareType}-${Date.now()}.png`
      link.href = watermarkedCanvas.toDataURL()
      link.click()
      
      // Track analytics
      trackShareEvent({
        event: 'share_export',
        shareType,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsPDF = async () => {
    if (!canvasRef.current || !currentPage) return
    
    setIsExporting(true)
    try {
      // Wait a bit for images to load
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: currentPage.backgroundColor || '#f6f1ee',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: 800,
        logging: true, // Enable logging to debug
        onclone: (clonedDoc) => {
          // Ensure all images are loaded in the cloned document
          const images = clonedDoc.querySelectorAll('img')
          images.forEach(img => {
            if (img.complete === false) {
              console.log('Image not loaded:', img.src)
            }
          })
        }
      })
      
      // Add watermark
      const watermarkedCanvas = addWatermark(canvas, 'SCRAPP')
      
      const imgData = watermarkedCanvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`scrapp-${shareType}-${Date.now()}.pdf`)
      
      // Track analytics
      trackShareEvent({
        event: 'share_export',
        shareType,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('PDF export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const downloadAssets = () => {
    if (!currentScrapbook || !currentPage) return
    
    // Create a comprehensive assets object
    const assets = {
      scrapbook: {
        title: currentScrapbook.title,
        id: currentScrapbook.id,
        createdAt: currentScrapbook.createdAt,
        updatedAt: currentScrapbook.updatedAt,
        totalPages: currentScrapbook.pages.length
      },
      currentPage: {
        index: currentPageIndex,
        id: currentPage.id,
        backgroundColor: currentPage.backgroundColor,
        photos: currentPage.photos.map(photo => ({
          id: photo.id,
          name: photo.name,
          url: photo.url,
          position: photo.position,
          size: photo.size,
          rotation: photo.rotation,
          caption: photo.caption
        })),
        stickers: currentPage.stickers.map(sticker => ({
          id: sticker.id,
          name: sticker.name,
          type: sticker.type,
          iconUrl: sticker.iconUrl,
          position: sticker.position,
          size: sticker.size,
          rotation: sticker.rotation
        })),
        textElements: currentPage.textElements.map(text => ({
          id: text.id,
          content: text.content,
          position: text.position,
          fontSize: text.fontSize,
          fontFamily: text.fontFamily,
          color: text.color,
          rotation: text.rotation
        }))
      },
      exportInfo: {
        exportedAt: new Date().toISOString(),
        exportType: shareType,
        version: '1.0.0'
      }
    }
    
    const dataStr = JSON.stringify(assets, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `scrapp-assets-${currentScrapbook.title}-${Date.now()}.json`
    link.click()
  }

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(formatShareText(currentScrapbook?.title || 'My Scrapbook', platform))
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      instagram: `https://www.instagram.com/` // Instagram doesn't support direct sharing
    }
    
    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank')
      
      // Track analytics
      trackShareEvent({
        event: 'share_social',
        platform,
        shareType,
        timestamp: new Date().toISOString()
      })
    }
  }

  const copyToClipboard = async () => {
    try {
      const shareText = `Check out my scrapbook "${currentScrapbook?.title || 'My Scrapbook'}" created with SCRAPP! ${window.location.href}`
      await navigator.clipboard.writeText(shareText)
      
      // Track analytics
      trackShareEvent({
        event: 'share_copy',
        shareType,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const generateQRCode = () => {
    // Simple QR code generation using a service
    const url = encodeURIComponent(window.location.href)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${url}`
    window.open(qrUrl, '_blank')
    
    // Track analytics
    trackShareEvent({
      event: 'share_qr',
      shareType,
      timestamp: new Date().toISOString()
    })
  }

  const useNativeShare = async () => {
    if (isWebShareSupported()) {
      try {
        await navigator.share({
          title: currentScrapbook?.title || 'My Scrapbook',
          text: formatShareText(currentScrapbook?.title || 'My Scrapbook', 'default'),
          url: window.location.href
        })
        
        // Track analytics
        trackShareEvent({
          event: 'share_social',
          platform: 'native',
          shareType,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Native share failed:', error)
      }
    } else {
      // Fallback to copy link
      copyToClipboard()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#f6f1ee', borderColor: '#3f473b' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-pixel text-lg" style={{ color: '#3f473b' }}>
            SHARE SCRAPBOOK
          </h3>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-70"
            style={{ color: '#3f473b' }}
          >
            ×
          </button>
        </div>

        {/* Share Type Selection */}
        <div className="mb-4">
          <label className="font-terminal text-sm mb-2 block" style={{ color: '#3f473b' }}>
            SHARE TYPE:
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setShareType('page')}
              className={`px-3 py-2 rounded border-2 text-sm font-pixel transition-all ${
                shareType === 'page' 
                  ? 'text-white' 
                  : 'text-gray-600'
              }`}
              style={{ 
                backgroundColor: shareType === 'page' ? '#3f473b' : '#f6f1ee',
                borderColor: '#3f473b'
              }}
            >
              CURRENT PAGE
            </button>
            <button
              onClick={() => setShareType('book')}
              className={`px-3 py-2 rounded border-2 text-sm font-pixel transition-all ${
                shareType === 'book' 
                  ? 'text-white' 
                  : 'text-gray-600'
              }`}
              style={{ 
                backgroundColor: shareType === 'book' ? '#3f473b' : '#f6f1ee',
                borderColor: '#3f473b'
              }}
            >
              FULL BOOK
            </button>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-3 mb-6">
          <h4 className="font-pixel text-sm" style={{ color: '#3f473b' }}>
            EXPORT OPTIONS:
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={exportAsPNG}
              disabled={isExporting}
              className="p-3 border-2 rounded text-sm font-pixel transition-all hover:scale-105 disabled:opacity-50"
              style={{ 
                backgroundColor: '#3f473b', 
                color: '#f6f1ee',
                borderColor: '#3f473b'
              }}
            >
              {isExporting ? 'EXPORTING...' : 'SAVE AS PNG'}
            </button>
            
            <button
              onClick={exportAsPDF}
              disabled={isExporting}
              className="p-3 border-2 rounded text-sm font-pixel transition-all hover:scale-105 disabled:opacity-50"
              style={{ 
                backgroundColor: '#3f473b', 
                color: '#f6f1ee',
                borderColor: '#3f473b'
              }}
            >
              {isExporting ? 'EXPORTING...' : 'SAVE AS PDF'}
            </button>
            
            <button
              onClick={downloadAssets}
              className="p-3 border-2 rounded text-sm font-pixel transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#9eb492', 
                color: '#3f473b',
                borderColor: '#3f473b'
              }}
            >
              DOWNLOAD ASSETS
            </button>
            
            <button
              onClick={copyToClipboard}
              className="p-3 border-2 rounded text-sm font-pixel transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#9eb492', 
                color: '#3f473b',
                borderColor: '#3f473b'
              }}
            >
              COPY LINK
            </button>
          </div>
        </div>

        {/* Social Media Sharing */}
        <div className="space-y-3 mb-6">
          <h4 className="font-pixel text-sm" style={{ color: '#3f473b' }}>
            SOCIAL SHARING:
          </h4>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => shareToSocial('facebook')}
              className="p-3 border-2 rounded text-sm font-pixel transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#1877f2', 
                color: 'white',
                borderColor: '#3f473b'
              }}
            >
              FACEBOOK
            </button>
            
            <button
              onClick={() => shareToSocial('twitter')}
              className="p-3 border-2 rounded text-sm font-pixel transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#1da1f2', 
                color: 'white',
                borderColor: '#3f473b'
              }}
            >
              TWITTER
            </button>
            
            <button
              onClick={useNativeShare}
              className="p-3 border-2 rounded text-sm font-pixel transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#3f473b', 
                color: '#f6f1ee',
                borderColor: '#3f473b'
              }}
            >
              {isMobileDevice() ? 'NATIVE SHARE' : 'COPY LINK'}
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div className="space-y-3">
          <h4 className="font-pixel text-sm" style={{ color: '#3f473b' }}>
            QR CODE:
          </h4>
          
          <button
            onClick={generateQRCode}
            className="w-full p-3 border-2 rounded text-sm font-pixel transition-all hover:scale-105"
            style={{ 
              backgroundColor: '#9eb492', 
              color: '#3f473b',
              borderColor: '#3f473b'
            }}
          >
            GENERATE QR CODE
          </button>
        </div>

        {/* Hidden canvas for export */}
        <div ref={canvasRef} className="hidden">
          {currentPage && (
            <div 
              className="w-800 h-800 relative"
              style={{ 
                backgroundColor: currentPage.backgroundColor || '#f6f1ee',
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(158, 180, 146, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(158, 180, 146, 0.1) 0%, transparent 50%)
                `,
                width: '800px',
                height: '800px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Debug info */}
              <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '12px', color: 'red', zIndex: 1000 }}>
                Photos: {currentPage.photos.length} | Stickers: {currentPage.stickers.length} | Text: {currentPage.textElements.length}
              </div>
              
              {/* Render photos for export */}
              {currentPage.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="absolute"
                  style={{
                    left: photo.position.x,
                    top: photo.position.y,
                    width: photo.size.width,
                    height: photo.size.height,
                    transform: `rotate(${photo.rotation}deg)`,
                    position: 'absolute'
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    crossOrigin="anonymous"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-xs">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Render text elements for export */}
              {currentPage.textElements.map((text) => (
                <div
                  key={text.id}
                  className="absolute"
                  style={{
                    left: text.position.x,
                    top: text.position.y,
                    fontSize: text.fontSize,
                    color: text.color,
                    transform: `rotate(${text.rotation}deg)`,
                    fontFamily: text.fontFamily === 'coolvetica' ? 'Coolvetica' : 
                               text.fontFamily === 'typewriter' ? 'Old Typewriter' : 
                               text.fontFamily === 'handwriting' ? 'Sam Handwriting' : 'Coolvetica',
                    position: 'absolute'
                  }}
                >
                  {text.content}
                </div>
              ))}
              
              {/* Render stickers for export */}
              {currentPage.stickers.map((sticker) => (
                <div
                  key={sticker.id}
                  className="absolute"
                  style={{
                    left: sticker.position.x,
                    top: sticker.position.y,
                    width: sticker.size.width,
                    height: sticker.size.height,
                    transform: `rotate(${sticker.rotation}deg)`,
                    position: 'absolute'
                  }}
                >
                  <img
                    src={sticker.iconUrl}
                    alt={sticker.name}
                    className="w-full h-full object-contain"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    crossOrigin="anonymous"
                    onError={() => console.error('Sticker image failed to load:', sticker.iconUrl)}
                    onLoad={() => console.log('Sticker image loaded:', sticker.iconUrl)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SharingPanel 