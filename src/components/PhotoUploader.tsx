import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useScrapbookStore } from '../store/ScrapbookStore'

const PhotoUploader: React.FC = () => {
  const { addPhoto } = useScrapbookStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        addPhoto({
          id: Date.now().toString(),
          url: result,
          name: file.name,
          position: { x: 100, y: 100 },
          rotation: 0,
          size: { width: 200, height: 150 }
        })
      }
      reader.readAsDataURL(file)
    })
  }, [addPhoto])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    }
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <div className="scrapp-icon-btn">
          <span className="text-sm">📷</span>
        </div>
        <span className="font-pixel text-xs" style={{ color: '#3f473b' }}>
          PHOTOS
        </span>
      </div>
      
      <div
        {...getRootProps()}
        className={`scrapp-panel p-4 transition-all duration-200 cursor-pointer micro-hover ${
          isDragActive ? 'drop-zone-active' : ''
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <div className="scrapp-icon-btn w-12 h-12 mx-auto mb-3">
            <span className="text-xl">📸</span>
          </div>
          <p className="font-coolvetica text-xs mb-1" style={{ color: '#3f473b' }}>
            {isDragActive ? 'DROP HERE' : 'DRAG & DROP'}
          </p>
          <p className="font-terminal text-xs opacity-75" style={{ color: '#3f473b' }}>
            OR CLICK
          </p>
        </div>
      </div>
    </div>
  )
}

export default PhotoUploader 