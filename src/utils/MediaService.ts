// MediaService - Verwaltet lokale und externe Media-Assets

export interface MediaAsset {
  id: string;
  name: string;
  path: string;
  fallbackUrl?: string;
  type: 'audio' | 'video' | 'image';
  format: string;
  size?: string;
  duration?: number;
  description?: string;
}

class MediaServiceClass {
  // Audio Assets
  private audioAssets: MediaAsset[] = [
    {
      id: 'sample-1',
      name: 'Sample Audio 1',
      path: '/src/assets/media/audio/sample1.mp3',
      fallbackUrl: 'https://www.w3schools.com/html/horse.mp3',
      type: 'audio',
      format: 'mp3',
      duration: 3,
      description: 'Kurzer Audio-Test'
    },
    {
      id: 'sample-2', 
      name: 'Sample Audio 2',
      path: '/src/assets/media/audio/sample2.ogg',
      fallbackUrl: 'https://www.w3schools.com/html/horse.ogg',
      type: 'audio',
      format: 'ogg',
      duration: 3,
      description: 'Audio im OGG Format'
    }
  ];

  // Video Assets
  private videoAssets: MediaAsset[] = [
    {
      id: 'demo-1',
      name: 'Demo Video 1', 
      path: '/src/assets/media/video/demo1.mp4',
      fallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video',
      format: 'mp4',
      duration: 596,
      description: 'Demo Video Big Buck Bunny'
    }
  ];

  // Image Assets
  private imageAssets: MediaAsset[] = [
    {
      id: 'placeholder-1',
      name: 'Placeholder 1',
      path: '/src/assets/media/images/placeholder1.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      type: 'image',
      format: 'jpg',
      description: 'Musik-themed Placeholder'
    },
    {
      id: 'placeholder-2',
      name: 'Placeholder 2', 
      path: '/src/assets/media/images/placeholder2.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300',
      type: 'image',
      format: 'jpg',
      description: 'Piano-themed Placeholder'
    }
  ];

  // Get Audio Asset
  getAudio(id: string): string {
    const asset = this.audioAssets.find(a => a.id === id);
    return asset ? this.getAssetUrl(asset) : this.audioAssets[0].fallbackUrl!;
  }

  // Get Video Asset
  getVideo(id: string): string {
    const asset = this.videoAssets.find(v => v.id === id);
    return asset ? this.getAssetUrl(asset) : this.videoAssets[0].fallbackUrl!;
  }

  // Get Image Asset
  getImage(id: string): string {
    const asset = this.imageAssets.find(i => i.id === id);
    return asset ? this.getAssetUrl(asset) : this.imageAssets[0].fallbackUrl!;
  }

  // Get all assets by type
  getAllAudio(): MediaAsset[] {
    return [...this.audioAssets];
  }

  getAllVideos(): MediaAsset[] {
    return [...this.videoAssets];
  }

  getAllImages(): MediaAsset[] {
    return [...this.imageAssets];
  }

  // Private helper to get asset URL (local or fallback)
  private getAssetUrl(asset: MediaAsset): string {
    // For now, use fallback URLs since no local files exist yet
    // In future: check if local file exists, then use local path
    console.log('📁 MediaService: Using fallback URL for', asset.id, '→', asset.fallbackUrl);
    return asset.fallbackUrl || asset.path;
  }

  // Add new asset
  addAsset(asset: MediaAsset): void {
    switch (asset.type) {
      case 'audio':
        this.audioAssets.push(asset);
        break;
      case 'video':
        this.videoAssets.push(asset);
        break;
      case 'image':
        this.imageAssets.push(asset);
        break;
    }
  }
}

export const MediaService = new MediaServiceClass();
export default MediaService; 