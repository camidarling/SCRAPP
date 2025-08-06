import { create } from 'zustand'
import { Scrapbook, ScrapbookPage, Photo, Embellishment, TextElement } from '../types'

interface ScrapbookState {
  currentScrapbook: Scrapbook | null
  currentPageIndex: number
  uploadedPhotos: Photo[]
  selectedElement: Photo | Embellishment | TextElement | null
  isPlaying: boolean
  
  // Actions
  createNewScrapbook: (title: string) => void
  addPage: () => void
  setCurrentPage: (index: number) => void
  addPhoto: (photo: Photo) => void
  updatePhoto: (id: string, updates: Partial<Photo>) => void
  removePhoto: (id: string) => void
  addEmbellishment: (embellishment: Embellishment) => void
  updateEmbellishment: (id: string, updates: Partial<Embellishment>) => void
  removeEmbellishment: (id: string) => void
  addTextElement: (text: TextElement) => void
  updateTextElement: (id: string, updates: Partial<TextElement>) => void
  removeTextElement: (id: string) => void
  setBackgroundColor: (color: string) => void
  setSelectedElement: (element: Photo | Embellishment | TextElement | null) => void
  setUploadedPhotos: (photos: Photo[]) => void
  setIsPlaying: (playing: boolean) => void
  updateElementPosition: (elementId: string, elementType: 'photo' | 'embellishment' | 'text', position: { x: number; y: number }) => void
}

const createInitialPage = (): ScrapbookPage => ({
  id: crypto.randomUUID(),
  photos: [],
  embellishments: [],
  textElements: [],
  backgroundColor: '#faf7f0'
})

export const useScrapbookStore = create<ScrapbookState>((set, get) => ({
  currentScrapbook: null,
  currentPageIndex: 0,
  uploadedPhotos: [],
  selectedElement: null,
  isPlaying: false,

  createNewScrapbook: (title: string) => {
    const newScrapbook: Scrapbook = {
      id: crypto.randomUUID(),
      title,
      pages: [createInitialPage()],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    set({ currentScrapbook: newScrapbook, currentPageIndex: 0 })
  },

  addPage: () => {
    const { currentScrapbook } = get()
    if (!currentScrapbook) return

    const newPage = createInitialPage()
    const updatedScrapbook = {
      ...currentScrapbook,
      pages: [...currentScrapbook.pages, newPage],
      updatedAt: new Date()
    }
    set({ currentScrapbook: updatedScrapbook })
  },

  setCurrentPage: (index: number) => {
    const { currentScrapbook } = get()
    if (!currentScrapbook || index < 0 || index >= currentScrapbook.pages.length) return
    set({ currentPageIndex: index })
  },

  addPhoto: (photo: Photo) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      photos: [...updatedPages[currentPageIndex].photos, photo]
    }

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
  },

  updatePhoto: (id: string, updates: Partial<Photo>) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    const page = updatedPages[currentPageIndex]
    const photoIndex = page.photos.findIndex((p: Photo) => p.id === id)
    
    if (photoIndex !== -1) {
      page.photos[photoIndex] = { ...page.photos[photoIndex], ...updates }
      set({
        currentScrapbook: {
          ...currentScrapbook,
          pages: updatedPages,
          updatedAt: new Date()
        }
      })
    }
  },

  removePhoto: (id: string) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      photos: updatedPages[currentPageIndex].photos.filter((p: Photo) => p.id !== id)
    }

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
  },

  addEmbellishment: (embellishment: Embellishment) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      embellishments: [...updatedPages[currentPageIndex].embellishments, embellishment]
    }

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
  },

  updateEmbellishment: (id: string, updates: Partial<Embellishment>) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    const page = updatedPages[currentPageIndex]
    const embellishmentIndex = page.embellishments.findIndex((e: Embellishment) => e.id === id)
    
    if (embellishmentIndex !== -1) {
      page.embellishments[embellishmentIndex] = { ...page.embellishments[embellishmentIndex], ...updates }
      set({
        currentScrapbook: {
          ...currentScrapbook,
          pages: updatedPages,
          updatedAt: new Date()
        }
      })
    }
  },

  removeEmbellishment: (id: string) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      embellishments: updatedPages[currentPageIndex].embellishments.filter((e: Embellishment) => e.id !== id)
    }

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
  },

  addTextElement: (text: TextElement) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      textElements: [...updatedPages[currentPageIndex].textElements, text]
    }

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
  },

  updateTextElement: (id: string, updates: Partial<TextElement>) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    const page = updatedPages[currentPageIndex]
    const textIndex = page.textElements.findIndex((t: TextElement) => t.id === id)
    
    if (textIndex !== -1) {
      page.textElements[textIndex] = { ...page.textElements[textIndex], ...updates }
      set({
        currentScrapbook: {
          ...currentScrapbook,
          pages: updatedPages,
          updatedAt: new Date()
        }
      })
    }
  },

  removeTextElement: (id: string) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      textElements: updatedPages[currentPageIndex].textElements.filter((t: TextElement) => t.id !== id)
    }

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
  },

  setBackgroundColor: (color: string) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      backgroundColor: color
    }

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
  },

  setSelectedElement: (element) => {
    set({ selectedElement: element })
  },

  setUploadedPhotos: (photos) => {
    set({ uploadedPhotos: photos })
  },

  setIsPlaying: (playing) => {
    set({ isPlaying: playing })
  },

  updateElementPosition: (elementId: string, elementType: 'photo' | 'embellishment' | 'text', position: { x: number; y: number }) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    const page = updatedPages[currentPageIndex]

    if (elementType === 'photo') {
      const photoIndex = page.photos.findIndex((p: Photo) => p.id === elementId)
      if (photoIndex !== -1) {
        page.photos[photoIndex] = { ...page.photos[photoIndex], position }
      }
    } else if (elementType === 'embellishment') {
      const embellishmentIndex = page.embellishments.findIndex((e: Embellishment) => e.id === elementId)
      if (embellishmentIndex !== -1) {
        page.embellishments[embellishmentIndex] = { ...page.embellishments[embellishmentIndex], position }
      }
    } else if (elementType === 'text') {
      const textIndex = page.textElements.findIndex((t: TextElement) => t.id === elementId)
      if (textIndex !== -1) {
        page.textElements[textIndex] = { ...page.textElements[textIndex], position }
      }
    }

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
  }
})) 