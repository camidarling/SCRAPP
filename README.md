# Virtual Scrapbooking App

A modern, web-based virtual scrapbooking application that allows users to create personalized digital scrapbooks with photos, text, 3D embellishments, and background music.

## Features

### Core Features (MVP)
- ✅ **Photo Upload**: Drag and drop or file picker for personal photos
- ✅ **Interactive Canvas**: Drag and drop images onto scrapbook pages
- ✅ **Text Captions**: Add custom text captions per photo or page
- ✅ **3D Embellishments**: Cabinet of preloaded 3D decorations (stickers, icons, doodads)
- ✅ **Background Themes**: Change page backgrounds with preset themes or custom colors
- ✅ **Background Music**: Add background songs per scrapbook (upload or select from presets)
- ✅ **Page Navigation**: Flip to next/previous page to continue building
- ✅ **Flipbook View**: View entire scrapbook as a flipbook to revisit memories

### Technical Features
- 🎨 **Modern UI**: Beautiful, intuitive interface with TailwindCSS
- 🎭 **3D Elements**: Three.js integration for lightweight 3D embellishments
- 🎵 **Audio Integration**: Tone.js for rich audio controls
- 📱 **Responsive Design**: Works on desktop and tablet devices
- ⚡ **Performance**: Optimized for smooth interactions
- 🎯 **State Management**: Zustand for efficient state management

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS with custom scrapbook theme
- **3D Graphics**: Three.js + React Three Fiber
- **State Management**: Zustand
- **File Uploads**: React Dropzone
- **Audio**: Tone.js
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd virtual-scrapbooking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/           # React components
│   ├── ScrapbookEditor.tsx    # Main editor interface
│   ├── ScrapbookCanvas.tsx    # Canvas for page editing
│   ├── PhotoUploader.tsx      # Photo upload component
│   ├── PhotoElement.tsx       # Individual photo component
│   ├── EmbellishmentPanel.tsx # 3D embellishments panel
│   ├── EmbellishmentElement.tsx # Individual embellishment
│   ├── TextElement.tsx        # Text element component
│   ├── Toolbar.tsx           # Editing tools
│   ├── AudioControls.tsx     # Music controls
│   ├── PageNavigator.tsx     # Page navigation
│   └── AudioProvider.tsx     # Audio context provider
├── store/               # State management
│   ├── ScrapbookStore.ts     # Zustand store
│   └── ScrapbookProvider.tsx # Context provider
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Usage

### Creating a Scrapbook
1. Click "Start New Scrapbook" on the welcome screen
2. Enter a title for your scrapbook
3. Begin adding photos and elements

### Adding Photos
1. Use the photo uploader in the left sidebar
2. Drag and drop images or click to select files
3. Photos will appear on the canvas and can be moved, resized, and rotated

### Adding Text
1. Click "Add Text" in the toolbar
2. Enter your text content
3. Text elements can be moved, rotated, and styled

### Adding Embellishments
1. Browse the embellishments panel
2. Click on any decoration to add it to the page
3. Embellishments can be moved, rotated, and deleted

### Changing Backgrounds
1. Use the background color palette in the toolbar
2. Choose from preset colors or add custom colors

### Adding Music
1. Click the music button in the header
2. Select from preset tracks or upload your own
3. Use play/pause controls to manage playback

### Navigating Pages
1. Use the page navigator in the header
2. Click the + button to add new pages
3. Use arrow buttons to move between pages

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Embellishments**: Add to the `embellishments` array in `EmbellishmentPanel.tsx`
2. **New Background Themes**: Add to the `backgroundColors` array in `Toolbar.tsx`
3. **New Audio Tracks**: Add to the `sampleTracks` array in `AudioControls.tsx`

### State Management

The app uses Zustand for state management with the following key stores:
- `currentScrapbook`: Current scrapbook data
- `currentPageIndex`: Active page index
- `uploadedPhotos`: List of uploaded photos
- `selectedElement`: Currently selected element
- `isPlaying`: Audio playback state

## Future Enhancements

- [ ] **Export Features**: PDF export, image export
- [ ] **Collaboration**: Real-time collaboration
- [ ] **Templates**: Pre-made scrapbook templates
- [ ] **Advanced 3D**: More complex 3D models and animations
- [ ] **Cloud Storage**: Save scrapbooks to cloud
- [ ] **Mobile App**: React Native version
- [ ] **AI Features**: Auto-captioning, style suggestions
- [ ] **Social Features**: Share scrapbooks, community gallery

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js for 3D graphics
- TailwindCSS for styling
- Lucide for beautiful icons
- Framer Motion for animations 