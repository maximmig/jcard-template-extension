const loadPage = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
  }

  return response.text();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'load-page') {
    loadPage(request.url)
      .then((html) => sendResponse(html))
      .catch((error) => {
        console.error(
          'Failed to send request to %s. %s',
          request.url,
          error.message,
        );
        sendResponse(null);
      });
  }
  return true;
});
