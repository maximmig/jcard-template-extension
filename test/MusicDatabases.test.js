import { MusicDatabases } from '../src/models/index.js';

describe('MusicDatabases', () => {
  it('returns true only for supported databases', () => {
    const supported = ['bandcamp.com', 'discogs.com'];
    const unsupported = ['musicbrainz.org', 'last.fm'];

    supported.forEach((domain) => {
      expect(MusicDatabases.isSupported(domain)).toBe(true);
    });

    unsupported.forEach((domain) => {
      expect(MusicDatabases.isSupported(domain)).toBe(false);
    });
  });

  it('correctly identifies the database from a URL', () => {
    const testCases = [
      {
        url: 'https://blackcountrynewroad.bandcamp.com/album/for-the-first-time',
        expected: 'bandcamp.com',
      },
      {
        url: 'https://www.discogs.com/master/1947124-Black-Country-New-Road-For-The-First-Time',
        expected: 'discogs.com',
      },
    ];

    testCases.forEach(({ url, expected }) => {
      expect(MusicDatabases.fromUrl(url)).toBe(expected);
    });
  });
});
