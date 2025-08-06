# 🎨 SCRAPP - Virtual Scrapbooking App

A beautiful, modern web application for creating personalized digital scrapbooks with photos, text, embellishments, and music integration.

## ✨ Features

### 🖼️ **Photo Management**
- Drag & drop photo uploads
- Resize and rotate images
- Add captions to photos
- Multiple photo formats supported

### 📝 **Text Elements**
- Custom text with multiple fonts
- Font options: Coolvetica, Typewriter, Handwriting
- Resizable and draggable text elements
- Color customization

### 💎 **Embellishments**
- Pre-loaded decorative elements
- Drag & drop placement
- Resizable embellishments
- Custom gem and shell decorations

### 🎵 **Music Integration**
- Spotify and Apple Music integration
- Add personalized tracks to pages
- Manual track URL addition
- Platform-specific track suggestions

### 🎨 **Design Tools**
- Custom background colors
- Square aspect ratio canvas
- Clean, minimal interface
- SCRAPP brand aesthetics

### 📤 **Sharing & Export**
- PNG and PDF export
- Social media sharing
- QR code generation
- Asset downloads
- Native mobile sharing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scrapp.git
   cd scrapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### Project Structure

```
scrapp/
├── public/
│   ├── embellishments/     # Decorative elements
│   └── fonts/             # Custom fonts
├── src/
│   ├── components/         # React components
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Utility functions
├── .github/workflows/     # GitHub Actions
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary Green**: `#3f473b` - Main text and borders
- **Secondary Green**: `#9eb492` - Sidebars and panels  
- **Background Cream**: `#f6f1ee` - Main background
- **Text Color**: `#3f473b` - All text content

### Typography
- **Main Font**: Coolvetica (various weights)
- **Caption Options**: Typewriter, Handwriting
- **UI Elements**: Pixel and Terminal fonts

## 🌐 Deployment

### GitHub Pages

This app is configured for automatic deployment to GitHub Pages:

1. **Push to main branch** - Automatic deployment
2. **Access your app** at `https://yourusername.github.io/scrapp/`

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to any static hosting service
# Upload the 'dist' folder
```

## 🔧 Configuration

### Environment Variables
- No environment variables required for basic functionality
- Optional: Add API keys for enhanced music integration

### Customization
- Modify colors in `src/index.css`
- Add new fonts to `public/fonts/`
- Add embellishments to `public/embellishments/`

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Fonts**: Custom Coolvetica family
- **Icons**: Custom pixel art and emojis
- **Framework**: React + Vite + TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand

---

**Made with ❤️ for digital scrapbooking enthusiasts** 