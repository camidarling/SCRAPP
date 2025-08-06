import { create } from 'zustand'
import { Scrapbook, ScrapbookPage, Photo, Sticker, TextElement } from '../types'

interface ScrapbookState {
  currentScrapbook: Scrapbook | null
  currentPageIndex: number
  selectedElement: string | null

  // Actions
  createNewScrapbook: (title: string) => void
  addPhoto: (photo: Photo) => void
  addSticker: (sticker: Sticker) => void
  addTextElement: (textElement: TextElement) => void
  setBackgroundColor: (color: string) => void
  setCurrentPage: (pageIndex: number) => void
  addPage: () => void
  deletePage: (pageIndex: number) => void
  updateElementPosition: (elementId: string, elementType: 'photo' | 'sticker' | 'text', position: { x: number; y: number }) => void
  updatePhoto: (photoId: string, updates: Partial<Photo>) => void
  removePhoto: (photoId: string) => void
  updateSticker: (stickerId: string, updates: Partial<Sticker>) => void
  removeSticker: (stickerId: string) => void
  updateTextElement: (textId: string, updates: Partial<TextElement>) => void
  removeTextElement: (textId: string) => void
  setSelectedElement: (element: string | null) => void
  saveScrapbook: () => void
  loadScrapbook: (scrapbookId: string) => void
  checkSavedData: () => void
  exportScrapbook: () => Scrapbook | null
}

