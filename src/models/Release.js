export default class Release {
  _document;
  _title;

  constructor(document) {
    this._document = document;

    this.initFromDocument();
  }

  get title() {
    return this._title;
  }

  initFromDocument() {
    throw new Error(`Method 'initFromDocument' must be implemented in derived class.`);
  }
}
