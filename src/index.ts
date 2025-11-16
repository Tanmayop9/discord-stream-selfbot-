export * from './client/index.js';
export * from './media/index.js';
export * as Utils from './utils.js';

// Export YouTube-enhanced prepareStream function
// This replaces the default prepareStream from media/index.js
export { prepareStreamWithYouTube as prepareStream } from './enhancedApi.js';

// Export YouTube utility functions
export { isYouTubeUrl, getYouTubeStreamUrl, processUrl } from './youtube.js';
export type { YouTubeStreamInfo } from './youtube.js';
