import Release from './Release.js';

export default class DiscogsRelease extends Release {
  initFromDocument() {
    const discogsData = JSON.parse(
      this._document.getElementById('dsdata').textContent,
    ).data;

    const release = this._getRelease(discogsData);

    this._coverUrl = this._getCoverUrl(discogsData, release);
    this._title = release.title;
    this._artist = this._getArtist(release);
    this._released = this._getReleased(release);

    const { sideA, sideB } = this._getTrackSides(discogsData, release);
    this._sideA = sideA;
    this._sideB = sideB;
  }

  _getRelease(discogsData) {
    const entries = Object.entries(discogsData.ROOT_QUERY);
    const [, releaseEntryKeyHolder] =
      entries.find(
        ([key]) => key.startsWith('release') || key.startsWith('masterRelease'),
      ) ?? [];
    const releaseEntryKey = releaseEntryKeyHolder.__ref;

    const release = discogsData[releaseEntryKey];
    return 'keyRelease' in release // check if it's a master release
      ? discogsData[release.keyRelease.__ref]
      : release;
  }

  _getCoverUrl(discogsData, release) {
    const imagesEntryKey = Object.keys(release).find((k) =>
      k.startsWith('images'),
    );
    const images = imagesEntryKey ? release[imagesEntryKey] : null;
    if (images) {
      const imageNodeKey =
        images.edges.length > 0 ? images.edges[0].node.__ref : null;
      if (imageNodeKey) {
        const coverImageKey = discogsData[imageNodeKey]?.fullsize?.__ref;
        if (coverImageKey) {
          return discogsData[coverImageKey].sourceUrl;
        }
      }
    }

    return undefined;
  }

  _getArtist(release) {
    return release.primaryArtists
      .reduce((acc, { displayName, joiningText }) => {
        acc.push(displayName);
        if (joiningText) {
          acc.push(joiningText);
        }
        return acc;
      }, [])
      .join(' ');
  }

  _getReleased(release) {
    const [year, month] = release.released.split('-');
    const releaseDate = new Date(Number(year), Number(month) - 1, 1);

    return Number.isNaN(releaseDate.valueOf())
      ? undefined
      : releaseDate.toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        });
  }

  _getTrackSides(discogsData, release) {
    const trackTitlesA = [];
    const trackTitlesB = [];

    const regexA = /^A\d+/i;
    const regexB = /^B\d+/i;

    release.tracks.forEach(({ __ref }) => {
      const track = discogsData[__ref];
      const { position } = track;

      if (track.trackType === 'TRACK' && position !== 'Video') {
        if (regexA.test(position)) {
          trackTitlesA.push(track.title);
        } else if (regexB.test(position)) {
          trackTitlesB.push(track.title);
        } else {
          trackTitlesA.push(track.title);
        }
      }
    });

    if (trackTitlesA.length > 0 && trackTitlesB.length === 0) {
      const half = Math.ceil(trackTitlesA.length / 2);
      trackTitlesB.push(...trackTitlesA.splice(half));
    }

    return {
      sideA: trackTitlesA.join('\n'),
      sideB: trackTitlesB.join('\n'),
    };
  }
}
