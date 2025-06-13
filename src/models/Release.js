export default class Release {
  _document;

  _coverUrl;

  _artist;

  _title;

  _released;

  _sideA;

  _sideB;

  constructor(document) {
    this._document = document;

    this.initFromDocument();
  }

  get coverUrl() {
    return this._coverUrl;
  }

  get artist() {
    return this._artist;
  }

  get title() {
    return this._title;
  }

  get released() {
    return this._released;
  }

  get sideA() {
    return this._sideA;
  }

  get sideB() {
    return this._sideB;
  }

  initFromDocument() {
    throw new Error(
      `Method 'initFromDocument' must be implemented in derived class.`,
    );
  }
}
