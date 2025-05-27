export default class Release {
  doc;

  constructor(htmlString) {
    this.doc = Release.parseHtml(htmlString);
  }

  get title() {
    return this.doc.head.getElementsByTagName('title')[0].textContent.trim();
  }

  static parseHtml(htmlString) {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, 'text/html');
  }
}
