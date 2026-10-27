# YouTube Shorts Bulk Publisher

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](manifest.json)
[![Platform](https://img.shields.io/badge/Platform-Chromium%20Extension-orange.svg)](https://github.com/Xmon4u/Youtube-bulk-publisher)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A Chromium browser extension (Manifest V3) for automating bulk video uploads and scheduled draft publishing directly inside YouTube Studio.

## Overview

Managing large numbers of YouTube Shorts manually through the web UI is repetitive. This extension integrates a floating control panel into YouTube Studio (`studio.youtube.com`), handling batch uploads, draft saving, quota monitoring, and automatic publishing in sequence.

## Features

- **Queue Management**: Add up to 100 video files at once using drag-and-drop or the file picker.
- **Configurable Batching**: Upload in groups of 5, 10, or 15 videos to prevent browser memory issues and respect YouTube Studio limits.
- **Upload Lifecycle Detection**: Automatically detects when each file completes uploading and closes upload dialogs cleanly.
- **Automated Draft Publishing**: Navigates to the channel Content tab and publishes each saved draft with configured visibility (Public, Unlisted, or Private).
- **Daily Quota Handling**: Detects YouTube's 24-hour upload limits and automatically pauses remaining queue items in waiting state.
- **State Persistence**: Saves queue state, file references, and configuration in `chrome.storage.local` to survive accidental page refreshes.
- **Error Recovery**: Retry individual failed videos or restart batches without re-uploading completed items.

## Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/Xmon4u/Youtube-bulk-publisher.git
   ```

2. Open your Chromium browser (Chrome, Brave, Edge, Opera) and go to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked** and select the `Youtube-bulk-publisher` folder.
5. Go to [YouTube Studio](https://studio.youtube.com). The publisher panel will load on the right side of your dashboard.

## How to Use

### 1. Upload & Publish Queue
1. In the **Upload** tab, drop your video files onto the upload zone.
2. Select your target **Batch Size** and **Visibility** setting (Public, Unlisted, or Private).
3. Click **Start Queue**.
4. The extension uploads the first batch, waits for drafts to save, navigates to your Content page, and publishes each draft automatically before advancing to the next batch.

### 2. Publish Drafts Only
If you have already uploaded videos as drafts and only want to publish them in bulk:
1. Open the **Publish** tab.
2. Configure your visibility preference and click **Publish All Drafts**.

## Configuration Options

Settings are available in the **Config** tab:

| Setting | Options | Default | Description |
|---|---|---|---|
| Visibility | Public / Unlisted / Private | Public | Privacy state applied when publishing |
| Batch Size | 5 / 10 / 15 | 15 | Number of files uploaded per batch |
| Made for Kids | Yes / No | No | Audience compliance flag |
| Auto-Publish Drafts | Enabled / Disabled | Enabled | Automatically publish after upload finishes |
| Auto-Scroll | Enabled / Disabled | Enabled | Scrolls content table to locate pending drafts |
| Action Delay | 0.5s – 2.0s | 0.8s | Delay between individual UI clicks |
| Batch Interval | 2s – 10s | 3s | Cooldown period between batches |

## Project Structure

```text
Youtube-bulk-publisher/
├── manifest.json       # Manifest V3 configuration
├── background.js       # Background worker and storage sync
├── content.js          # Core automation script and floating UI
├── styles.css          # Injected UI styles
├── popup.html          # Browser toolbar popup
├── popup.js            # Toolbar popup script
├── icons/              # Extension icons
└── README.md
```

## Changelog

### v2.9.1
- **Upload Detection**: Switched to strict per-file upload completion tracking (`ytcp-uploads-file-item` state). Dialogs remain open until all active uploads report completion.
- **Draft Verification**: Verification window now dynamically scales with batch size (`max(60s, 8s * batchCount)` up to 180s) across both Shorts and Videos tabs.
- **False-Positive Error Filtering**: Isolated YouTube Studio error dialog selectors to prevent filenames containing "error" or "draft" from triggering false-positive aborts.
- **Toast De-duplication**: Suppressed duplicate toast alerts during fast polling loops.
- **Selector Diagnostics**: Added ring-buffer debug logger and DOM selector health checks in the Config tab.

### v2.9.0
- **Upload Fallback Isolation**: Ensured input setter and drag/drop fallback methods execute mutually exclusively, preventing accidental double-uploading of batch files.
- **Batch Limit Exceeded Recovery**: Added automated handling for YouTube's 15-file upload limit error with automatic dialog reset and retry.
- **Draft Editor Selectors**: Improved selectors and added hover retry routines for locating the edit button on modern YouTube Studio table rows.

## License

This project is licensed under the MIT License.
