import { type Readable } from "node:stream";
import { prepareStream as originalPrepareStream, type PrepareStreamOptions } from './media/newApi.js';
import { processUrl, isYouTubeUrl } from './youtube.js';

/**
 * Enhanced prepareStream that supports YouTube URLs
 * @param input - YouTube URL, direct video URL, or Readable stream
 * @param options - Stream preparation options
 * @param cancelSignal - Optional abort signal
 * @returns Command and output stream
 */
export async function prepareStreamWithYouTube(
    input: string | Readable,
    options: Partial<PrepareStreamOptions> = {},
    cancelSignal?: AbortSignal
) {
    // If input is a string and it's a YouTube URL, extract the direct stream URL
    if (typeof input === 'string' && isYouTubeUrl(input)) {
        console.log('YouTube URL detected, extracting stream URL...');
        const streamInfo = await processUrl(input);
        
        if (streamInfo.title) {
            console.log(`YouTube video: ${streamInfo.title}`);
        }
        if (streamInfo.duration) {
            console.log(`Duration: ${streamInfo.duration} seconds`);
        }
        
        // Use the extracted URL
        return originalPrepareStream(streamInfo.url, options, cancelSignal);
    }
    
    // For non-YouTube URLs or streams, use the original function
    return originalPrepareStream(input, options, cancelSignal);
}
