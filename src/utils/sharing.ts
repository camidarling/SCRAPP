// Sharing utilities for the scrapbook app

export interface ShareMetadata {
  title: string
  description: string
  imageUrl?: string
  url: string
  timestamp: string
  pageCount?: number
  currentPage?: number
}

export interface ShareAnalytics {
  event: 'share_export' | 'share_social' | 'share_copy' | 'share_qr'
  platform?: string
  shareType: 'page' | 'book'
  timestamp: string
}

// Watermarking utility
export const addWatermark = (canvas: HTMLCanvasElement, text: string = 'Virtual Scrapbook'): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  // Add watermark text
  ctx.save()
  ctx.globalAlpha = 0.3
  ctx.font = '24px Coolvetica'
  ctx.fillStyle = '#3f473b'
  ctx.textAlign = 'center'
  ctx.fillText(text, canvas.width / 2, canvas.height - 20)
  ctx.restore()

  return canvas
}

// Analytics tracking
export const trackShareEvent = (analytics: ShareAnalytics) => {
  // Send to analytics service (Google Analytics, Mixpanel, etc.)
  console.log('Share event:', analytics)
  
  // Example: Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', analytics.event, {
      event_category: 'sharing',
      event_label: analytics.platform,
      value: analytics.shareType === 'book' ? 2 : 1
    })
  }
}

// Generate OpenGraph metadata
export const generateOpenGraphTags = (metadata: ShareMetadata): string => {
  return `
    <meta property="og:title" content="${metadata.title}" />
    <meta property="og:description" content="${metadata.description}" />
    <meta property="og:image" content="${metadata.imageUrl || ''}" />
    <meta property="og:url" content="${metadata.url}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${metadata.title}" />
    <meta name="twitter:description" content="${metadata.description}" />
    <meta name="twitter:image" content="${metadata.imageUrl || ''}" />
  `
}

// Create downloadable zip with assets
export const createAssetsZip = async (assets: any, filename: string): Promise<void> => {
  // This would require a zip library like JSZip
  // For now, we'll create a JSON file with all assets
  const dataStr = JSON.stringify(assets, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `${filename}.json`
  link.click()
}

// Generate short link (placeholder for Firebase Dynamic Links)
export const generateShortLink = async (url: string): Promise<string> => {
  // This would integrate with Firebase Dynamic Links or similar service
  // For now, return the original URL
  return url
}

// Privacy-conscious sharing
export const isPublicSharingEnabled = (): boolean => {
  // Check user preferences for public sharing
  return localStorage.getItem('publicSharingEnabled') === 'true'
}

export const setPublicSharingEnabled = (enabled: boolean): void => {
  localStorage.setItem('publicSharingEnabled', enabled.toString())
}

// Mobile detection for native sharing
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Check if Web Share API is available
export const isWebShareSupported = (): boolean => {
  return 'share' in navigator
}

// Format share text for different platforms
export const formatShareText = (title: string, platform: string): string => {
  const baseText = `Check out my scrapbook: ${title}`
  
  const platformFormats = {
    twitter: baseText.slice(0, 200), // Twitter character limit
    facebook: baseText,
    instagram: baseText.slice(0, 100), // Instagram caption limit
    default: baseText
  }
  
  return platformFormats[platform as keyof typeof platformFormats] || platformFormats.default
}

// Generate QR code data URL
export const generateQRCodeDataURL = (): string => {
  // Placeholder for QR code generation
  return ''
}

// All functions are already exported above 