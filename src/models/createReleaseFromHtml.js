import MusicDatabases from './MusicDatabases';
import BandcampRelease from './BandcampRelease';
import DiscogsRelease from './DiscogsRelease';

const releaseConstructors = {
  [MusicDatabases.Bandcamp]: BandcampRelease,
  [MusicDatabases.Discogs]: DiscogsRelease,
};

const parseHtml = (htmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, 'text/html');
};

const createReleaseFromHtml = (htmlString, database) => {
  const ReleaseClass = releaseConstructors[database];

  if (!ReleaseClass) {
    throw new Error(`Unsupported database: ${database}`);
  }

  const document = parseHtml(htmlString);
  return new ReleaseClass(document);
};

export default createReleaseFromHtml;
