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

### v2.9.0 (2026-10-10)

Critical bug-fix release fixing draft publishing failures ("Edit draft button not found" and "Editor dialog did not open"):

- **Edit Draft Button Retry Loop**: `publishSingleDraft()` now retries up to 3 times with increasing hover delays (500ms → 800ms → 1200ms) and dispatches both `mouseenter` and `mouseover` events before searching for the button. This fixes the most common error where YouTube Studio's virtualized row didn't render action buttons fast enough.
- **Extended Edit Button Selectors**: Added `[aria-label*="Edit" i]`, `ytcp-icon-button`, `[role="button"]`, three-dot menu icon selectors, and `a[href*="/video/"]` title link fallback. Covers YouTube Studio UI changes where the direct "Edit draft" button was replaced or restructured.
- **Scroll-Into-View Before Hover**: Each retry attempt now scrolls the draft row into the viewport center before hovering, ensuring off-screen rows receive the hover event correctly.
- **Extended Editor Dialog Selectors**: `waitFor()` dialog detection now checks `ytcp-video-metadata-editor-advanced`, `ytcp-video-editor`, and `ytcp-dialog[id*="dialog"]` in addition to the existing selectors. Also increased wait timeout from 12s to 15s.
- **`isDialogOpen()` Attribute Fix**: Previously only checked if `opened === 'false'`, but an empty `opened=""` attribute or missing `opened` was ambiguous. Now correctly treats `opened=""` and `opened` (no value) as open, and only `opened="false"` as closed. Also added `getComputedStyle` CSS visibility check.
- **Visibility Radio Button Fallbacks**: Added `[name="..."]` generic selector, `[role="radio"]`, and `ytcp-ve-visibility-radio-button` to handle YouTube Studio's evolving radio button components. Increased visibility step wait from 6s to 8s.
- **Share Dialog Close Improvements**: Added `[aria-label="Close" i]` case-insensitive selector and Escape key dispatch to both `document` and `window`. Extended dialog close wait from 10s to 12s.

### v2.8.0 (2026-10-10)

Bug-fix release addressing 6 logic errors found during full code audit:

- **`deepQuery` Shadow DOM Traversal Fix**: The descendant-selector parsing in `deepQuery()` previously tried to apply shadow-boundary traversal for multi-level descendant paths (e.g. `"a b c"`), causing incorrect element resolution. Now only simple `"parent child"` pairs receive shadow traversal; deeper paths are delegated to native `querySelector`.
- **`verifyAndSyncBatchDrafts` Wrong Tab Navigation**: The `initialTab` calculation always resolved to `'shorts'` regardless of the current URL, meaning the extension never navigated to the Videos tab when uploading non-Shorts. Now correctly switches to `'shorts'` when on a Shorts URL and `'videos'` otherwise.
- **`closeUploadDialog` Confirmation Safety**: The safe/destructive button detection logic was applied in the wrong order — `isSafe` was evaluated before checking `isDestructive`, allowing `'close'` (a sub-string of `'cancel upload close'`) to match destructively. Reordered so destructive check always runs first; added `'keep'` and `'delete'` patterns.
- **Toast Special-Character Encoding**: The daily-limit toast displayed a mojibake bullet character (`â€¢`) due to a raw UTF-8 byte sequence in the template literal. Replaced with the Unicode escape `\u2022` (•) for correct rendering in all environments.
- **`startPeriodicUpdates` Interval Leak**: Calling `init()` more than once during SPA navigation stacked multiple `setInterval` timers, causing duplicate error checks and draft-count updates. Both intervals (`_periodicUpdateIntervalId` and `_spaCheckIntervalId`) are now tracked and cleared before being re-created.
- **`handleFileDrop` Batch Count**: `totalBatches` was recalculated using only `WAITING | FAILED` videos, which is correct, but the comment was misleading. Clarified the intent and ensured consistency with `processQueue`.
- **`background.js` Broken `OPEN_STUDIO` URL**: The `OPEN_STUDIO` message handler opened `https://studio.youtube.com/channel/UC/videos/upload`, where `/UC/` is a placeholder channel ID that results in a 404. Changed to `https://studio.youtube.com`.

### v2.7.0 (2026-10-09)

Fixed multi-batch queue stall after first batch and implemented persistent panel minimize/maximize state:

- **Batch Stall Root Cause Fixed**: In `waitForBatchUploadComplete()`, the extension previously waited for up to 6.25 minutes looking only for dialog text flags (`saved as draft`) while YouTube Studio had already transitioned the batch to drafts on the Content page. This caused the first 15 videos to remain frozen in `UPLOADING` state, preventing `closeUploadDialog()`, publishing, and transition to Batch 2.
- **Direct Content Draft Detection**: Active polling of `findDraftRows()` now verifies drafts directly in YouTube Studio; as soon as batch drafts are saved, the loop terminates immediately and advances to publishing.
- **Upload Dialog Disappearance Fast-Path**: If YouTube Studio automatically closes the multi-upload modal, the extension detects this immediately instead of waiting out the timeout.
- **Batch 2+ Transition Stability**: Sequential batch chaining across up to 100 queued videos (15 per batch) with clean transition through Upload -> Draft Verified -> Publish -> Next Batch.
- **Minimize / Maximize State Persistence**:
  - Clicking the Minus (`−`) button minimizes the floating widget and displays a Plus (`+`) button.
  - Clicking the Plus (`+`) button restores the maximized view.
  - State is saved to `localStorage` and `chrome.storage.local`, persisting through page refreshes, tab switching, and extension reloads without auto-maximizing.

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
