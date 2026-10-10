/* XMON YouTube Shorts Bulk Upload & Auto Publisher - Background Service Worker */

// Queue state management
let queueState = {
  videos: [],
  status: 'idle', // idle, running, paused, completed
  currentBatch: 0,
  totalBatches: 0,
  batchSize: 15,
  completedCount: 0,
  failedCount: 0,
  uploadingCount: 0,
  publishedCount: 0
};

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_QUEUE_STATE':
      sendResponse({ state: queueState });
      break;

    case 'UPDATE_QUEUE_STATE':
      queueState = { ...queueState, ...message.payload };
      // Persist to storage
      chrome.storage.local.set({ queueState: queueState });
      // Broadcast to all tabs
      broadcastState();
      sendResponse({ success: true });
      break;

    case 'RESET_QUEUE':
      queueState = {
        videos: [],
        status: 'idle',
        currentBatch: 0,
        totalBatches: 0,
        batchSize: 15,
        completedCount: 0,
        failedCount: 0,
        uploadingCount: 0,
        publishedCount: 0
      };
      chrome.storage.local.set({ queueState: queueState });
      broadcastState();
      sendResponse({ success: true });
      break;

    case 'OPEN_STUDIO':
      chrome.tabs.create({ url: 'https://studio.youtube.com' });
      sendResponse({ success: true });
      break;

    default:
      sendResponse({ error: 'Unknown message type' });
  }
  return true; // Keep message channel open for async response
});

function broadcastState() {
  chrome.tabs.query({ url: 'https://studio.youtube.com/*' }, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { type: 'STATE_UPDATE', state: queueState }).catch(() => {});
    }
  });
}

// Restore state on startup
chrome.storage.local.get(['queueState'], (result) => {
  if (result.queueState) {
    // Don't restore video file data, just metadata
    queueState = result.queueState;
    // Clear any stale running state
    if (queueState.status === 'running' || queueState.status === 'uploading') {
      queueState.status = 'paused';
    }
  }
});

console.log('[XMON] Background service worker initialized.');
