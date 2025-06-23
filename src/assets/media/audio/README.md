# Audio Assets

Audio files for AudioWidget testing are stored here.

## Adding new audio files:

1. **Place file here** (e.g. `sample1.mp3`)
2. **Add to MediaService.ts**:
   ```typescript
   {
     id: 'sample-1',
     name: 'My Audio File',
     path: '/src/assets/media/audio/sample1.mp3',
     fallbackUrl: 'https://backup-url.com/audio.mp3', // Optional
     type: 'audio',
     format: 'mp3',
     duration: 120, // seconds
     description: 'Description of the audio file'
   }
   ```

## Supported formats:
- **MP3** (recommended for compatibility)
- **WAV** (uncompressed, larger files)
- **OGG** (good compression, not supported in all browsers)

## Usage:
```typescript
import MediaService from '@/utils/MediaService';
const audioUrl = MediaService.getAudio('sample-1');
``` 