import Release from './Release.js';

export default class DiscogsRelease extends Release {
  initFromDocument() {
    const discogsData = this._getDiscogsData();
    const release = this._getRelease(discogsData);

    this._coverUrl = this._getCoverUrl(discogsData, release);
    this._title = this._getTitle(release);
    this._artist = this._getArtist(release);
    this._released = this._getReleased(release);

    ({ sideA: this._sideA, sideB: this._sideB } = this._getTrackSides(
      discogsData,
      release,
    ));
  }

  _getDiscogsData() {
    return JSON.parse(this._document.getElementById('dsdata').textContent).data;
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

  _getTitle(release) {
    return release.title;
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
    const trackNames = release.tracks
      .map(({ __ref }) => {
        const track = discogsData[__ref];
        return track.trackType === 'TRACK' && track.position !== 'Video'
          ? track.title
          : null;
      })
      .filter((t) => t !== null);

    if (trackNames.length === 0) {
      return { sideA: '', sideB: '' };
    }

    const tracksPerSide = Math.ceil(trackNames.length / 2);

    return {
      sideA: trackNames.slice(0, tracksPerSide).join('\n'),
      sideB: trackNames.slice(tracksPerSide).join('\n'),
    };
  }
}
