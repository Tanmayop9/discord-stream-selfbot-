# Contributing to discord-stream-selfbot-yt

Thank you for your interest in contributing! This package is for educational purposes only.

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/Tanmayop9/discord-stream-selfbot-.git
cd discord-stream-selfbot-
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run linter:
```bash
npm run lint
```

## Project Structure

- `src/` - TypeScript source files
  - `client/` - Discord client and voice connection handling
  - `media/` - Media processing and encoding
  - `youtube.ts` - YouTube URL handling
  - `enhancedApi.ts` - Enhanced prepareStream with YouTube support
  - `index.ts` - Main exports
- `examples/` - Example projects
- `dist/` - Compiled JavaScript (generated)

## Making Changes

1. Make your changes in the `src/` directory
2. Build the project: `npm run build`
3. Test your changes with the example project
4. Run the linter: `npm run lint`
5. Update documentation if needed

## Code Style

We use Biome for linting. Run `npm run lint:fix` to automatically fix style issues.

## Important Notes

- This package is for educational purposes only
- Using self-bots violates Discord's Terms of Service
- Be mindful of the legal and ethical implications
- Focus on code quality and security
