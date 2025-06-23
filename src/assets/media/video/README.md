# Video Assets

Video files for VideoWidget testing are stored here.

## Adding new video files:

1. **Place file here** (e.g. `demo1.mp4`)
2. **Add to MediaService.ts**:
   ```typescript
   {
     id: 'demo-1',
     name: 'My Demo Video',
     path: '/src/assets/media/video/demo1.mp4',
     fallbackUrl: 'https://backup-url.com/video.mp4', // Optional
     type: 'video',
     format: 'mp4',
     duration: 300, // seconds
     description: 'Description of the video'
   }
   ```

## Supported formats:
- **MP4** (recommended for best compatibility)
- **WebM** (good compression, modern browsers)

## Recommendations:
- **Resolution**: 1280x720 or 1920x1080
- **Bitrate**: 1-5 Mbps for good quality
- **Length**: Under 2 minutes for testing

## Usage:
```typescript
import MediaService from '@/utils/MediaService';
const videoUrl = MediaService.getVideo('demo-1');
``` 