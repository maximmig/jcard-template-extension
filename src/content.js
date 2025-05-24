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
      input.setAttribute('disabled', 'disabled');
      const url = input.value;

      chrome.runtime.sendMessage({
        type: "import-from",
        url: url,
      }, importedData => {
        input.removeAttribute('disabled');

        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError.message);
          return;
        }

        console.log("Received data: %o", importedData);
      });
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
