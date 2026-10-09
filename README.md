# XMON - YouTube Shorts Bulk Upload & Auto Publisher

<p align="center">
  <img src="xmon_logo.png" alt="XMON Logo" width="120" style="border-radius: 20px;" />
</p>

<p align="center">
  <strong>Automated bulk upload and publishing tool for YouTube Shorts, built as a Chrome extension.</strong>
</p>

---

## Overview

XMON YouTube Shorts Publisher is a Manifest V3 Chrome extension that runs inside YouTube Studio. It manages a video queue, uploads files in batches, saves them as drafts, and then automatically publishes each draft with the configured visibility setting.

Key capabilities:

- Queue up to 100 videos via drag-and-drop or file browser
- Upload in configurable batches (5, 10, or 15 videos at a time)
- Automatically detect when uploads finish and close the upload dialog
- Navigate to the content page and publish all pending drafts after each batch
- Detect YouTube's daily upload quota limit and pause gracefully
- Retry failed videos individually or in bulk
- Persist queue metadata across page refreshes via `chrome.storage.local`

---

## Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Xmon4u/Youtube-bulk-publisher.git
   ```

2. Open your Chromium-based browser (Chrome, Brave, Edge, Opera) and go to `chrome://extensions/`.

3. Enable **Developer mode** using the toggle in the top-right corner.

4. Click **Load unpacked** and select the `Youtube-bulk-publisher` folder.

5. Navigate to [YouTube Studio](https://studio.youtube.com). The XMON panel will appear on the page.

---

## Usage

1. Go to the **Upload** tab and drop your video files onto the drop zone (or click to browse).
2. Click **Start Queue**. The extension will upload the first batch to YouTube Studio.
3. After uploads complete and drafts are saved, the extension navigates to the content page and publishes each draft automatically.
4. Once the first batch is fully published, the next batch upload begins.
5. This continues until all videos are processed.

If the daily upload limit is reached, the queue pauses and the remaining videos stay in **Waiting** status so you can resume the next day.

To publish existing drafts without uploading, use the **Publish** tab.

---

## Configuration

Available in the **Config** tab:

| Setting | Options | Default |
|---|---|---|
| Visibility | Public / Unlisted / Private | Public |
| Batch size | 5 / 10 / 15 | 15 |
| Not made for kids | On / Off | On |
| Auto-publish drafts | On / Off | On |
| Auto-scroll for drafts | On / Off | On |
| Delay between videos | 0.5s – 2.0s | 0.8s |
| Delay between batches | 2s – 10s | 3s |

---

## Project Structure

```
Youtube-bulk-publisher/
├── manifest.json       # Chrome Extension Manifest V3
├── background.js       # Background service worker, state persistence
├── content.js          # Core automation logic and floating UI
├── styles.css          # Extension UI styles
├── popup.html          # Toolbar popup
├── popup.js            # Popup script
└── icons/              # Extension icons
```

---

## Changelog

### v2.2.0 (2026-10-09)

Fixed a critical bug where the extension would freeze after the first batch completed:

- **Root cause**: `navigateToContent()` was using `window.location.href` assignment, which causes a full page reload and destroys all JavaScript state (queue, batch loop, counters). After the first batch uploaded and drafts were saved, the page reloaded and the loop never continued.
- **Fix**: Replaced direct URL assignment with SPA-safe navigation using sidebar link clicks and the History API (`pushState`). The page no longer reloads between batches.
- Improved upload completion detection: added a dedicated `isUploadCloseBtnEnabled()` helper that checks both the element and its inner shadow DOM button for disabled state. YouTube enables the close button only when all files in a batch have finished uploading.
- Fixed double-counting of `publishedCount`: the count was being incremented in both `publishSingleDraft()` and `publishAllDrafts()`. It is now only incremented once, inside `publishSingleDraft()`.
- Added per-index tracking (`updatedIndices` set) in `waitForBatchUploadComplete()` to prevent the same video from being counted as uploaded multiple times during the polling loop.
- After a timeout, remaining `UPLOADING` videos in the batch are now marked as `UPLOADED` (fallback) rather than left in a stuck state.
- Increased upload wait timeout from 90 seconds per video to 180 seconds to accommodate larger file sizes.

### v2.1.0

Initial public release with queue management, batch uploads, draft publishing, and daily limit detection.

---

## License

MIT License. Use in accordance with [YouTube Terms of Service](https://www.youtube.com/t/terms).
