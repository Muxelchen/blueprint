# Image Assets

Image files for ImageWidget testing are stored here.

## Adding new image files:

1. **Place file here** (e.g. `placeholder1.jpg`)
2. **Add to MediaService.ts**:
   ```typescript
   {
     id: 'placeholder-1',
     name: 'My Placeholder',
     path: '/src/assets/media/images/placeholder1.jpg',
     fallbackUrl: 'https://unsplash.com/photo.jpg', // Optional
     type: 'image',
     format: 'jpg',
     description: 'Description of the image'
   }
   ```

## Supported formats:
- **JPG** (recommended for photos)
- **PNG** (for graphics with transparency)
- **WebP** (modern browsers, best compression)
- **SVG** (for vector graphics)

## Recommendations:
- **Resolution**: 1200x800 or similar
- **File size**: Under 1MB for fast loading
- **Quality**: 85-95% for JPG

## Usage:
```typescript
import MediaService from '@/utils/MediaService';
const imageUrl = MediaService.getImage('placeholder-1');
``` 