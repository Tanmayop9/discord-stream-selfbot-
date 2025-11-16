# Discord Stream Selfbot with YouTube Support

> **Enhanced version of Discord-video-stream with YouTube URL support**

> [!CAUTION]
> Using any kind of automation programs on your account can result in your account getting permanently banned by Discord. Use at your own risk. This package is for **educational purposes only**.

This project extends the [Discord-video-stream](https://github.com/Discord-RE/Discord-video-stream) library with YouTube URL support, making it easy to stream YouTube videos directly to Discord voice channels.

## ✨ Features

- 🎥 Play video & audio in Discord voice channels (Go Live or webcam video)
- 🎬 **YouTube URL Support** - Stream YouTube videos directly using their URLs
- 🔄 **Auto-Retry** - Automatic retry on YouTube extraction failures (configurable, default 3 attempts)
- 🛡️ **Robust Error Handling** - Comprehensive error messages and fallback mechanisms
- 🔧 Supports H.264, H.265, and VP8 video codecs
- ⚙️ Customizable video quality, bitrate, and encoding settings
- 📺 Both direct video URLs and YouTube URLs supported
- 🎯 **Advanced Example** - Ultra-advanced single-file bot with queue system, status monitoring, and more

## 📋 Requirements

For full functionality, this library requires an FFmpeg build with `libzmq` enabled:
- **Windows & Linux**: [BtbN's FFmpeg Builds](https://github.com/BtbN/FFmpeg-Builds)
- **macOS (Intel)**: [evermeet.cx](https://evermeet.cx/ffmpeg/)
- **macOS (Apple Silicon)**: Install from Homebrew

## 📦 Installation

Install the package alongside its peer-dependency discord.js-selfbot-v13:

```bash
npm install discord-stream-selfbot-yt
npm install discord.js-selfbot-v13
```

## 🚀 Usage

### Basic Setup

```typescript
import { Client } from "discord.js-selfbot-v13";
import { Streamer } from 'discord-stream-selfbot-yt';

const streamer = new Streamer(new Client());
await streamer.client.login('YOUR_TOKEN_HERE');
```

### Join a Voice Channel

```typescript
await streamer.joinVoice("GUILD_ID", "CHANNEL_ID");
```

### Stream YouTube Videos with Advanced Options

```typescript
import { prepareStream, playStream, Utils } from "discord-stream-selfbot-yt";

try {
    // Works with YouTube URLs!
    const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    
    const { command, output } = await prepareStream(youtubeUrl, {
        height: 1080,
        frameRate: 30,
        bitrateVideo: 5000,
        bitrateVideoMax: 7500,
        videoCodec: Utils.normalizeVideoCodec("H264"),
        h26xPreset: "veryfast",
        verbose: true, // Enable detailed logging
        
        // YouTube-specific options
        youtubeOptions: {
            maxRetries: 3,      // Retry failed extractions (default: 3)
            retryDelay: 2000,   // Delay between retries in ms (default: 1000)
            quality: 'highest', // Video quality (highest, lowest, etc.)
            preferFormat: 'any' // Format preference (any, mp4, webm)
        }
    });
    
    command.on("error", (err, stdout, stderr) => {
        console.error("FFmpeg error:", err);
    });

    await playStream(output, streamer, {
        type: "go-live" // or "camera"
    });

    console.log("Finished playing video");
} catch (e) {
    console.error(e);
}
```

### Stream Direct Video URLs

The package also supports direct video URLs (like the original library):

```typescript
const directUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const { command, output } = await prepareStream(directUrl, {
    height: 1080,
    frameRate: 30,
    bitrateVideo: 5000,
    bitrateVideoMax: 7500,
    videoCodec: Utils.normalizeVideoCodec("H264")
});

await playStream(output, streamer, { type: "go-live" });
```

## ⚙️ Configuration Options

### Enhanced Prepare Stream Options

```typescript
{
    // Standard encoding options
    width?: number;              // Video output width
    height?: number;             // Video output height
    frameRate?: number;          // Video output FPS
    bitrateVideo?: number;       // Video average bitrate (kbps)
    bitrateVideoMax?: number;    // Video max bitrate (kbps)
    bitrateAudio?: number;       // Audio bitrate (kbps)
    includeAudio?: boolean;      // Enable audio output
    hardwareAcceleratedDecoding?: boolean;  // Use hardware acceleration
    videoCodec?: SupportedVideoCodec;  // H264, H265, or VP8
    h26xPreset?: string;         // Encoding preset (ultrafast, veryfast, etc.)
    minimizeLatency?: boolean;   // Minimize latency
    customHeaders?: Record<string, string>;  // Custom HTTP headers
    customFfmpegFlags?: string[];  // Custom FFmpeg flags
    
    // Enhanced options
    verbose?: boolean;           // Enable detailed logging
    
    // YouTube-specific options
    youtubeOptions?: {
        maxRetries?: number;     // Max retry attempts (default: 3)
        retryDelay?: number;     // Delay between retries in ms (default: 1000)
        quality?: 'highest' | 'lowest' | 'highestaudio' | 'lowestaudio' | 'highestvideo' | 'lowestvideo';
        preferFormat?: 'any' | 'mp4' | 'webm';  // Preferred format
    }
}
```

### YouTube Options Details

The `youtubeOptions` provides robust YouTube extraction:

- **`maxRetries`**: Number of retry attempts if extraction fails (default: 3)
- **`retryDelay`**: Milliseconds to wait between retries (default: 1000)
- **`quality`**: Preferred quality level for the stream
- **`preferFormat`**: Container format preference (mp4, webm, or any)

### Play Stream Options

```typescript
{
    type?: "go-live" | "camera";  // Stream type
    width?: number;               // Override video width
    height?: number;              // Override video height
    frameRate?: number;           // Override frame rate
    readrateInitialBurst?: number;  // FFmpeg readrate_initial_burst
}
```

## 📝 Example Bot Commands

```typescript
// In your Discord bot message handler:

if (msg.content.startsWith("$play-live")) {
    const url = msg.content.split(" ")[1];
    
    // Supports both YouTube URLs and direct video URLs!
    const { command, output } = await prepareStream(url, {
        height: 1080,
        frameRate: 30,
        bitrateVideo: 5000,
        videoCodec: Utils.normalizeVideoCodec("H264")
    });
    
    await playStream(output, streamer, { type: "go-live" });
}
```

### Example Commands:

```
$play-live https://www.youtube.com/watch?v=dQw4w9WgXcQ
$play-live http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
$play-cam https://www.youtube.com/watch?v=jNQXAC9IVRw
```

## 🔍 YouTube Detection

The package automatically detects YouTube URLs and extracts the best quality stream:

```typescript
import { isYouTubeUrl, getYouTubeStreamUrl } from "discord-stream-selfbot-yt";

if (isYouTubeUrl(url)) {
    const streamInfo = await getYouTubeStreamUrl(url);
    console.log("Title:", streamInfo.title);
    console.log("Duration:", streamInfo.duration, "seconds");
}
```

## 🎯 Running the Examples

### Basic Example

1. Navigate to `examples/youtube-example`
2. Configure `src/config.json`:
```json
{
    "token": "YOUR_SELF_TOKEN",
    "acceptedAuthors": ["YOUR_USER_ID"]
}
```
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Start: `npm run start`
6. Join a voice channel and use commands like:
   - `$play-live <YouTube URL or direct video URL>`
   - `$play-cam <YouTube URL or direct video URL>`
   - `$disconnect`

### Ultra Advanced Example 🔥

For a production-ready bot with advanced features, check out `examples/ultra-advanced-bot.ts`!

**Features:**
- ✅ **Queue System** - Add multiple videos to queue
- ✅ **Auto-Retry** - Automatic retry on YouTube extraction failures  
- ✅ **Status Monitoring** - Real-time stream status and statistics
- ✅ **Error Recovery** - Comprehensive error handling and recovery
- ✅ **Rich Commands** - Full command system ($play, $queue, $skip, $status, etc.)
- ✅ **Detailed Logging** - Verbose logging with timestamps and status
- ✅ **Graceful Shutdown** - Proper cleanup on exit

**Commands Available:**
```
$play <url>         - Play video in current voice channel
$play-live <url>    - Play as Go Live stream
$play-cam <url>     - Play as camera stream
$queue <url>        - Add video to queue
$skip               - Skip current video
$stop               - Stop playback and clear queue
$queue-list         - Show current queue
$queue-clear        - Clear the queue
$disconnect         - Leave voice channel
$status             - Show stream status
$help               - Show help message
```

**Quick Start:**
```bash
# Copy the ultra-advanced example
cp examples/ultra-advanced-bot.ts my-bot.ts

# Edit configuration at the top of the file
# Set your token and user IDs

# Install dependencies
npm install

# Run directly with ts-node or compile first
npx ts-node my-bot.ts
# OR
npx tsc my-bot.ts && node my-bot.js
```

## ⚠️ Important Notes

- **Self-bot tokens only**: Discord blocks video streaming from bot tokens
- **Educational purposes**: This is for learning and experimentation
- **Account risk**: Using self-bots violates Discord's ToS and can result in account termination
- **Protocol changes**: Discord may change their protocol at any time, breaking functionality

## 📚 API Reference

### Main Functions

- `prepareStream(url, options, signal?)` - Prepare a stream from YouTube URL or direct video URL
- `playStream(output, streamer, options?, signal?)` - Play the prepared stream
- `isYouTubeUrl(url)` - Check if a URL is a YouTube URL
- `getYouTubeStreamUrl(url)` - Extract direct stream URL from YouTube
- `processUrl(url)` - Process any URL (YouTube or direct)

### Classes

- `Streamer(client)` - Main streaming class
- `Utils.normalizeVideoCodec(codec)` - Normalize video codec names

## 🙏 Credits

Based on [Discord-video-stream](https://github.com/Discord-RE/Discord-video-stream) by dank074 and contributors.

Enhanced with YouTube support for educational purposes.

## 📄 License

ISC

## ⚖️ Disclaimer

This software is provided for educational purposes only. The authors are not responsible for any misuse or damage caused by this software. Use at your own risk and ensure compliance with Discord's Terms of Service and applicable laws.