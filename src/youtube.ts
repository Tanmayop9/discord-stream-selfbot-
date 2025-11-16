import ytdl from 'ytdl-core';

export interface YouTubeStreamInfo {
    url: string;
    isYouTube: boolean;
    title?: string;
    duration?: number;
    thumbnail?: string;
    author?: string;
}

export interface YouTubeOptions {
    maxRetries?: number;
    retryDelay?: number;
    quality?: 'highest' | 'lowest' | 'highestaudio' | 'lowestaudio' | 'highestvideo' | 'lowestvideo';
    preferFormat?: 'any' | 'mp4' | 'webm';
}

const DEFAULT_OPTIONS: Required<YouTubeOptions> = {
    maxRetries: 3,
    retryDelay: 1000,
    quality: 'highest',
    preferFormat: 'any'
};

/**
 * Sleep utility for retries
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if a URL is a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
    try {
        return ytdl.validateURL(url);
    } catch {
        return false;
    }
}

/**
 * Extract the best quality stream URL from a YouTube URL with retry logic
 * @param youtubeUrl - YouTube video URL
 * @param options - YouTube extraction options
 * @returns Direct stream URL and video info
 */
export async function getYouTubeStreamUrl(
    youtubeUrl: string, 
    options: YouTubeOptions = {}
): Promise<YouTubeStreamInfo> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    if (!ytdl.validateURL(youtubeUrl)) {
        throw new Error('Invalid YouTube URL. Please provide a valid YouTube video URL.');
    }

    let lastError: Error | null = null;
    
    // Retry logic for robustness
    for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
        try {
            const info = await ytdl.getInfo(youtubeUrl, {
                requestOptions: {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept-Language': 'en-US,en;q=0.9'
                    }
                }
            });
            
            // Try to get format with both video and audio first
            let format;
            try {
                format = ytdl.chooseFormat(info.formats, { 
                    quality: opts.quality,
                    filter: (format) => {
                        const hasVideoAndAudio = format.hasVideo && format.hasAudio;
                        if (opts.preferFormat === 'any') return hasVideoAndAudio;
                        return hasVideoAndAudio && format.container === opts.preferFormat;
                    }
                });
            } catch {
                // Fallback: try without container preference
                format = ytdl.chooseFormat(info.formats, { 
                    quality: opts.quality,
                    filter: (format) => format.hasVideo && format.hasAudio
                });
            }

            if (!format || !format.url) {
                throw new Error('No suitable format found. The video might be age-restricted, private, or unavailable in your region.');
            }

            return {
                url: format.url,
                isYouTube: true,
                title: info.videoDetails.title,
                duration: parseInt(info.videoDetails.lengthSeconds),
                thumbnail: info.videoDetails.thumbnails?.[0]?.url,
                author: info.videoDetails.author?.name
            };
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            
            if (attempt < opts.maxRetries) {
                console.log(`YouTube extraction attempt ${attempt} failed, retrying in ${opts.retryDelay}ms...`);
                await sleep(opts.retryDelay);
            }
        }
    }

    // All retries failed
    const errorMessage = lastError?.message || 'Unknown error';
    throw new Error(`Failed to extract YouTube stream after ${opts.maxRetries} attempts: ${errorMessage}`);
}

/**
 * Process a URL - if it's a YouTube URL, extract the stream URL, otherwise return as-is
 * @param url - Input URL (YouTube or direct video URL)
 * @param options - YouTube extraction options (only used for YouTube URLs)
 * @returns Stream information
 */
export async function processUrl(url: string, options?: YouTubeOptions): Promise<YouTubeStreamInfo> {
    if (isYouTubeUrl(url)) {
        return await getYouTubeStreamUrl(url, options);
    }
    
    return {
        url,
        isYouTube: false
    };
}
