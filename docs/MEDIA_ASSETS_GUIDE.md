# Media Assets Guide 📁🎵🎬🖼️

Guide for adding and managing media files in the Blueprint project.

## 🗂️ Directory Structure

```
src/assets/media/
├── audio/          # Audio files (.mp3, .wav, .ogg)
├── video/          # Video files (.mp4, .webm)
├── images/         # Image files (.jpg, .png, .webp)
└── README.md
```

## 🚀 Quick Start: Adding New Media Files

### 1. Adding Audio Files

**Step 1:** Copy file
```bash
# Copy audio file to the directory
cp my-music.mp3 src/assets/media/audio/
```

**Step 2:** Update MediaService (`src/utils/MediaService.ts`)
```typescript
// Add new audio file to audioAssets list:
{
  id: 'my-music',
  name: 'My Music',
  path: '/src/assets/media/audio/my-music.mp3',
  fallbackUrl: 'https://backup-url.com/my-music.mp3', // Optional
  type: 'audio',
  format: 'mp3',
  duration: 180, // seconds
  description: 'My cool music'
}
```

**Step 3:** Use in code
```typescript
import MediaService from '@/utils/MediaService';
const audioUrl = MediaService.getAudio('my-music');
```

### 2. Adding Video Files

**Step 1:** Copy file
```bash
cp my-video.mp4 src/assets/media/video/
```

**Step 2:** Update MediaService
```typescript
// Add new video file to videoAssets list:
{
  id: 'my-video',
  name: 'My Video',
  path: '/src/assets/media/video/my-video.mp4',
  fallbackUrl: 'https://backup-url.com/my-video.mp4',
  type: 'video',
  format: 'mp4',
  duration: 300,
  description: 'My awesome video'
}
```

### 3. Adding Image Files

**Step 1:** Copy file
```bash
cp my-image.jpg src/assets/media/images/
```

**Step 2:** Update MediaService
```typescript
// Add new image file to imageAssets list:
{
  id: 'my-image',
  name: 'My Image',
  path: '/src/assets/media/images/my-image.jpg',
  fallbackUrl: 'https://backup-url.com/my-image.jpg',
  type: 'image',
  format: 'jpg',
  description: 'My beautiful image'
}
```

## 📋 Supported Formats

### 🎵 Audio
- **MP3** (recommended) - Best compatibility
- **WAV** - Uncompressed, large files
- **OGG** - Good compression, not all browsers

### 🎬 Video
- **MP4** (recommended) - Best compatibility
- **WebM** - Good compression, modern browsers

### 🖼️ Images
- **JPG** (recommended) - For photos
- **PNG** - For graphics with transparency
- **WebP** - Best compression, modern browsers
- **SVG** - For vector graphics

## 🔧 MediaService API

### Loading Audio
```typescript
// Single audio file
const audioUrl = MediaService.getAudio('sample-1');

// All audio files
const allAudios = MediaService.getAllAudio();
```

### Loading Video
```typescript
// Single video
const videoUrl = MediaService.getVideo('demo-1');

// All videos
const allVideos = MediaService.getAllVideos();
```

### Loading Images
```typescript
// Single image
const imageUrl = MediaService.getImage('placeholder-1');

// All images
const allImages = MediaService.getAllImages();
```

### Programmatically adding new assets
```typescript
MediaService.addAsset({
  id: 'new-audio',
  name: 'New Audio File',
  path: '/src/assets/media/audio/new-audio.mp3',
  type: 'audio',
  format: 'mp3',
  duration: 120
});
```

## 🎯 Recommendations

### File Size
- **Audio**: < 10 MB per file
- **Video**: < 100 MB per file
- **Images**: < 5 MB per file

### Resolution
- **Videos**: 1280x720 (HD) or 1920x1080 (Full HD)
- **Images**: 1200x800 or similar

### Quality
- **Audio**: 128-320 kbps
- **Video**: 1-5 Mbps bitrate
- **Images**: 85-95% JPG quality

## 🛡️ Fallback System

The MediaService uses a fallback system:

1. **Local file** is tried first
2. **Fallback URL** is used when local file is not available
3. **Default placeholder** as last option

```typescript
// Example with fallback
{
  id: 'my-file',
  path: '/src/assets/media/audio/my-file.mp3',
  fallbackUrl: 'https://reliable-cdn.com/my-file.mp3',
  // If both fail, default fallback will be used
}
```

## 🧪 Testing

After adding new media files:

1. **Restart dev server**:
   ```bash
   npm run dev
   ```

2. **Open TestWidgets page**: 
   - `http://localhost:3010/` (or current port)
   - Navigate to TestWidgets

3. **Check browser console**:
   - `F12` → Console
   - Look for 🎵/🎬/🖼️ messages

4. **Test widgets**:
   - AudioWidget: Click play button
   - VideoWidget: Click play button
   - ImageWidget: Check image display

## 🔍 Troubleshooting

### File not loading
1. Check file path in MediaService
2. Verify file exists in correct directory
3. Check browser console for 404 errors
4. Ensure correct file format/extension

### Performance issues
1. Reduce file size
2. Use appropriate format (WebP for images, MP4 for videos)
3. Add loading states
4. Consider lazy loading

### Browser compatibility
1. Provide multiple formats (MP4 + WebM for videos)
2. Use fallback URLs for critical media
3. Test across different browsers
4. Consider polyfills for older browsers

## 📝 Best Practices

### Organization
- Use descriptive file names
- Group related files in subdirectories
- Maintain consistent naming conventions
- Document large media collections

### Performance
- Optimize media files before adding
- Use appropriate compression
- Consider progressive loading
- Implement lazy loading for large collections

### Accessibility
- Always provide alt text for images
- Include captions for videos
- Provide transcripts for audio
- Ensure keyboard navigation works

---

*Keep your media organized and optimized for the best user experience! 🚀* 