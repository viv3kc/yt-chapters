try {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      chrome.tabs.sendMessage(tabId, {
        message: 'TabUpdated'
      });
    }
  });
} catch(e) {
  console.log("Error from 'Auto Load YouTube Video Chapters': ", e)
}
