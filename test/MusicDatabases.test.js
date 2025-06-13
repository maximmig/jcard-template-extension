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
});
