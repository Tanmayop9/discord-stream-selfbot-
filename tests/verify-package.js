import { Streamer, prepareStream, playStream, isYouTubeUrl, Utils } from '../dist/index.js';

console.log('Verifying package exports...\n');

// Test 1: Check all required exports exist
const requiredExports = [
    'Streamer',
    'prepareStream',
    'playStream',
    'isYouTubeUrl',
    'Utils'
];

let allExportsPresent = true;
for (const exportName of requiredExports) {
    const exists = eval(`typeof ${exportName} !== 'undefined'`);
    console.log(`${exists ? '✓' : '✗'} ${exportName} is ${exists ? 'exported' : 'missing'}`);
    if (!exists) allExportsPresent = false;
}

// Test 2: Check YouTube URL detection
console.log('\nTesting YouTube URL detection:');
const testUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://example.com/video.mp4'
];

for (const url of testUrls) {
    const isYT = isYouTubeUrl(url);
    console.log(`${isYT ? '✓ YouTube' : '✓ Direct'} URL: ${url.substring(0, 50)}...`);
}

// Test 3: Check Utils functions
console.log('\nTesting Utils module:');
try {
    const codec = Utils.normalizeVideoCodec('H264');
    console.log(`✓ Utils.normalizeVideoCodec works: ${codec}`);
} catch (e) {
    console.log(`✗ Utils.normalizeVideoCodec failed: ${e.message}`);
    allExportsPresent = false;
}

console.log('\n' + '='.repeat(50));
if (allExportsPresent) {
    console.log('✓ Package verification complete - All exports working!');
    process.exit(0);
} else {
    console.log('✗ Package verification failed - Some exports missing!');
    process.exit(1);
}
