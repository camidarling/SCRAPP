export interface Photo {
  id: string
  url: string
  name: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  caption?: string
}

export interface Embellishment {
  id: string
  type: 'sticker' | 'icon' | 'decoration'
  name: string
  modelUrl?: string
  iconUrl?: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  rotation: number
  color?: string
}

export interface TextElement {
  id: string
  content: string
  position: { x: number; y: number }
  fontSize: number
  fontFamily: 'coolvetica' | 'coolvetica-italic' | 'coolvetica-condensed' | 'coolvetica-bold' | 'typewriter' | 'handwriting' | 'pixel' | 'terminal'
  color: string
  rotation: number
}

export interface MusicTrack {
  id: string
  title: string
  artist: string
  platform: 'spotify' | 'apple'
  url: string
  previewUrl?: string
}

export interface ScrapbookPage {
  id: string
  title?: string
  photos: Photo[]
  embellishments: Embellishment[]
  textElements: TextElement[]
  backgroundColor: string
  backgroundImage?: string
  music?: MusicTrack
}

export interface Scrapbook {
  id: string
  title: string
  pages: ScrapbookPage[]
  backgroundMusic?: {
    url: string
    name: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface AudioTrack {
  id: string
  name: string
  url: string
  duration: number
}

export interface BackgroundTheme {
  id: string
  name: string
  color: string
  imageUrl?: string
  previewUrl: string
}

export interface DragItem {
  type: 'photo' | 'embellishment' | 'text'
  data: Photo | Embellishment | TextElement
} 