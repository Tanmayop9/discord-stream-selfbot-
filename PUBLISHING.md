# Publishing Guide

This guide explains how to publish the `discord-stream-selfbot-yt` package to npm.

## Prerequisites

1. You need an npm account. Create one at [npmjs.com](https://www.npmjs.com/signup)
2. Log in to npm from the command line:
   ```bash
   npm login
   ```

## Pre-publish Checklist

Before publishing, ensure:

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Version number is correct in `package.json`
- [ ] CHANGELOG.md is up to date
- [ ] README.md is complete and accurate
- [ ] All changes are committed to git

## Publishing Steps

### 1. Dry Run

First, do a dry run to see what will be published:

```bash
npm pack --dry-run
```

This shows you all files that will be included in the package.

### 2. Version Bump (Optional)

If you need to update the version:

```bash
# For patch version (1.0.0 -> 1.0.1)
npm version patch

# For minor version (1.0.0 -> 1.1.0)
npm version minor

# For major version (1.0.0 -> 2.0.0)
npm version major
```

### 3. Publish to npm

To publish to the public npm registry:

```bash
npm publish
```

The `prepublishOnly` script will automatically build the project before publishing.

### 4. Verify Publication

After publishing, verify the package:

```bash
npm info discord-stream-selfbot-yt
```

Or visit: https://www.npmjs.com/package/discord-stream-selfbot-yt

## Publishing Scoped Packages

If you want to publish under your npm username:

1. Update `package.json`:
   ```json
   {
     "name": "@yourusername/discord-stream-selfbot-yt"
   }
   ```

2. Publish with:
   ```bash
   npm publish --access public
   ```

## Updating the Package

When you need to update the package:

1. Make your changes
2. Update `CHANGELOG.md`
3. Bump the version: `npm version patch` (or minor/major)
4. Publish: `npm publish`
5. Push changes and tags: `git push && git push --tags`

## Troubleshooting

### Package name already taken

If the package name is already taken, you'll need to:
- Choose a different name
- Or publish as a scoped package under your username

### Permission denied

Make sure you're logged in:
```bash
npm whoami
npm login
```

### Build failures

Ensure TypeScript compiles without errors:
```bash
npm run build
```

## Important Notes

- **Educational purposes only**: This package is for learning and experimentation
- **Discord ToS**: Using self-bots violates Discord's Terms of Service
- **Use responsibly**: Be aware of legal and ethical implications
- **Version semantics**: Follow [Semantic Versioning](https://semver.org/)

## Post-publish

After publishing:

1. Create a GitHub release with the same version tag
2. Share the package (if appropriate)
3. Monitor for issues and user feedback
4. Maintain the package responsibly
