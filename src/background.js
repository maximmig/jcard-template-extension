chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'import-from') {
    fetch(request.url).then(response => response.text()).then(text => sendResponse(text)).catch(error => {
      console.log('Failed to send request to %s: %s', request.url, error);
      sendResponse(null);
    });
  }
  return true;
});
