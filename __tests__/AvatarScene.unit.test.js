import { resolveAssetPath } from '../src/avatar/phaser/AvatarScene.js';

describe('resolveAssetPath', () => {
  test('preserves http(s) absolute urls', () => {
    expect(resolveAssetPath('https://example.com/foo.png')).toBe('https://example.com/foo.png');
    expect(resolveAssetPath('http://cdn.example.com/bar.png')).toBe('http://cdn.example.com/bar.png');
  });

  test('normalizes relative paths with base', () => {
    // Simulate that BASE_URL is '/', and window.location not available
    const res = resolveAssetPath('avatar/assets/heads/head_1.png');
    // Should return '/avatar/assets/heads/head_1.png' or prefix with baseCandidate if set
    expect(res.endsWith('/avatar/assets/heads/head_1.png') || res === '/avatar/assets/heads/head_1.png').toBeTruthy();
  });
});