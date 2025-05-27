import {BandcampRelease, DiscogsRelease} from "./models/index.js";

function addImportFields() {
  const controls = document.getElementById('controls');

  if (controls) {
    const label = document.createElement('label');
    label.classList.add('field-label');
    label.setAttribute('for', 'controls-url');
    label.textContent = 'URL';

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'controls-url');
    input.classList.add('field-input');

    const inputField = document.createElement('div');
    inputField.classList.add('field');

    const button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.classList.add('field-input');
    button.value = 'Run';
    button.addEventListener('click', () => {
      const url = input.value;
      const domain = getRootDomain(url);

      if (domain === 'discogs.com' || domain === 'bandcamp.com') {
        input.setAttribute('disabled', 'disabled');

        chrome.runtime.sendMessage({ type: 'load-page', url }, (htmlString) => {
          input.removeAttribute('disabled');

          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
            return;
          }

          try {
            const release = createRelease(domain, htmlString);
            console.log(release.title);
          } catch (e) {
            console.error(e.message);
          }
        });
      } else {
        console.warn(`Unsupported domain: ${domain}`);
      }
    });

    const buttonField = document.createElement('div');
    buttonField.classList.add('field');

    const columnsColumn2 = document.createElement('div');
    columnsColumn2.classList.add('columns-column-2');

    const columnsColumn = document.createElement('div');
    columnsColumn.classList.add('columns-column');

    const columns = document.createElement('div');
    columns.classList.add('columns');

    const importFieldset = document.createElement('fieldset');

    const fieldsetLegend = document.createElement('legend');
    fieldsetLegend.textContent = 'Import from';

    inputField.appendChild(label);
    inputField.appendChild(input);

    buttonField.appendChild(button);

    columnsColumn2.appendChild(inputField);

    columnsColumn.appendChild(buttonField);

    columns.appendChild(columnsColumn2);
    columns.appendChild(columnsColumn);

    importFieldset.appendChild(fieldsetLegend);
    importFieldset.appendChild(columns);

    controls.appendChild(importFieldset);
  }
}

(() => {
  addImportFields();
})();

const getRootDomain = url => {
  const {hostname} = URL.parse(url);

  const parts = hostname.replace(/^www\./, '').split('.');

  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }

  return hostname; // fallback
}

const createRelease = (domain, htmlString) => {
  switch (domain) {
    case 'discogs.com': {
      return new DiscogsRelease(htmlString);
    }
    case 'bandcamp.com': {
      return new BandcampRelease(htmlString);
    }
    default:
      throw new Error(`Unsupported domain: ${domain}`);
  }
}
