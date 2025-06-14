// eslint-disable-next-line import/no-unresolved
import bandcampSample from './fixtures/bandcamp-sample.html?raw';
import { createReleaseFromHtml, MusicDatabases } from '../src/models/index.js';

describe('BandcampRelease', () => {
  it('should parse the Bandcamp release HTML correctly', () => {
    const bandcampRelease = createReleaseFromHtml(
      bandcampSample,
      MusicDatabases.Bandcamp,
    );

    expect(bandcampRelease.artist).toBe('Black Country, New Road');
    expect(bandcampRelease.title).toBe('For the first time');
    expect(bandcampRelease.released).toBe('February 2021');
    expect(bandcampRelease.sideA).toBe(
      'Instrumental\nAthens, France\nScience Fair',
    );
    expect(bandcampRelease.sideB).toBe('Sunglasses\nTrack X\nOpus');
    expect(bandcampRelease.coverUrl).toBe(
      'https://f4.bcbits.com/img/a1090225129_10.jpg',
    );
  });
});
