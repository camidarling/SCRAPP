import { create } from 'zustand'
import { Scrapbook, ScrapbookPage, Photo, Sticker, TextElement } from '../types'

interface ScrapbookState {
  currentScrapbook: Scrapbook | null
  currentPageIndex: number
  selectedElement: string | null
  isInitialized: boolean

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
  exportScrapbook: () => Scrapbook | null
  initializeStore: () => void
}

// Helper function to save scrapbook to localStorage
const saveToLocalStorage = (scrapbook: Scrapbook) => {
  try {
    localStorage.setItem(`scrapp_${scrapbook.id}`, JSON.stringify(scrapbook))
    console.log('Successfully saved scrapbook:', scrapbook.id)
  } catch (error) {
    console.error('Failed to save scrapbook:', error)
  }
}

export const useScrapbookStore = create<ScrapbookState>((set, get) => ({
  currentScrapbook: null,
  currentPageIndex: 0,
  selectedElement: null,
  isInitialized: false,

  initializeStore: () => {
    // Try to load the most recent scrapbook from localStorage
    const keys = Object.keys(localStorage).filter(key => key.startsWith('scrapp_'))
    if (keys.length > 0) {
      // Load the most recent scrapbook
      const mostRecentKey = keys.sort().pop()
      if (mostRecentKey) {
        try {
          const savedData = localStorage.getItem(mostRecentKey)
          if (savedData) {
            const scrapbook = JSON.parse(savedData)
            set({ currentScrapbook: scrapbook, currentPageIndex: 0, isInitialized: true })
            console.log('Loaded existing scrapbook:', scrapbook.id)
            return
          }
        } catch (error) {
          console.error('Failed to load existing scrapbook:', error)
        }
      }
    }
    set({ isInitialized: true })
  },

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
    saveToLocalStorage(newScrapbook)
  },

  addPhoto: (photo: Photo) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      photos: [...updatedPages[currentPageIndex].photos, photo]
    }

    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    saveToLocalStorage(updatedScrapbook)
  },

  addSticker: (sticker: Sticker) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      stickers: [...updatedPages[currentPageIndex].stickers, sticker]
    }

    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    saveToLocalStorage(updatedScrapbook)
  },

  addTextElement: (textElement: TextElement) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      textElements: [...updatedPages[currentPageIndex].textElements, textElement]
    }

    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    saveToLocalStorage(updatedScrapbook)
  },

  setBackgroundColor: (color: string) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      backgroundColor: color
    }

    const updatedScrapbook = {
      ...currentScrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    }

    set({ currentScrapbook: updatedScrapbook })
    saveToLocalStorage(updatedScrapbook)
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
    saveToLocalStorage(updatedScrapbook)
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
    saveToLocalStorage(updatedScrapbook)
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
    saveToLocalStorage(updatedScrapbook)
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
      saveToLocalStorage(updatedScrapbook)
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
    saveToLocalStorage(updatedScrapbook)
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
      saveToLocalStorage(updatedScrapbook)
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
    saveToLocalStorage(updatedScrapbook)
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
      saveToLocalStorage(updatedScrapbook)
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
    saveToLocalStorage(updatedScrapbook)
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
    saveToLocalStorage(updatedScrapbook)
  },

  loadScrapbook: (scrapbookId: string) => {
    const savedScrapbook = localStorage.getItem(`scrapp_${scrapbookId}`)
    if (savedScrapbook) {
      try {
        const scrapbook = JSON.parse(savedScrapbook)
        set({ currentScrapbook: scrapbook, currentPageIndex: 0 })
      } catch (error) {
        console.error('Failed to load scrapbook:', error)
      }
    }
  },

  exportScrapbook: () => {
    const { currentScrapbook } = get()
    return currentScrapbook
  }
})) 