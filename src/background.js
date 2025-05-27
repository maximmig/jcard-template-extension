chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'load-page') {
    loadPage(request.url).then(html => sendResponse(html)).catch(error => {
      console.log('Failed to send request to %s. %s', request.url, error.message);
      sendResponse(null);
    });
  }
  return true;
});

const loadPage = async url => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
  }

  return await response.text();
}
