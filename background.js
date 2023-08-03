// listen to any update in tab sys or find the most 
// recent tab we are on currently ans see if it is a 
// youtube page
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  // we have permission for chrome.tab api
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      // after ? i m gonna split the url
      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      // messaging sys taking place between extension,
      // we are sending a message to our content script
      // which says a new video has uploaded and passing it
      // the video id
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
        // url mei ? ke baad v= hota uska uthayega
      });
    }
  });
  