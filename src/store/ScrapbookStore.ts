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
  },

  addPhoto: (photo: Photo) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex].photos.push(photo)

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
  },

  addSticker: (sticker: Sticker) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex].stickers.push(sticker)

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
  },

  addTextElement: (textElement: TextElement) => {
    const { currentScrapbook, currentPageIndex } = get()
    if (!currentScrapbook) return

    const updatedPages = [...currentScrapbook.pages]
    updatedPages[currentPageIndex].textElements.push(textElement)

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
    updatedPages[currentPageIndex].backgroundColor = color

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
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

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      },
      currentPageIndex: updatedPages.length - 1
    })
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

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      },
      currentPageIndex: newCurrentPageIndex
    })
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

    set({
      currentScrapbook: {
        ...currentScrapbook,
        pages: updatedPages,
        updatedAt: new Date()
      }
    })
  }
})) 