# Media Assets

This folder contains local media files for widget testing.

## Structure

```
src/assets/media/
├── audio/          # Audio files (.mp3, .wav, .ogg)
├── video/          # Video files (.mp4, .webm)
├── images/         # Image files (.jpg, .png, .webp)
└── README.md       # This file
```

## Usage

Media files are loaded through the `MediaService`:

```typescript
import { MediaService } from '@/utils/MediaService';

// Load audio
const audioUrl = MediaService.getAudio('sample.mp3');

// Load video  
const videoUrl = MediaService.getVideo('demo.mp4');

// Load image
const imageUrl = MediaService.getImage('placeholder.jpg');
```

## Adding New Files

1. Copy file to the appropriate subdirectory
2. Add to the corresponding list in `MediaService.ts`
3. Update TypeScript types if necessary

## Supported Formats

- **Audio**: MP3, WAV, OGG
- **Video**: MP4, WebM
- **Images**: JPG, PNG, WebP, SVG 