import Release from './Release.js';

export default class BandcampRelease extends Release {
  initFromDocument() {
    const bandcampData = this._getBandcampData();
    const release = this._getRelease(bandcampData);

    this._coverUrl = this._getCoverUrl(release);
    this._title = this._getTitle(release);
    this._artist = this._getArtist(bandcampData);
    this._released = this._getReleased(bandcampData);

    ({ sideA: this._sideA, sideB: this._sideB } =
      this._getTrackSides(bandcampData));
  }

  _getBandcampData() {
    const ldJson = this._document.head.querySelector(
      'script[type="application/ld+json"]',
    );
    return JSON.parse(ldJson.textContent);
  }

  _getRelease(bandcampData) {
    return bandcampData.albumRelease.find((release) =>
      release['@type'].includes('Product'),
    );
  }

  _getCoverUrl(release) {
    const { image } = release;
    return Array.isArray(image) ? image[0] : image;
  }

  _getTitle(release) {
    return release.name;
  }

  _getArtist(bandcampData) {
    return bandcampData.byArtist.name;
  }

  _getReleased(bandcampData) {
    const releaseDate = new Date(bandcampData.datePublished);
    return Number.isNaN(releaseDate.valueOf())
      ? undefined
      : releaseDate.toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        });
  }

  _getTrackSides(bandcampData) {
    const { itemListElement } = bandcampData.track;
    const tracksPerSide = Math.ceil(itemListElement.length / 2);
    const tracks = itemListElement.map((listItem) => listItem.item.name);

    return {
      sideA: tracks.slice(0, tracksPerSide).join('\n'),
      sideB: tracks.slice(tracksPerSide).join('\n'),
    };
  }
}
