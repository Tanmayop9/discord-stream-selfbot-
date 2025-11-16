import { type Readable } from "node:stream";
import { prepareStream as originalPrepareStream, type PrepareStreamOptions } from './media/newApi.js';
import { processUrl, isYouTubeUrl, type YouTubeOptions } from './youtube.js';

export interface EnhancedPrepareStreamOptions extends Partial<PrepareStreamOptions> {
    /**
     * YouTube-specific options
     */
    youtubeOptions?: YouTubeOptions;
    
    /**
     * Enable verbose logging
     */
    verbose?: boolean;
}

/**
 * Enhanced prepareStream that supports YouTube URLs with robust error handling
 * @param input - YouTube URL, direct video URL, or Readable stream
 * @param options - Stream preparation options with YouTube support
 * @param cancelSignal - Optional abort signal
 * @returns Command and output stream
 */
export async function prepareStreamWithYouTube(
    input: string | Readable,
    options: EnhancedPrepareStreamOptions = {},
    cancelSignal?: AbortSignal
) {
    const { youtubeOptions, verbose = false, ...streamOptions } = options;
    
    // If input is a string and it's a YouTube URL, extract the direct stream URL
    if (typeof input === 'string' && isYouTubeUrl(input)) {
        try {
            if (verbose) {
                console.log('[YouTube] Detected YouTube URL, extracting stream...');
            }
            
            const streamInfo = await processUrl(input, youtubeOptions);
            
            if (verbose || streamInfo.title) {
                console.log(`[YouTube] Video: ${streamInfo.title || 'Unknown'}`);
                if (streamInfo.author) {
                    console.log(`[YouTube] Author: ${streamInfo.author}`);
                }
                if (streamInfo.duration) {
                    const minutes = Math.floor(streamInfo.duration / 60);
                    const seconds = streamInfo.duration % 60;
                    console.log(`[YouTube] Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`);
                }
            }
            
            // Use the extracted URL with enhanced headers
            const enhancedOptions: Partial<PrepareStreamOptions> = {
                ...streamOptions,
                customHeaders: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Connection": "keep-alive",
                    "Referer": "https://www.youtube.com/",
                    ...streamOptions.customHeaders
                }
            };
            
            return originalPrepareStream(streamInfo.url, enhancedOptions, cancelSignal);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[YouTube] Failed to extract stream: ${errorMessage}`);
            throw new Error(`YouTube extraction failed: ${errorMessage}. Please check the URL and try again.`);
        }
    }
    
    // For non-YouTube URLs or streams, use the original function
    if (verbose && typeof input === 'string') {
        console.log('[Stream] Using direct video URL');
    }
    
    return originalPrepareStream(input, streamOptions, cancelSignal);
}
