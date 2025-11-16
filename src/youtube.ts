import ytdl from 'ytdl-core';

export interface YouTubeStreamInfo {
    url: string;
    isYouTube: boolean;
    title?: string;
    duration?: number;
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
 * Extract the best quality stream URL from a YouTube URL
 * @param youtubeUrl - YouTube video URL
 * @returns Direct stream URL and video info
 */
export async function getYouTubeStreamUrl(youtubeUrl: string): Promise<YouTubeStreamInfo> {
    if (!ytdl.validateURL(youtubeUrl)) {
        throw new Error('Invalid YouTube URL');
    }

    try {
        const info = await ytdl.getInfo(youtubeUrl);
        
        // Get the best format that has both video and audio
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highest',
            filter: (format) => format.hasVideo && format.hasAudio
        });

        if (!format || !format.url) {
            throw new Error('No suitable format found for YouTube video');
        }

        return {
            url: format.url,
            isYouTube: true,
            title: info.videoDetails.title,
            duration: parseInt(info.videoDetails.lengthSeconds)
        };
    } catch (error) {
        throw new Error(`Failed to extract YouTube stream: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Process a URL - if it's a YouTube URL, extract the stream URL, otherwise return as-is
 * @param url - Input URL (YouTube or direct video URL)
 * @returns Stream information
 */
export async function processUrl(url: string): Promise<YouTubeStreamInfo> {
    if (isYouTubeUrl(url)) {
        return await getYouTubeStreamUrl(url);
    }
    
    return {
        url,
        isYouTube: false
    };
}
