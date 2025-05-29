import Release from "./Release.js";

export default class DiscogsRelease extends Release {
  constructor(document) {
    super(document);
  }

  initFromDocument() {
    const discogsData = JSON.parse(this._document.getElementById('dsdata').textContent);
    const entries = Object.entries(discogsData.data.ROOT_QUERY);
    const [,releaseEntryKeyHolder] = entries.find(([key]) => key.startsWith('release'));
    const releaseEntryKey = releaseEntryKeyHolder.__ref;
    const release = discogsData.data[releaseEntryKey];
    this._title = release.title;
  }
}
