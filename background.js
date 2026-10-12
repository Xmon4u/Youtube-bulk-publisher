/* XMON YouTube Shorts Bulk Upload & Auto Publisher - Background Service Worker
   P4: Removed dead queue state sync (GET_QUEUE_STATE / UPDATE_QUEUE_STATE / RESET_QUEUE /
   broadcastState). Queue state is managed exclusively by content.js via chrome.storage.local.
   Only OPEN_STUDIO message is needed from popup.js. */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'OPEN_STUDIO':
      chrome.tabs.create({ url: 'https://studio.youtube.com' });
      sendResponse({ success: true });
      break;

    default:
      // Silently ignore unknown messages (content script may send state saves directly)
      sendResponse({ ok: true });
  }
  return true;
});

console.log('[XMON] Background service worker initialized.');
