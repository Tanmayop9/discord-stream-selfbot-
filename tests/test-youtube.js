import { isYouTubeUrl } from '../dist/youtube.js';

console.log('Testing YouTube URL detection...\n');

const testCases = [
    { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', expected: true, description: 'Standard YouTube URL' },
    { url: 'https://youtu.be/dQw4w9WgXcQ', expected: true, description: 'Short YouTube URL' },
    { url: 'https://m.youtube.com/watch?v=dQw4w9WgXcQ', expected: true, description: 'Mobile YouTube URL' },
    { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', expected: false, description: 'Direct video URL' },
    { url: 'https://example.com/video.mp4', expected: false, description: 'Other domain video URL' },
    { url: 'not a url', expected: false, description: 'Invalid URL' }
];

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
    const result = isYouTubeUrl(testCase.url);
    const status = result === testCase.expected ? '✓ PASS' : '✗ FAIL';
    
    if (result === testCase.expected) {
        passed++;
    } else {
        failed++;
    }
    
    console.log(`${status} - ${testCase.description}`);
    console.log(`  URL: ${testCase.url}`);
    console.log(`  Expected: ${testCase.expected}, Got: ${result}\n`);
}

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
    console.log('✓ All tests passed!');
    process.exit(0);
} else {
    console.log('✗ Some tests failed!');
    process.exit(1);
}
