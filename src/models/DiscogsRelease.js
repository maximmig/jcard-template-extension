import Release from './Release';

export default class DiscogsRelease extends Release {
  initFromDocument() {
    const discogsData = JSON.parse(
      this._document.getElementById('dsdata').textContent,
    );
    const entries = Object.entries(discogsData.data.ROOT_QUERY);
    const [, releaseEntryKeyHolder] = entries.find(([key]) =>
      key.startsWith('release'),
    );
    const releaseEntryKey = releaseEntryKeyHolder.__ref;

    const release = discogsData.data[releaseEntryKey];
    const { title, primaryArtists, released, tracks } = release;

    const imagesEntryKey = Object.keys(release).find((k) =>
      k.startsWith('images'),
    );
    const images = imagesEntryKey ? release[imagesEntryKey] : null;
    if (images) {
      const imageNodeKey =
        images.edges.length > 0 ? images.edges[0].node.__ref : null;
      if (imageNodeKey) {
        const coverImageKey = discogsData.data[imageNodeKey]?.fullsize?.__ref;
        if (coverImageKey) {
          this._coverUrl = discogsData.data[coverImageKey].sourceUrl;
        }
      }
    }

    this._title = title;

    if (primaryArtists.length > 0) {
      this._artist = primaryArtists
        .reduce((acc, { displayName, joiningText }) => {
          acc.push(displayName);
          if (joiningText) {
            acc.push(joiningText);
          }
          return acc;
        }, [])
        .join(' ');
    }

    const [year, month] = released.split('-');
    const releaseDate = new Date(Number(year), Number(month) - 1, 1);
    if (!Number.isNaN(releaseDate.valueOf())) {
      this._released = releaseDate.toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }

    const trackNames = tracks
      .map(({ __ref }) => {
        const track = discogsData.data[__ref];
        return track.trackType === 'TRACK' && track.position !== 'Video'
          ? track.title
          : null;
      })
      .filter((t) => t !== null);
    if (trackNames.length > 0) {
      const tracksPerSide = Math.ceil(trackNames.length / 2);
      this._sideA = trackNames.slice(0, tracksPerSide).join('\n');
      this._sideB = trackNames.slice(tracksPerSide).join('\n');
    }
  }
}
