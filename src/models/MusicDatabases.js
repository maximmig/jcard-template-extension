const MusicDatabases = {
  Bandcamp: 'bandcamp.com',
  Discogs: 'discogs.com',

  fromUrl(url) {
    const { hostname } = new URL(url);
    const parts = hostname.replace(/^www\./, '').split('.');
    return parts.slice(-2).join('.');
  },

  isSupported(database) {
    return Object.values(this)
      .filter((value) => typeof value === 'string')
      .includes(database);
  },
};

export default MusicDatabases;
