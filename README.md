# XMON - YouTube Shorts Bulk Upload & Auto Publisher

<p align="center">
  <img src="xmon_logo.png" alt="XMON Logo" width="120" style="border-radius: 20px;" />
</p>

<p align="center">
  <strong>High-performance, automated bulk video uploader and publisher for YouTube Shorts.</strong>
  <br />
  <em>Crafted for content creators, automation workflows, and studio managers.</em>
</p>

---

## 🚀 Overview

**XMON YouTube Shorts Publisher** is a Manifest V3 browser extension engineered to automate the tedious process of uploading and publishing YouTube Shorts. It runs directly inside YouTube Studio (`studio.youtube.com`), providing an intelligent queue manager, draft publisher, automated metadata entry, and quota/daily limit detection.

---

## ✨ Features

- ⚡ **Bulk Queue Management**: Load multiple video files and configure automated batch uploads seamlessly.
- 🎯 **Automated Studio Interaction**: Coordinates directly with the YouTube Studio upload modal and details screen.
- ⏱️ **Scheduled & Draft Publishing**: Auto-set visibility to Public, Unlisted, Private, or schedule future release dates.
- 🛡️ **Daily Limit Detection**: Automatically detects YouTube daily upload quota limits and suspends execution cleanly.
- 🎨 **Sleek Cyberpunk/Glassmorphism HUD**: Premium dashboard embedded right into YouTube Studio with real-time status telemetry.
- 🔒 **Privacy & Security Focused**: Operates 100% locally in your browser. No external servers, no third-party credential harvesting.

---

## 🛠️ Installation Guide

1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/Xmon4u/Youtube-bulk-publisher.git
   ```

2. **Open Extensions in Chromium Browser** (Chrome, Brave, Edge, Opera):
   - Navigate to `chrome://extensions/` (or `edge://extensions/`).
   - Enable **Developer mode** (toggle in the top-right corner).

3. **Load Unpacked Extension**:
   - Click the **"Load unpacked"** button.
   - Select the `Youtube-bulk-publisher` folder.

4. **Launch YouTube Studio**:
   - Navigate to [YouTube Studio](https://studio.youtube.com).
   - The XMON Bulk Publisher floating panel will appear ready for action!

---

## 📁 Project Structure

```plaintext
Youtube-bulk-publisher/
├── manifest.json       # Chrome Extension Manifest V3 configuration
├── background.js       # Background service worker & queue state persistence
├── content.js          # Studio DOM automation & floating HUD controller
├── styles.css          # Cyberpunk / glassmorphic UI styling
├── popup.html          # Extension popup UI
├── popup.js            # Popup status monitor & quick actions
├── test_preview.html   # Standalone UI preview & testing page
└── assets / icons      # Brand logos and extension icons
```

---

## ⚖️ License & Disclaimer

This project is created for educational and workflow automation purposes. Use responsibly in accordance with [YouTube Terms of Service](https://www.youtube.com/t/terms) and [Community Guidelines](https://www.youtube.com/howyoutubeworks/policies/community-guidelines/).

Distributed under the MIT License.
