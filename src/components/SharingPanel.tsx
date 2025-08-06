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
    if (!canvasRef.current) return
    
    setIsExporting(true)
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: currentPage?.backgroundColor || '#f6f1ee',
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      // Add watermark
      const watermarkedCanvas = addWatermark(canvas, 'Virtual Scrapbook')
      
      const link = document.createElement('a')
      link.download = `scrapbook-${shareType}-${Date.now()}.png`
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
    if (!canvasRef.current) return
    
    setIsExporting(true)
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: currentPage?.backgroundColor || '#f6f1ee',
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      // Add watermark
      const watermarkedCanvas = addWatermark(canvas, 'Virtual Scrapbook')
      
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

      pdf.save(`scrapbook-${shareType}-${Date.now()}.pdf`)
      
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
    // Create a zip file with all assets
    const assets = {
      photos: currentPage?.photos || [],
      text: currentPage?.textElements || [],
      metadata: {
        title: currentScrapbook?.title,
        page: currentPageIndex + 1,
        date: new Date().toISOString()
      }
    }
    
    const dataStr = JSON.stringify(assets, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `scrapbook-assets-${Date.now()}.json`
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
      await navigator.clipboard.writeText(window.location.href)
      
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
                `
              }}
            >
              {/* Render page content for export */}
              {currentPage.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="absolute"
                  style={{
                    left: photo.position.x,
                    top: photo.position.y,
                    width: photo.size.width,
                    height: photo.size.height,
                    transform: `rotate(${photo.rotation}deg)`
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-xs">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
              
              {currentPage.textElements.map((text) => (
                <div
                  key={text.id}
                  className="absolute"
                  style={{
                    left: text.position.x,
                    top: text.position.y,
                    fontSize: text.fontSize,
                    color: text.color,
                    transform: `rotate(${text.rotation}deg)`
                  }}
                >
                  {text.content}
                </div>
              ))}
              
              {currentPage.embellishments.map((embellishment) => (
                <div
                  key={embellishment.id}
                  className="absolute"
                  style={{
                    left: embellishment.position.x,
                    top: embellishment.position.y,
                    width: embellishment.size.width,
                    height: embellishment.size.height,
                    transform: `rotate(${embellishment.rotation}deg)`
                  }}
                >
                  <img
                    src={embellishment.iconUrl}
                    alt={embellishment.name}
                    className="w-full h-full object-contain"
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