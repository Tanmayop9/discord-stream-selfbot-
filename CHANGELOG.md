# Changelog

## [1.0.0] - 2025-11-16

### Added
- Initial release based on Discord-video-stream
- YouTube URL support via ytdl-core
- Automatic detection and extraction of YouTube stream URLs
- Enhanced prepareStream function that handles both YouTube URLs and direct video URLs
- YouTube utility functions: isYouTubeUrl, getYouTubeStreamUrl, processUrl
- Comprehensive README with examples
- Example project demonstrating YouTube URL usage
- TypeScript definitions for all new features

### Features
- Stream YouTube videos directly to Discord voice channels
- Support for both "Go Live" and camera streaming modes
- Automatic best quality selection for YouTube videos
- Full backward compatibility with direct video URLs
- Video codec support: H.264, H.265, VP8
- Customizable encoding settings (bitrate, resolution, fps)