export const useScrapbookStore = create<ScrapbookState>((set, get) => ({
  currentScrapbook: null,
  currentPageIndex: 0,
  selectedElement: null,

  createNewScrapbook: (title: string) => {
    const newScrapbook: Scrapbook = {
      id: Date.now().toString(),
      title,
      pages: [
        {
          id: '1',
          photos: [],
          stickers: [],
          textElements: [],
          backgroundColor: '#f6f1ee'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    set({ currentScrapbook: newScrapbook, currentPageIndex: 0 })
    
    // Auto-save to localStorage
    localStorage.setItem(`scrapp_${newScrapbook.id}`, JSON.stringify(newScrapbook))
  },

  addPhoto: (photo: Photo) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex].photos.push(photo)

    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    
    // Auto-save to localStorage with debugging
    console.log('Saving scrapbook with photo:', updatedScrapbook)
    localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
  },

  addSticker: (sticker: Sticker) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex].stickers.push(sticker)

    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    
    // Auto-save to localStorage with debugging
    console.log('Saving scrapbook with sticker:', updatedScrapbook)
    localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
  },

  addTextElement: (textElement: TextElement) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex].textElements.push(textElement)

    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    
    // Auto-save to localStorage with debugging
    console.log('Saving scrapbook with text element:', updatedScrapbook)
    localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
  },

  setBackgroundColor: (color: string) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex].backgroundColor = color

    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    
    // Auto-save to localStorage with debugging
    console.log('Saving scrapbook with background color:', updatedScrapbook)
    localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
  },

  setCurrentPage: (pageIndex: number) => {
    const { currentScrapbook } = get()
    if (!currentScrapbook || pageIndex < 0 || pageIndex >= currentScrapbook.pages.length) return
    set({ currentPageIndex: pageIndex })
  },

  addPage: () => {
    const { currentScrapbook } = get()
    if (!currentScrapbook) return

    const newPage: ScrapbookPage = {
      id: (currentScrapbook.pages.length + 1).toString(),
      photos: [],
      stickers: [],
      textElements: [],
      backgroundColor: '#f6f1ee'
    }

    const updatedPages = [...currentScrapbook.pages, newPage]
    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({
      currentScrapbook: updatedScrapbook,
      currentPageIndex: updatedPages.length - 1
    })
    
    // Auto-save to localStorage
    localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
  },

  deletePage: (pageIndex: number) => {
    const { currentScrapbook } = get()
    if (!currentScrapbook || pageIndex < 0 || pageIndex >= currentScrapbook.pages.length) return

    const updatedPages = currentScrapbook.pages.filter((_, index) => index !== pageIndex)
    
    if (updatedPages.length === 0) {
      // If no pages left, create a new one
      updatedPages.push({
        id: '1',
        photos: [],
        stickers: [],
        textElements: [],
        backgroundColor: '#f6f1ee'
      })
    }

    const newCurrentPageIndex = Math.min(pageIndex, updatedPages.length - 1)
    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({
      currentScrapbook: updatedScrapbook,
      currentPageIndex: newCurrentPageIndex
    })
    
    // Auto-save to localStorage
    localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
  },

  updateElementPosition: (elementId: string, elementType: 'photo' | 'sticker' | 'text', position: { x: number; y: number }) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    const page = updatedPages[currentPageIndex]

    if (elementType === 'photo') {
      const photoIndex = page.photos.findIndex((p: Photo) => p.id === elementId)
      if (photoIndex !== -1) {
        page.photos[photoIndex] = { ...page.photos[photoIndex], position }
      }
    } else if (elementType === 'sticker') {
      const stickerIndex = page.stickers.findIndex((s: Sticker) => s.id === elementId)
      if (stickerIndex !== -1) {
        page.stickers[stickerIndex] = { ...page.stickers[stickerIndex], position }
      }
    } else if (elementType === 'text') {
      const textIndex = page.textElements.findIndex((t: TextElement) => t.id === elementId)
      if (textIndex !== -1) {
        page.textElements[textIndex] = { ...page.textElements[textIndex], position }
      }
    }

    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    
    // Auto-save to localStorage
    localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
  },

  updatePhoto: (photoId: string, updates: Partial<Photo>) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    const page = updatedPages[currentPageIndex]
    const photoIndex = page.photos.findIndex((p: Photo) => p.id === photoId)
    
    if (photoIndex !== -1) {
      page.photos[photoIndex] = { ...page.photos[photoIndex], ...updates }
      
      const updatedScrapbook = {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }

      set({ currentScrapbook: updatedScrapbook })
      
      // Auto-save to localStorage
      localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
    }
  },

  removePhoto: (photoId: string) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    const page = updatedPages[currentPageIndex]
    page.photos = page.photos.filter((p: Photo) => p.id !== photoId)
    
    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    
    // Auto-save to localStorage
    localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
  },

  updateSticker: (stickerId: string, updates: Partial<Sticker>) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    const page = updatedPages[currentPageIndex]
    const stickerIndex = page.stickers.findIndex((s: Sticker) => s.id === stickerId)
    
    if (stickerIndex !== -1) {
      page.stickers[stickerIndex] = { ...page.stickers[stickerIndex], ...updates }
      
      const updatedScrapbook = {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }

      set({ currentScrapbook: updatedScrapbook })
      
      // Auto-save to localStorage
      localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
    }
  },

  removeSticker: (stickerId: string) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    const page = updatedPages[currentPageIndex]
    page.stickers = page.stickers.filter((s: Sticker) => s.id !== stickerId)
    
    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    
    // Auto-save to localStorage
    localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
  },

  updateTextElement: (textId: string, updates: Partial<TextElement>) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    const page = updatedPages[currentPageIndex]
    const textIndex = page.textElements.findIndex((t: TextElement) => t.id === textId)
    
    if (textIndex !== -1) {
      page.textElements[textIndex] = { ...page.textElements[textIndex], ...updates }
      
      const updatedScrapbook = {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }

      set({ currentScrapbook: updatedScrapbook })
      
      // Auto-save to localStorage
      localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
    }
  },

  removeTextElement: (textId: string) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    const page = updatedPages[currentPageIndex]
    page.textElements = page.textElements.filter((t: TextElement) => t.id !== textId)
    
    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    
    // Auto-save to localStorage
    localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
  },

  setSelectedElement: (element: string | null) => {
    set({ selectedElement: element })
  },

  saveScrapbook: () => {
    const { currentScrapbook } = get()
    if (!currentScrapbook) return

    const updatedScrapbook = {
      ...currentScrapbook,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    localStorage.setItem(`scrapp_${currentScrapbook.id}`, JSON.stringify(updatedScrapbook))
  },

  loadScrapbook: (scrapbookId: string) => {
    const savedScrapbook = localStorage.getItem(`scrapp_${scrapbookId}`)
    if (savedScrapbook) {
      try {
        const scrapbook = JSON.parse(savedScrapbook)
        console.log('Loading scrapbook:', scrapbook)
        set({ currentScrapbook: scrapbook, currentPageIndex: 0 })
      } catch (error) {
        console.error('Failed to load scrapbook:', error)
      }
    } else {
      console.log('No saved scrapbook found for ID:', scrapbookId)
    }
  },

  // Method to check what's saved in localStorage
  checkSavedData: () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('scrapp_'))
    console.log('Saved scrapbook keys:', keys)
    keys.forEach(key => {
      const data = localStorage.getItem(key)
      if (data) {
        try {
          const scrapbook = JSON.parse(data)
          console.log(`Scrapbook ${key}:`, scrapbook)
        } catch (error) {
          console.error(`Failed to parse ${key}:`, error)
        }
      }
    })
  },

  exportScrapbook: () => {
    const { currentScrapbook } = get()
    return currentScrapbook
  }
})) 