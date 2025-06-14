import Release from './Release.js';

export default class BandcampRelease extends Release {
  initFromDocument() {
    const ldJson = this._document.head.querySelector(
      'script[type="application/ld+json"]',
    );
    const data = JSON.parse(ldJson.textContent);

    const { image, name } = data.albumRelease.find((release) =>
      release['@type'].includes('Product'),
    );
    this._coverUrl = Array.isArray(image) ? image[0] : image;
    this._title = name;

    this._artist = data.byArtist.name;

    const releaseDate = new Date(data.datePublished);
    if (!Number.isNaN(releaseDate.valueOf())) {
      this._released = releaseDate.toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }

    const { itemListElement } = data.track;
    const tracksPerSide = Math.ceil(itemListElement.length / 2);
    const tracks = itemListElement.map((listItem) => listItem.item.name);
    this._sideA = tracks.slice(0, tracksPerSide).join('\n');
    this._sideB = tracks.slice(tracksPerSide).join('\n');
  }
}
