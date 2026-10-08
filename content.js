/* ============================================================
   XMON YouTube Shorts Bulk Upload & Auto Publisher
   Content Script v2.0
   ============================================================ */

(() => {
  // Prevent duplicate injection
  if (window.__XMON_BULK_PUBLISHER_V2__) return;
  window.__XMON_BULK_PUBLISHER_V2__ = true;

  console.log('[XMON] Extension v2.0 initialized on YouTube Studio.');

  // ============================================================
  // SVG ICONS (inline, no emoji)
  // ============================================================
  const ICONS = {
    upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
    stop: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
    film: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
    zap: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    alertTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    alertCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
    list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  };

  // ============================================================
  // XMON 3D METALLIC CHROME LOGO (Self-contained, 100% CSP-safe)
  // ============================================================
  const XMON_LOGO_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABlFSURBVHhe7Z0HWFXHEsefJRp7LzF2TeyxP2NLYkms2LsioqigYm+oKBYUpClIB7ELgjTBDmLvvcYesceo2DXJ+7+ZQX0Ki76oifd6zv2+34f+zzl7y86Znd2d3fMvekFH0yhFHe2gFHW0g1LU0Q5KUUc7KEUd7aAUdbSDUtTRDkpRRzsoRR3toBR1tINS1NEOSlFHOyhFHe2gFHW0g1LU0Q5KUUc7KEUd7aAUdbSDUtTRDkpRRzsoRR3toBR1tINS1NEOSlFHOyhFHe2gFHW0g1LU0Q5KUUc7KEUd7aAUPyoZM2REpkyZlceMlQwZMih1A0ApflRy5MiBPn36IWxlOCKjojF//gJ4ennDwdEJEybaYsTI0bAeOhwW/Qegl6kZunXvic5dutHfHmjQsAHSpUunLPdjkCdPPnTu2h1ly5ZVHjcAlOJHJ2/e/Bg2fDQePnwEft1Nuo+jx09h7YZ4LFy8HM5z5mHy1JkYM94WQ4aNhuXg4RhsPRK2U6Zj8OAhyElGxOV8LGPIl78ATM3MEbwiHL37mCN9+vTK8wwApWgQZM6cBa1N2uPEyZ9x9+49HDh4GLFr1yNo0VK4kAHYkgGMGjsBVkNGwGLAYJhbWKKnaV8MGzEGU6dNR5EiRaQcNoJ0Kcr+u8iRMycGDLRC6MpIbN+5F1aDhijPMyCUokHAFVfky+Ko36AR4uI24cqV69i0eRtW0I/r4z8fDrPdMMF2KkaMHo9BZAQDrYaSIQyCmXl/MoKxcJztgooVK0pZ6dOl/1u9Qa5cuWBlNQjr1m3Azt37EJewFeNtJhpUc5QGStFg4B+w7Ffl0bhpC6wIDcfxEz8jZvU6LFi8DHPnecPewRmTyO2PGjsRQ+nOt6KmwGrIcPS3tMZo8g7ePv6oX79Bclnkhj+0NyhQoACGUjyyZct2XLhwie76PVgblwAPT29kyZJFeY2BoRQNikyZMqF2nXpo1sIEC8n98x22YmUU5i9cCg8vX8ya7YrJ02Zi3ITJYgjsEYaNHIuR9HcK6cuDQ9G+Q0cpK91zT/C+RlCkyJcYO2489u8/hGvXb+LQ4WNYvXYj1sdtRkTUKhQqVEh5nQGiFA2OrFmzoV37zmjfsSvcPbzlTlsZGSOeYJ63P8UEHrCf5YSpMxxga2dPXmGGBIl202fBba4nNsYnUHs8+GV572oE5cqVh739TJw8eRo3bt7CkaPHEU/uPmbNOsSu2yj/rlSxkvJaA0UpGiT58uVPDvb6DYSPbwC2bt+NsIhVWLwsBAFBi+FJ7t7d0xeuVOHObh5wcJ4DJ1d38RJB5C32HzxCweEM8QJcHscFKd8jLWrW+jcWL1lKd/sNPHj4GD+fPovtO3Zj7fo4hIZHIYTikr37D6Jp05+U1xswStFgKVW6NGbMdII1df3mUcXuoEibY4KwiGgsCwnDoqXB1DQsgf/8hfD2mw/fgCAELliMpctDEbtmPS5eugxvb1989nygigf+8h8q37lzF+rUqZvm/eU+Rij3w9+d08e5h86dO5GvXwDq1W/42jWsX78BLS37o2q1mvDy8pL3rV+vIW7cuIXTpy+Q41bK+714kYqVKhvke6Z9T0X+j1A0aN408M87j5MnT8j3ZMPu06evRIn8L5W7f394kO/iCgU2Uhsbt+m1a2xsbDB82Aj8V/n/9w90k6eYvj514k/UrVtP9pznrVylqkT5vK6f11twc3b69Hls375TjODcuQs4Qj0B7gXw+v/bt2/J48WLFy/l+V9/vYXbt2/j5cuX8t153/zbt2/L97p79668h5w/4n3v3r2T9/Lq1Svy8/3y77t378vj8uXL+W9v3rx9g9d3/3kC/7nz5/Hz2bPypu9/8/v69evX0r5z+f8GStFgYCO4cvUavJ/k/f757rvv5LHkUvn9yF9fvlze5/Xrr1eWf/kE/9v83180S/4/6lJ/i1LU0Q5KUUc7KEUd7aAUdbSDUtTRDkpRRzsoRR3toBR1tINS1NEOSlFHOyhFHe2gFHW0g1LU0Q5KUUc7KEUd7aAUdbSDUtTRDkpRRzsoRR3toBR1tINS1NEOSlFHOyhFHe2gFHW0g1LU0Q5KUUc7KEUd7aAUdbSDUtTRDkpRRzsoRR3toBR1tINSvGTwf8BwhBvjC90aP4AAAAASUVORK5CYII=";
  const XMON_LOGO_HTML = `<img src="${XMON_LOGO_B64}" alt="XMON" class="xmon-logo-img" />`;


  // ============================================================
  // UTILITY FUNCTIONS (preserved from v1)
  // ============================================================
  function deepQuery(selector, root = document) {
    try {
      const found = root.querySelector(selector);
      if (found) return found;
    } catch (e) {}
    const all = root.querySelectorAll ? Array.from(root.querySelectorAll('*')) : [];
    for (const el of all) {
      if (el.shadowRoot) {
        const res = deepQuery(selector, el.shadowRoot);
        if (res) return res;
      }
    }
    return null;
  }

  function deepQueryAll(selector, root = document) {
    let results = [];
    try {
      results.push(...Array.from(root.querySelectorAll(selector)));
    } catch (e) {}
    const all = root.querySelectorAll ? Array.from(root.querySelectorAll('*')) : [];
    for (const el of all) {
      if (el.shadowRoot) {
        results.push(...deepQueryAll(selector, el.shadowRoot));
      }
    }
    return results;
  }

  function isElementVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && (rect.width > 0 || rect.height > 0);
  }

  function isButtonEnabled(el) {
    if (!el) return false;
    const disabled = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
    return !disabled && isElementVisible(el);
  }

  function clickElement(el) {
    if (!el) return;
    const innerBtn = el.shadowRoot?.querySelector('button, #radioContainer, [role="button"]') || el;
    innerBtn.click();
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function waitFor(predicate, timeoutMs = 10000, pollIntervalMs = 100) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (state.stopRequested) throw new Error('CANCELLED_BY_USER');
      try {
        const res = predicate();
        if (res) return res;
      } catch (e) {}
      await sleep(pollIntervalMs);
    }
    return null;
  }

  // Generate a unique ID for each video in queue
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  }

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const state = {
    // Queue
    queue: [],              // Array of { id, file, name, size, status, error, retryCount }
    processedIds: new Set(),// Track processed video IDs to prevent duplicates
    
    // Process control
    isRunning: false,
    isPaused: false,
    stopRequested: false,
    
    // Batch management
    batchSize: 15,
    currentBatch: 0,
    totalBatches: 0,
    
    // Counters
    totalCount: 0,
    uploadedCount: 0,
    publishedCount: 0,
    failedCount: 0,
    
    // Draft publisher config (preserved from v1)
    config: {
      visibility: 'PUBLIC',
      notMadeForKids: true,
      autoScroll: true,
      autoPublishDrafts: true,
      delayBetweenVideos: 800,
      delayBetweenBatches: 3000,
      maxRetries: 2
    },
    
    // Current status message
    statusMessage: 'Ready. Add videos to begin.',
    statusType: 'idle', // idle, active, paused, error
    
    // Active tab
    activeTab: 'upload',
    
    // UI minimized
    isMinimized: false,
    
    // Current processing info
    currentVideoName: '',
    
    // Active animated alert/notification
    activeAlert: null // { type: 'daily_limit'|'format_error'|'duplicate'|'error', title, message, raw }
  };

  // Video status enum
  const STATUS = {
    WAITING: 'waiting',
    UPLOADING: 'uploading',
    UPLOADED: 'uploaded',
    DRAFT: 'draft',
    PUBLISHING: 'publishing',
    PUBLISHED: 'published',
    FAILED: 'failed'
  };

  // ============================================================
  // ESCAPE HTML HELPER
  // ============================================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ============================================================
  // ANIMATED ERROR NOTIFICATION & ALERT SYSTEM
  // ============================================================
  function showAnimatedNotification(options) {
    const opts = (typeof options === 'string' ? { message: options, title: 'Notification' } : options) || {};
    const title = opts.title || (opts.type === 'daily_limit' ? 'Daily upload limit reached' : 'Notification');
    const message = opts.message || '';
    const type = opts.type || 'info';
    const duration = opts.duration || (type === 'daily_limit' ? 12000 : 5000);
    const persistent = opts.persistent || (type === 'daily_limit');

    let hub = document.getElementById('xmon-toast-hub');
    if (!hub) {
      hub = document.createElement('div');
      hub.id = 'xmon-toast-hub';
      hub.className = 'xmon-toast-hub';
      document.body.appendChild(hub);
    }

    // Remove existing duplicate notification of same type
    const existingSame = hub.querySelector(`[data-alert-type="${type}"]`);
    if (existingSame) existingSame.remove();

    const card = document.createElement('div');
    const isDailyLimit = (type === 'daily_limit');
    card.className = `xmon-toast-card ${isDailyLimit ? 'daily-limit' : type}`;
    card.dataset.alertType = type;

    const icon = isDailyLimit
      ? ICONS.alertTriangle
      : (type === 'success' ? ICONS.check : type === 'warning' ? ICONS.alertTriangle : ICONS.alertCircle);

    card.innerHTML = `
      <div class="xmon-toast-icon-box">
        ${icon}
        ${isDailyLimit ? '<div class="xmon-alert-beacon"></div>' : ''}
      </div>
      <div class="xmon-toast-body">
        <div class="xmon-toast-title">${escapeHtml(title)}</div>
        <div class="xmon-toast-text">${escapeHtml(message)}</div>
        ${isDailyLimit ? '<div class="xmon-toast-sub">YouTube quota reached • Queue paused safely for 24 hours</div>' : ''}
      </div>
      <button class="xmon-toast-close" type="button" title="Close">${ICONS.x}</button>
      ${!persistent ? `<div class="xmon-toast-progress-bar" style="animation-duration: ${duration}ms"></div>` : ''}
    `;

    const closeBtn = card.querySelector('.xmon-toast-close');
    if (closeBtn) {
      closeBtn.onclick = () => {
        card.style.animation = 'xmon-toast-out 0.25s forwards';
        setTimeout(() => card.remove(), 250);
      };
    }

    hub.appendChild(card);

    if (!persistent) {
      setTimeout(() => {
        if (card.parentNode) {
          card.style.animation = 'xmon-toast-out 0.25s forwards';
          setTimeout(() => card.remove(), 250);
        }
      }, duration);
    }
  }

  // Backward compatible showToast redirect
  function showToast(message, type = 'info', duration = 4000) {
    const titles = {
      success: 'Success',
      error: 'Error Occurred',
      warning: 'Warning',
      info: 'Notification',
      daily_limit: 'Daily upload limit reached'
    };
    showAnimatedNotification({
      title: titles[type] || 'Notification',
      message: message,
      type: type,
      duration: duration
    });
  }

  // ============================================================
  // YOUTUBE STUDIO ERROR DETECTION ENGINE
  // ============================================================
  function detectYouTubeUploadError() {
    try {
      const errorSelectors = [
        '#error-short-message',
        '.error-short-message',
        '#error-message',
        '.error-message',
        'ytcp-banner[type="error"]',
        'ytcp-toast[type="error"]',
        '.dialog-error',
        '[role="alert"]',
        '.error-area',
        'ytcp-uploads-file-item #error-message',
        'ytcp-video-row .error-badge'
      ];

      const detectedTexts = [];

      for (const sel of errorSelectors) {
        const els = deepQueryAll(sel);
        for (const el of els) {
          if (el && isElementVisible(el)) {
            const txt = (el.textContent || '').trim();
            if (txt) detectedTexts.push(txt);
          }
        }
      }

      // Scan active upload dialog text directly
      const uploadDialog = deepQuery('ytcp-uploads-dialog');
      if (uploadDialog && isElementVisible(uploadDialog)) {
        const dialogText = uploadDialog.textContent || '';
        if (/daily\s*upload\s*limit/i.test(dialogText) || /upload\s*more\s*videos\s*in\s*24\s*hours/i.test(dialogText)) {
          detectedTexts.push(dialogText);
        }
      }

      // Check paper/ytcp toasts
      const toasts = deepQueryAll('ytcp-toast, paper-toast');
      for (const t of toasts) {
        if (t && isElementVisible(t)) {
          detectedTexts.push(t.textContent || '');
        }
      }

      const fullText = detectedTexts.join(' ').toLowerCase();

      // PATTERN 1: Daily Upload Limit Reached
      if (
        fullText.includes('daily upload limit reached') ||
        fullText.includes('upload more videos in 24 hours') ||
        fullText.includes('daily limit reached') ||
        fullText.includes('upload limit reached') ||
        fullText.includes('reached your daily upload limit')
      ) {
        return {
          type: 'daily_limit',
          title: 'Daily upload limit reached',
          message: 'You can upload more videos in 24 hours.',
          raw: 'Daily upload limit reached. You can upload more videos in 24 hours.'
        };
      }

      // PATTERN 2: Video format unsupported
      if (
        fullText.includes('processing abandoned') ||
        fullText.includes('format not supported') ||
        fullText.includes('invalid file format') ||
        fullText.includes('video could not be processed')
      ) {
        return {
          type: 'format_error',
          title: 'Unsupported Video Format',
          message: 'YouTube could not process this video format.',
          raw: 'Video format unsupported'
        };
      }

      // PATTERN 3: Duplicate video
      if (fullText.includes('duplicate video') || fullText.includes('already uploaded')) {
        return {
          type: 'duplicate',
          title: 'Duplicate Video Detected',
          message: 'This video has already been uploaded to your channel.',
          raw: 'Duplicate video'
        };
      }

      // PATTERN 4: Generic upload error
      if (fullText.includes('upload failed') || fullText.includes('server error')) {
        return {
          type: 'error',
          title: 'Upload Error',
          message: 'YouTube encountered a server error during upload.',
          raw: 'Upload error'
        };
      }
    } catch (e) {
      console.debug('[XMON] Error detection notice:', e);
    }

    return null;
  }

  // ============================================================
  // QUEUE PERSISTENCE (save metadata only, not file data)
  // ============================================================
  function saveQueueState() {
    const queueMeta = state.queue.map(v => ({
      id: v.id,
      name: v.name,
      size: v.size,
      status: v.status,
      error: v.error || null,
      retryCount: v.retryCount || 0
    }));
    
    const persistData = {
      queueMeta,
      config: state.config,
      totalCount: state.totalCount,
      uploadedCount: state.uploadedCount,
      publishedCount: state.publishedCount,
      failedCount: state.failedCount,
      currentBatch: state.currentBatch,
      totalBatches: state.totalBatches,
      batchSize: state.batchSize
    };
    
    try {
      chrome.storage.local.set({ xmonQueueState: persistData });
    } catch (e) {
      console.warn('[XMON] Failed to persist queue state:', e);
    }
  }

  function restoreQueueState() {
    try {
      chrome.storage.local.get(['xmonQueueState'], (result) => {
        if (result.xmonQueueState) {
          const data = result.xmonQueueState;
          if (data.config) state.config = { ...state.config, ...data.config };
          // Restore counters only - files can't be restored from storage
          state.uploadedCount = data.uploadedCount || 0;
          state.publishedCount = data.publishedCount || 0;
          state.failedCount = data.failedCount || 0;
          state.currentBatch = data.currentBatch || 0;
          state.totalBatches = data.totalBatches || 0;
          // Update UI with restored config
          renderUI();
        }
      });
    } catch (e) {
      console.warn('[XMON] Failed to restore queue state:', e);
    }
  }

  // ============================================================
  // FIND DRAFT ROWS (preserved & enhanced from v1)
  // ============================================================
  function findDraftRows() {
    const rows = Array.from(document.querySelectorAll('ytcp-video-row'));
    const drafts = [];

    for (const row of rows) {
      if (row.getAttribute('data-xmon-status') === 'published') continue;

      let editBtn = row.querySelector('#edit-draft-button, .edit-draft-button')
        || deepQuery('#edit-draft-button', row);

      if (!editBtn) {
        const buttons = Array.from(row.querySelectorAll('ytcp-button, button, a'));
        editBtn = buttons.find(b => /edit\s*draft/i.test(b.textContent || b.getAttribute('aria-label') || ''));
      }

      const visCell = row.querySelector('.cell-body.visibility, [class*="visibility"]') || row;
      const isDraftText = /draft/i.test(visCell.textContent || '');

      if (editBtn && (isDraftText || editBtn)) {
        const titleEl = row.querySelector('#video-title, .video-title, #title-link');
        const title = titleEl ? titleEl.textContent.trim() : 'Draft Video';
        drafts.push({ row, editBtn, title });
      }
    }

    return drafts;
  }

  // ============================================================
  // PUBLISH SINGLE DRAFT (preserved & enhanced from v1)
  // ============================================================
  async function publishSingleDraft(draftItem, index, total) {
    const { row, editBtn, title } = draftItem;
    state.currentVideoName = title;
    updateStatus(`Publishing ${index}/${total}: ${title.substring(0, 30)}...`, 'active');
    row.setAttribute('data-xmon-status', 'processing');
    row.style.outline = '2px solid #3ea6ff';

    // Step 1: Click "Edit draft"
    clickElement(editBtn);

    // Step 2: Wait for editor dialog
    const dialog = await waitFor(() => {
      const d = document.querySelector('ytcp-uploads-dialog, ytcp-video-metadata-editor');
      return (d && isElementVisible(d)) ? d : null;
    }, 12000);

    if (!dialog) throw new Error('Editor dialog did not open');
    await sleep(400);

    // Step 3: Audience - "Not made for kids"
    if (state.config.notMadeForKids) {
      const notForKidsRadio = await waitFor(() => {
        return deepQuery('tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]', dialog)
          || deepQueryAll('tp-yt-paper-radio-button', dialog).find(el =>
              /not made for kids/i.test(el.textContent) || el.getAttribute('name') === 'VIDEO_MADE_FOR_KIDS_NOT_MFK'
            );
      }, 5000);

      if (notForKidsRadio) {
        const isChecked = notForKidsRadio.getAttribute('aria-checked') === 'true' || notForKidsRadio.checked;
        if (!isChecked) {
          clickElement(notForKidsRadio);
          await sleep(300);
        }
      }
    }

    // Step 4: Navigate to Visibility step
    const stepperTabs = deepQueryAll('ytcp-stepper-step', dialog);
    const visTab = stepperTabs.find(tab => /visibility/i.test(tab.textContent)) || stepperTabs[stepperTabs.length - 1];

    if (visTab && isButtonEnabled(visTab)) {
      clickElement(visTab);
      await sleep(400);
    }

    // Click "Next" if needed to reach visibility
    let nextTries = 0;
    while (nextTries < 6) {
      const pubRadio = deepQuery(`tp-yt-paper-radio-button[name="${state.config.visibility}"]`, dialog);
      if (pubRadio && isElementVisible(pubRadio)) break;

      const nextBtn = deepQuery('#next-button', dialog);
      if (nextBtn && isButtonEnabled(nextBtn)) {
        clickElement(nextBtn);
        await sleep(400);
      } else {
        break;
      }
      nextTries++;
    }

    // Step 5: Select Visibility
    const targetVisibility = state.config.visibility.toUpperCase();
    const visRadio = await waitFor(() => {
      const r = deepQuery(`tp-yt-paper-radio-button[name="${targetVisibility}"]`, dialog)
        || deepQueryAll('tp-yt-paper-radio-button', dialog).find(el =>
            new RegExp(`^${targetVisibility}`, 'i').test(el.textContent.trim())
          );
      return (r && isElementVisible(r)) ? r : null;
    }, 6000);

    if (!visRadio) throw new Error(`Could not find ${targetVisibility} radio button`);

    const isVisChecked = visRadio.getAttribute('aria-checked') === 'true' || visRadio.checked;
    if (!isVisChecked) {
      clickElement(visRadio);
      await sleep(300);
    }

    // Step 6: Click Save/Publish/Done
    const doneBtn = await waitFor(() => {
      const btn = deepQuery('#done-button, #save-button, ytcp-button#done-button', dialog)
        || deepQueryAll('ytcp-button', dialog).find(b => /^(publish|save|done)$/i.test(b.textContent.trim()));
      return (btn && isButtonEnabled(btn)) ? btn : null;
    }, 8000);

    if (!doneBtn) throw new Error('Publish/Done button remained disabled or was not found');
    clickElement(doneBtn);

    // Step 7: Wait for dialog dismiss
    await waitFor(() => {
      const shareClose = deepQuery('ytcp-video-share-dialog #close-button, ytcp-video-share-dialog [aria-label="Close"]');
      if (shareClose && isElementVisible(shareClose)) {
        clickElement(shareClose);
      }
      const activeDialog = document.querySelector('ytcp-uploads-dialog');
      return !activeDialog || !isElementVisible(activeDialog) || activeDialog.getAttribute('aria-hidden') === 'true';
    }, 10000);

    row.setAttribute('data-xmon-status', 'published');
    row.style.outline = '2px solid #2ecc71';
    state.publishedCount++;
  }

  // ============================================================
  // UPLOAD VIDEOS TO YOUTUBE
  // ============================================================
  async function uploadBatchToYouTube(batchFiles) {
    // Navigate to upload page if not already there
    const uploadUrl = 'https://studio.youtube.com/channel/';
    
    // Try to find the upload button on the YouTube Studio page
    // YouTube Studio has an upload button in the top bar
    const uploadButton = await findUploadButton();
    
    if (!uploadButton) {
      throw new Error('Could not find the upload button on YouTube Studio');
    }
    
    // Click the upload button to open upload dialog
    clickElement(uploadButton);
    await sleep(1500);
    
    // Wait for the upload dialog / file input
    const fileInput = await waitFor(() => {
      // YouTube Studio uses a file input element
      const inputs = document.querySelectorAll('input[type="file"]');
      for (const input of inputs) {
        if (input.accept && input.accept.includes('video')) return input;
      }
      // Also check shadow DOM
      const deepInput = deepQuery('input[type="file"][accept*="video"]');
      if (deepInput) return deepInput;
      // Fallback: any visible file input
      return inputs.length > 0 ? inputs[inputs.length - 1] : null;
    }, 10000);
    
    if (!fileInput) {
      throw new Error('Upload dialog file input not found');
    }
    
    // Create a DataTransfer to set files on the input
    const dt = new DataTransfer();
    for (const file of batchFiles) {
      dt.items.add(file);
    }
    
    fileInput.files = dt.files;
    
    // Dispatch change event to trigger YouTube's upload handler
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    await sleep(2000);
    
    return true;
  }
  
  async function findUploadButton() {
    // Method 1: Direct button with upload icon
    let btn = deepQuery('#upload-icon, #create-icon, [aria-label="Upload videos"], [aria-label="Create"]');
    if (btn && isElementVisible(btn)) return btn;
    
    // Method 2: ytcp-button with upload text
    const buttons = deepQueryAll('ytcp-button, button');
    for (const b of buttons) {
      const text = (b.textContent || '').trim().toLowerCase();
      const label = (b.getAttribute('aria-label') || '').toLowerCase();
      if (text.includes('upload') || label.includes('upload') || text.includes('create') || label.includes('create')) {
        if (isElementVisible(b)) return b;
      }
    }
    
    // Method 3: The "CREATE" button in top bar
    btn = deepQuery('#create-button, #upload-button');
    if (btn && isElementVisible(btn)) return btn;
    
    return null;
  }
  
  // Wait for all videos in batch to finish uploading on YouTube
  async function waitForBatchUploadComplete(batchCount) {
    updateStatus(`Waiting for ${batchCount} videos to upload...`, 'active');
    
    // YouTube shows progress for each video - we need to wait until all are done
    // This monitors the upload dialog for completion indicators
    const maxWaitMs = batchCount * 120000; // 2 minutes per video max
    const start = Date.now();
    
    while (Date.now() - start < maxWaitMs) {
      if (state.stopRequested) throw new Error('CANCELLED_BY_USER');
      if (state.isPaused) {
        await waitForResume();
      }
      
      // Real-time check for YouTube Studio upload errors & daily limits
      const detectedError = detectYouTubeUploadError();
      if (detectedError) {
        console.warn('[XMON] Upload error detected:', detectedError);
        if (detectedError.type === 'daily_limit') {
          state.activeAlert = detectedError;
          updateStatus('Daily upload limit reached. You can upload more videos in 24 hours.', 'error');
          showAnimatedNotification({
            type: 'daily_limit',
            title: detectedError.title,
            message: detectedError.message,
            persistent: true
          });
          state.isPaused = true;
          renderUI();
          saveQueueState();
          throw new Error('DAILY_UPLOAD_LIMIT_REACHED');
        } else {
          showAnimatedNotification({
            type: detectedError.type,
            title: detectedError.title,
            message: detectedError.message,
            duration: 6000
          });
        }
      }
      
      // Check for upload completion indicators
      const progressBars = deepQueryAll('ytcp-video-upload-progress, .upload-progress');
      const uploadRows = deepQueryAll('.upload-item, ytcp-uploads-file-item, [class*="upload"]');
      
      // Check if all uploads show as complete
      let allComplete = false;
      
      // Method 1: Check for "Processing" or "Checks complete" text
      const statusTexts = deepQueryAll('.progress-label, .status-text, [class*="status"]');
      let completedCount = 0;
      for (const st of statusTexts) {
        const text = (st.textContent || '').toLowerCase();
        if (text.includes('processing') || text.includes('complete') || text.includes('published') || text.includes('draft') || text.includes('uploading complete')) {
          completedCount++;
        }
      }
      
      if (completedCount >= batchCount) {
        allComplete = true;
      }
      
      // Method 2: Check for upload dialog close/save button being enabled
      const closeOrSave = deepQuery('#close-button:not([disabled]), #save-button:not([disabled])');
      
      // Method 3: Check percentage indicators  
      const percentTexts = deepQueryAll('[class*="percent"], .progress-text');
      let allAt100 = percentTexts.length >= batchCount;
      for (const pt of percentTexts) {
        if (!pt.textContent.includes('100')) {
          allAt100 = false;
          break;
        }
      }
      
      if (allComplete || allAt100) {
        updateStatus('Batch upload complete. Processing...', 'active');
        await sleep(3000); // Give YouTube time to process
        
        // Close the upload dialog if it's still open
        const closeBtn = deepQuery('#close-button, [aria-label="Close"]');
        if (closeBtn && isElementVisible(closeBtn) && isButtonEnabled(closeBtn)) {
          clickElement(closeBtn);
          await sleep(1000);
        }
        
        return true;
      }
      
      await sleep(2500); // Check every 2.5 seconds
    }
    
    // Timeout - but don't fail completely, some videos may have uploaded
    console.warn('[XMON] Batch upload wait timed out');
    return false;
  }
  
  async function waitForResume() {
    while (state.isPaused && !state.stopRequested) {
      await sleep(500);
    }
  }

  // ============================================================
  // MAIN QUEUE PROCESSOR
  // ============================================================
  async function processQueue() {
    if (state.isRunning) return;
    
    state.isRunning = true;
    state.stopRequested = false;
    state.isPaused = false;
    
    const waitingVideos = state.queue.filter(v => v.status === STATUS.WAITING || v.status === STATUS.FAILED);
    if (waitingVideos.length === 0) {
      showToast('No videos to process in queue.', 'warning');
      state.isRunning = false;
      renderUI();
      return;
    }
    
    state.totalCount = state.queue.length;
    state.totalBatches = Math.ceil(waitingVideos.length / state.batchSize);
    state.currentBatch = 0;
    state.uploadedCount = 0;
    state.publishedCount = 0;
    state.failedCount = 0;
    
    showToast(`Starting queue: ${waitingVideos.length} videos in ${state.totalBatches} batches`, 'info');
    renderUI();
    
    try {
      // Process in batches of 15
      for (let batchStart = 0; batchStart < waitingVideos.length; batchStart += state.batchSize) {
        if (state.stopRequested) break;
        
        // Pause handling
        if (state.isPaused) {
          updateStatus('Queue paused. Click Resume to continue.', 'paused');
          renderUI();
          await waitForResume();
          if (state.stopRequested) break;
        }
        
        state.currentBatch++;
        const batchEnd = Math.min(batchStart + state.batchSize, waitingVideos.length);
        const currentBatchVideos = waitingVideos.slice(batchStart, batchEnd);
        const batchFiles = currentBatchVideos.filter(v => v.file).map(v => v.file);
        
        updateStatus(`Batch ${state.currentBatch}/${state.totalBatches} - Uploading ${currentBatchVideos.length} videos...`, 'active');
        renderUI();
        
        // Mark batch as uploading
        for (const video of currentBatchVideos) {
          if (state.processedIds.has(video.id)) continue;
          video.status = STATUS.UPLOADING;
        }
        renderUI();
        
        try {
          // Upload the batch files
          if (batchFiles.length > 0) {
            await uploadBatchToYouTube(batchFiles);
            
            // Wait for upload completion
            const uploadSuccess = await waitForBatchUploadComplete(batchFiles.length);
            
            // Mark as uploaded
            for (const video of currentBatchVideos) {
              if (video.status === STATUS.UPLOADING) {
                video.status = uploadSuccess ? STATUS.UPLOADED : STATUS.FAILED;
                if (uploadSuccess) {
                  state.uploadedCount++;
                  state.processedIds.add(video.id);
                } else {
                  state.failedCount++;
                  video.error = 'Upload timed out';
                }
              }
            }
          }
          
          renderUI();
          saveQueueState();
          
          // Auto-publish drafts if enabled
          if (state.config.autoPublishDrafts) {
            updateStatus(`Batch ${state.currentBatch}/${state.totalBatches} - Publishing drafts...`, 'active');
            await sleep(2000); // Wait for YouTube to create drafts
            
            // Navigate to content page to find drafts
            await navigateToContent();
            await sleep(3000);
            
            // Publish all available drafts
            await publishAllDrafts();
          }
          
          // Delay between batches
          if (batchEnd < waitingVideos.length) {
            updateStatus(`Batch ${state.currentBatch} complete. Next batch in ${state.config.delayBetweenBatches / 1000}s...`, 'active');
            await sleep(state.config.delayBetweenBatches);
          }
          
        } catch (batchErr) {
          if (batchErr.message === 'CANCELLED_BY_USER') break;
          
          console.error('[XMON] Batch error:', batchErr);
          
          const isDailyLimit = (batchErr.message === 'DAILY_UPLOAD_LIMIT_REACHED' || (state.activeAlert && state.activeAlert.type === 'daily_limit'));
          
          if (isDailyLimit) {
            console.warn('[XMON] Daily upload limit reached. Halting queue safely.');
            state.isRunning = false;
            state.isPaused = true;
            
            // Mark current batch videos as failed with the exact daily limit explanation
            for (const video of currentBatchVideos) {
              if (video.status === STATUS.UPLOADING) {
                video.status = STATUS.FAILED;
                video.error = 'Daily upload limit reached. You can upload more videos in 24 hours.';
                state.failedCount++;
              }
            }
            
            // Preserve remaining videos in WAITING status for tomorrow
            for (let i = batchEnd; i < waitingVideos.length; i++) {
              if (waitingVideos[i].status === STATUS.UPLOADING) {
                waitingVideos[i].status = STATUS.WAITING;
              }
            }
            
            state.activeAlert = {
              type: 'daily_limit',
              title: 'Daily upload limit reached',
              message: 'You can upload more videos in 24 hours.'
            };
            
            updateStatus('Daily upload limit reached. You can upload more videos in 24 hours.', 'error');
            showAnimatedNotification({
              type: 'daily_limit',
              title: 'Daily upload limit reached',
              message: 'You can upload more videos in 24 hours.',
              persistent: true
            });
            
            renderUI();
            saveQueueState();
            await sleep(1500);
            await closeStuckDialogs();
            
            // Stop entire queue immediately - do not attempt subsequent batches
            break;
          }
          
          // Mark remaining uploading videos as failed
          for (const video of currentBatchVideos) {
            if (video.status === STATUS.UPLOADING) {
              video.status = STATUS.FAILED;
              video.error = batchErr.message;
              state.failedCount++;
            }
          }
          
          showToast(`Batch ${state.currentBatch} had errors: ${batchErr.message}`, 'error');
          
          // Try to close any stuck dialogs
          await closeStuckDialogs();
          
          // Continue to next batch
          await sleep(2000);
        }
        
        renderUI();
        saveQueueState();
      }
    } finally {
      state.isRunning = false;
      state.isPaused = false;
      state.currentVideoName = '';
      
      const finalMsg = `Complete! Uploaded: ${state.uploadedCount}, Published: ${state.publishedCount}, Failed: ${state.failedCount}`;
      updateStatus(finalMsg, 'idle');
      saveQueueState();
      renderUI();
      
      showToast(finalMsg, state.failedCount > 0 ? 'warning' : 'success', 5000);
    }
  }

  // ============================================================
  // DRAFT PUBLISHER (standalone mode - preserved from v1)
  // ============================================================
  async function publishAllDrafts() {
    let publishRound = 0;
    const maxRounds = 5; // Prevent infinite loops
    
    while (!state.stopRequested && publishRound < maxRounds) {
      if (state.isPaused) {
        await waitForResume();
        if (state.stopRequested) break;
      }
      
      const drafts = findDraftRows();
      if (drafts.length === 0) {
        // Auto scroll to find more
        if (state.config.autoScroll) {
          window.scrollBy(0, 1000);
          await sleep(2000);
          const moreDrafts = findDraftRows();
          if (moreDrafts.length === 0) break;
        } else {
          break;
        }
      }
      
      const currentDraft = drafts[0];
      if (!currentDraft) break;
      
      const idx = state.publishedCount + 1;
      const total = drafts.length + state.publishedCount;
      
      try {
        await publishSingleDraft(currentDraft, idx, total);
        updateStatus(`Published: ${currentDraft.title.substring(0, 30)}`, 'active');
        
        // Update queue items that match
        for (const qItem of state.queue) {
          if (qItem.status === STATUS.UPLOADED || qItem.status === STATUS.DRAFT) {
            // Try to match by name
            if (currentDraft.title.includes(qItem.name.replace(/\.[^/.]+$/, '').substring(0, 20))) {
              qItem.status = STATUS.PUBLISHED;
              break;
            }
          }
        }
        renderUI();
      } catch (err) {
        if (err.message === 'CANCELLED_BY_USER') break;
        console.error(`[XMON] Error publishing "${currentDraft.title}":`, err);
        currentDraft.row.setAttribute('data-xmon-status', 'failed');
        currentDraft.row.style.outline = '2px solid #e74c3c';
        state.failedCount++;
        
        // Close stuck modals
        await closeStuckDialogs();
      }
      
      await sleep(state.config.delayBetweenVideos);
      publishRound++;
      if (drafts.length > 1) publishRound = 0; // Reset if more drafts found
    }
  }
  
  // Standalone draft publisher (for the "Publish" tab)
  async function runStandaloneDraftPublisher() {
    if (state.isRunning) return;
    state.isRunning = true;
    state.stopRequested = false;
    state.isPaused = false;
    state.publishedCount = 0;
    state.failedCount = 0;
    
    updateStatus('Starting draft publishing...', 'active');
    renderUI();
    
    try {
      await publishAllDrafts();
    } finally {
      state.isRunning = false;
      const msg = `Draft publishing complete! Published: ${state.publishedCount}, Failed: ${state.failedCount}`;
      updateStatus(msg, 'idle');
      renderUI();
      showToast(msg, state.failedCount > 0 ? 'warning' : 'success', 5000);
    }
  }

  // ============================================================
  // HELPER: Navigate to content page
  // ============================================================
  async function navigateToContent() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/videos')) return; // Already on content page
    
    // Try clicking the "Content" menu item
    const menuItems = deepQueryAll('a, [role="tab"], tp-yt-paper-tab');
    for (const item of menuItems) {
      if (/^content$/i.test((item.textContent || '').trim())) {
        clickElement(item);
        await sleep(2000);
        return;
      }
    }
    
    // Fallback: navigate via URL
    const channelMatch = window.location.href.match(/\/channel\/([^/]+)/);
    if (channelMatch) {
      window.location.href = `https://studio.youtube.com/channel/${channelMatch[1]}/videos/upload`;
      await sleep(4000);
    }
  }

  // ============================================================
  // HELPER: Close stuck dialogs
  // ============================================================
  async function closeStuckDialogs() {
    const closeSelectors = [
      '#close-button',
      '[aria-label="Close"]',
      'ytcp-button#close-button',
      'ytcp-video-share-dialog #close-button'
    ];
    
    for (const sel of closeSelectors) {
      const btn = deepQuery(sel);
      if (btn && isElementVisible(btn)) {
        clickElement(btn);
        await sleep(500);
      }
    }
  }

  // ============================================================
  // STATUS UPDATE
  // ============================================================
  function updateStatus(message, type = 'idle') {
    state.statusMessage = message;
    state.statusType = type;
    
    const statusText = document.getElementById('xmon-status-text');
    const statusDot = document.getElementById('xmon-status-dot');
    
    if (statusText) statusText.textContent = message;
    if (statusDot) {
      statusDot.className = 'xmon-status-indicator';
      if (type === 'active') statusDot.classList.add('active');
      else if (type === 'paused') statusDot.classList.add('paused');
      else if (type === 'error') statusDot.classList.add('error');
    }
  }

  // ============================================================
  // UI CREATION & RENDERING
  // ============================================================
  function createWidget() {
    if (document.getElementById('xmon-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'xmon-widget';
    widget.innerHTML = buildWidgetHTML();
    document.body.appendChild(widget);

    // Hidden file input for click-to-browse
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'xmon-file-input';
    fileInput.className = 'xmon-file-input';
    fileInput.accept = 'video/*';
    fileInput.multiple = true;
    document.body.appendChild(fileInput);

    attachEventListeners();
    restoreQueueState();
  }

  function buildWidgetHTML() {
    const queueCount = state.queue.length;
    const failedCount = state.queue.filter(v => v.status === STATUS.FAILED).length;
    const completedCount = state.queue.filter(v => v.status === STATUS.PUBLISHED || v.status === STATUS.UPLOADED).length;
    const totalProgress = queueCount > 0 ? Math.round((completedCount / queueCount) * 100) : 0;
    const draftsOnScreen = findDraftRows().length;

    // Animated in-widget alert banner HTML
    const alertBannerHTML = state.activeAlert ? `
      <div class="xmon-alert-card ${state.activeAlert.type}" id="xmon-active-alert-box">
        <div class="xmon-alert-header">
          <div class="xmon-alert-icon-wrap">
            ${state.activeAlert.type === 'daily_limit' ? ICONS.alertTriangle : ICONS.alertCircle}
            <div class="xmon-alert-beacon"></div>
          </div>
          <div class="xmon-alert-titles">
            <span class="xmon-alert-title">${escapeHtml(state.activeAlert.title)}</span>
            <span class="xmon-alert-msg">${escapeHtml(state.activeAlert.message)}</span>
          </div>
          <button class="xmon-alert-dismiss" id="xmon-dismiss-alert-btn" title="Dismiss" type="button">
            ${ICONS.x}
          </button>
        </div>
        ${state.activeAlert.type === 'daily_limit' ? `
        <div class="xmon-alert-footer">
          <span class="xmon-alert-badge">24h Cooldown Active</span>
          <span class="xmon-alert-tip">Queue safely paused. Your videos are preserved to resume tomorrow.</span>
        </div>
        ` : ''}
      </div>
    ` : '';

    return `
      <!-- Header -->
      <div class="xmon-header">
        <div class="xmon-brand">
          <div class="xmon-logo">${XMON_LOGO_HTML}</div>
          <div class="xmon-brand-text">
            <span class="xmon-brand-name">XMON</span>
            <span class="xmon-brand-sub">Shorts Publisher</span>
          </div>
        </div>
        <div class="xmon-header-controls">
          <button class="xmon-header-btn" id="xmon-minimize-btn" title="${state.isMinimized ? 'Expand' : 'Minimize'}" type="button">
            ${state.isMinimized ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>` : ICONS.minus}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="xmon-tabs" id="xmon-tabs-bar">
        <button class="xmon-tab ${state.activeTab === 'upload' ? 'active' : ''}" data-tab="upload" type="button">
          <span>Upload</span>
          ${queueCount > 0 ? `<span class="xmon-tab-badge">${queueCount}</span>` : ''}
        </button>
        <button class="xmon-tab ${state.activeTab === 'queue' ? 'active' : ''}" data-tab="queue" type="button">
          <span>Queue</span>
        </button>
        <button class="xmon-tab ${state.activeTab === 'publish' ? 'active' : ''}" data-tab="publish" type="button">
          <span>Publish</span>
          ${draftsOnScreen > 0 ? `<span class="xmon-tab-badge">${draftsOnScreen}</span>` : ''}
        </button>
        <button class="xmon-tab ${state.activeTab === 'settings' ? 'active' : ''}" data-tab="settings" type="button">
          <span>Config</span>
        </button>
      </div>

      <!-- Tab Panels -->
      <!-- UPLOAD TAB -->
      <div class="xmon-tab-panel ${state.activeTab === 'upload' ? 'active' : ''}" id="xmon-panel-upload">
        <div class="xmon-body">
          ${alertBannerHTML}
          <!-- Drop Zone -->
          <div class="xmon-dropzone" id="xmon-dropzone">
            <div class="xmon-drop-icon">${ICONS.upload}</div>
            <div class="xmon-drop-title">Drop Shorts Here</div>
            <div class="xmon-drop-subtitle">or click to browse files</div>
            <div class="xmon-drop-limit">Max 100 videos per session</div>
          </div>

          ${queueCount > 0 ? `
          <!-- Progress -->
          <div class="xmon-progress-section">
            <div class="xmon-progress-header">
              <span class="xmon-progress-label">Overall Progress</span>
              <span class="xmon-progress-value">${completedCount} / ${queueCount}</span>
            </div>
            <div class="xmon-progress-bar-track">
              <div class="xmon-progress-bar-fill ${state.isRunning ? 'active' : ''}" style="width: ${totalProgress}%"></div>
            </div>
            ${state.totalBatches > 0 ? `
            <div class="xmon-batch-info">
              <span class="xmon-batch-label">Current Batch</span>
              <span class="xmon-batch-value">${state.currentBatch} / ${state.totalBatches}</span>
            </div>
            ` : ''}
          </div>

          <!-- Stats -->
          <div class="xmon-stats">
            <div class="xmon-stat">
              <span class="xmon-stat-val info">${queueCount}</span>
              <span class="xmon-stat-lbl">Total</span>
            </div>
            <div class="xmon-stat">
              <span class="xmon-stat-val warning">${state.uploadedCount}</span>
              <span class="xmon-stat-lbl">Uploaded</span>
            </div>
            <div class="xmon-stat">
              <span class="xmon-stat-val success">${state.publishedCount}</span>
              <span class="xmon-stat-lbl">Published</span>
            </div>
            <div class="xmon-stat">
              <span class="xmon-stat-val danger">${state.failedCount}</span>
              <span class="xmon-stat-lbl">Failed</span>
            </div>
          </div>
          ` : ''}

          <!-- Status Bar -->
          <div class="xmon-status-bar">
            <div class="xmon-status-indicator ${state.statusType === 'active' ? 'active' : state.statusType === 'paused' ? 'paused' : state.statusType === 'error' ? 'error' : ''}" id="xmon-status-dot"></div>
            <span class="xmon-status-text" id="xmon-status-text">${state.statusMessage}</span>
          </div>

          <!-- Actions -->
          <div class="xmon-actions">
            ${!state.isRunning ? `
              <button class="xmon-btn xmon-btn-primary" id="xmon-start-btn" type="button" ${queueCount === 0 ? 'disabled' : ''}>
                <span class="xmon-btn-icon">${ICONS.play}</span>
                <span>Start Queue</span>
              </button>
            ` : ''}
            ${state.isRunning && !state.isPaused ? `
              <button class="xmon-btn xmon-btn-warning" id="xmon-pause-btn" type="button">
                <span class="xmon-btn-icon">${ICONS.pause}</span>
                <span>Pause</span>
              </button>
              <button class="xmon-btn xmon-btn-danger" id="xmon-stop-btn" type="button">
                <span class="xmon-btn-icon">${ICONS.stop}</span>
                <span>Stop</span>
              </button>
            ` : ''}
            ${state.isRunning && state.isPaused ? `
              <button class="xmon-btn xmon-btn-success" id="xmon-resume-btn" type="button">
                <span class="xmon-btn-icon">${ICONS.play}</span>
                <span>Resume</span>
              </button>
              <button class="xmon-btn xmon-btn-danger" id="xmon-stop-btn" type="button">
                <span class="xmon-btn-icon">${ICONS.stop}</span>
                <span>Stop</span>
              </button>
            ` : ''}
          </div>

          ${!state.isRunning && queueCount > 0 ? `
          <div class="xmon-actions">
            ${failedCount > 0 ? `
              <button class="xmon-btn xmon-btn-warning" id="xmon-retry-btn" type="button">
                <span class="xmon-btn-icon">${ICONS.refresh}</span>
                <span>Retry Failed (${failedCount})</span>
              </button>
            ` : ''}
            <button class="xmon-btn xmon-btn-secondary" id="xmon-clear-btn" type="button">
              <span class="xmon-btn-icon">${ICONS.trash}</span>
              <span>Clear</span>
            </button>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- QUEUE TAB -->
      <div class="xmon-tab-panel ${state.activeTab === 'queue' ? 'active' : ''}" id="xmon-panel-queue">
        <div class="xmon-body">
          ${alertBannerHTML}
          ${queueCount === 0 ? `
          <div class="xmon-empty-state">
            <div class="xmon-empty-icon">${ICONS.list}</div>
            <div class="xmon-empty-title">Queue is Empty</div>
            <div class="xmon-empty-sub">Drop videos in the Upload tab to begin</div>
          </div>
          ` : `
          <div class="xmon-section-title">Video Queue (${queueCount})</div>
          <div class="xmon-queue-list" id="xmon-queue-list">
            ${state.queue.map((v, i) => `
              <div class="xmon-queue-item status-${v.status}" data-id="${v.id}">
                <span class="xmon-queue-num">${i + 1}</span>
                <span class="xmon-queue-name" title="${v.name}">${v.name}</span>
                <span class="xmon-queue-status ${v.status}">${v.status}</span>
                ${v.status === STATUS.FAILED ? `<button class="xmon-queue-retry-btn" data-retry-id="${v.id}" type="button">Retry</button>` : ''}
              </div>
            `).join('')}
          </div>
          `}
        </div>
      </div>

      <!-- PUBLISH TAB (standalone draft publisher) -->
      <div class="xmon-tab-panel ${state.activeTab === 'publish' ? 'active' : ''}" id="xmon-panel-publish">
        <div class="xmon-body">
          <div class="xmon-section-title">Draft Publisher</div>
          
          <div class="xmon-summary-card">
            <div class="xmon-summary-big" id="xmon-drafts-count">${draftsOnScreen}</div>
            <div class="xmon-summary-label">Drafts on Screen</div>
          </div>

          <div class="xmon-stats" style="grid-template-columns: repeat(2, 1fr);">
            <div class="xmon-stat">
              <span class="xmon-stat-val success">${state.publishedCount}</span>
              <span class="xmon-stat-lbl">Published</span>
            </div>
            <div class="xmon-stat">
              <span class="xmon-stat-val danger">${state.failedCount}</span>
              <span class="xmon-stat-lbl">Skipped</span>
            </div>
          </div>

          <div class="xmon-status-bar">
            <div class="xmon-status-indicator ${state.statusType === 'active' ? 'active' : ''}" id="xmon-pub-status-dot"></div>
            <span class="xmon-status-text" id="xmon-pub-status-text">${state.statusMessage}</span>
          </div>

          <div class="xmon-actions">
            ${!state.isRunning ? `
              <button class="xmon-btn xmon-btn-primary" id="xmon-publish-drafts-btn" type="button">
                <span class="xmon-btn-icon">${ICONS.zap}</span>
                <span>Publish All Drafts</span>
              </button>
            ` : `
              <button class="xmon-btn xmon-btn-danger" id="xmon-stop-publish-btn" type="button">
                <span class="xmon-btn-icon">${ICONS.stop}</span>
                <span>Stop Publishing</span>
              </button>
            `}
          </div>
        </div>
      </div>

      <!-- SETTINGS TAB -->
      <div class="xmon-tab-panel ${state.activeTab === 'settings' ? 'active' : ''}" id="xmon-panel-settings">
        <div class="xmon-body">
          <div class="xmon-section-title">Configuration</div>
          
          <div class="xmon-controls">
            <div class="xmon-control-row">
              <span class="xmon-control-label">Visibility</span>
              <select class="xmon-select" id="xmon-visibility-select">
                <option value="PUBLIC" ${state.config.visibility === 'PUBLIC' ? 'selected' : ''}>Public</option>
                <option value="UNLISTED" ${state.config.visibility === 'UNLISTED' ? 'selected' : ''}>Unlisted</option>
                <option value="PRIVATE" ${state.config.visibility === 'PRIVATE' ? 'selected' : ''}>Private</option>
              </select>
            </div>

            <div class="xmon-control-row">
              <span class="xmon-control-label">Batch Size</span>
              <select class="xmon-select" id="xmon-batch-select">
                <option value="5" ${state.batchSize === 5 ? 'selected' : ''}>5 Videos</option>
                <option value="10" ${state.batchSize === 10 ? 'selected' : ''}>10 Videos</option>
                <option value="15" ${state.batchSize === 15 ? 'selected' : ''}>15 Videos</option>
              </select>
            </div>

            <div class="xmon-divider"></div>
            
            <div class="xmon-control-row">
              <span class="xmon-control-label">Not Made for Kids</span>
              <input type="checkbox" class="xmon-toggle" id="xmon-mfk-toggle" ${state.config.notMadeForKids ? 'checked' : ''} />
            </div>

            <div class="xmon-control-row">
              <span class="xmon-control-label">Auto-Publish Drafts</span>
              <input type="checkbox" class="xmon-toggle" id="xmon-autopub-toggle" ${state.config.autoPublishDrafts ? 'checked' : ''} />
            </div>
            
            <div class="xmon-control-row">
              <span class="xmon-control-label">Auto-Scroll for Drafts</span>
              <input type="checkbox" class="xmon-toggle" id="xmon-autoscroll-toggle" ${state.config.autoScroll ? 'checked' : ''} />
            </div>

            <div class="xmon-divider"></div>

            <div class="xmon-control-row">
              <span class="xmon-control-label">Delay Between Videos</span>
              <select class="xmon-select" id="xmon-delay-select">
                <option value="500" ${state.config.delayBetweenVideos === 500 ? 'selected' : ''}>0.5s</option>
                <option value="800" ${state.config.delayBetweenVideos === 800 ? 'selected' : ''}>0.8s</option>
                <option value="1000" ${state.config.delayBetweenVideos === 1000 ? 'selected' : ''}>1.0s</option>
                <option value="1500" ${state.config.delayBetweenVideos === 1500 ? 'selected' : ''}>1.5s</option>
                <option value="2000" ${state.config.delayBetweenVideos === 2000 ? 'selected' : ''}>2.0s</option>
              </select>
            </div>

            <div class="xmon-control-row">
              <span class="xmon-control-label">Delay Between Batches</span>
              <select class="xmon-select" id="xmon-batch-delay-select">
                <option value="2000" ${state.config.delayBetweenBatches === 2000 ? 'selected' : ''}>2s</option>
                <option value="3000" ${state.config.delayBetweenBatches === 3000 ? 'selected' : ''}>3s</option>
                <option value="5000" ${state.config.delayBetweenBatches === 5000 ? 'selected' : ''}>5s</option>
                <option value="10000" ${state.config.delayBetweenBatches === 10000 ? 'selected' : ''}>10s</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="xmon-footer">
        <span class="xmon-footer-text">XMON Systems</span>
        <span class="xmon-footer-version">v2.0.0</span>
      </div>
    `;
  }

  // ============================================================
  // RENDER UI (re-render body content)
  // ============================================================
  function renderUI() {
    const widget = document.getElementById('xmon-widget');
    if (!widget) return;
    
    if (state.isMinimized) {
      widget.classList.add('xmon-minimized');
    } else {
      widget.classList.remove('xmon-minimized');
    }

    widget.innerHTML = buildWidgetHTML();
    attachEventListeners();
    
    if (state.isMinimized) {
      // Hide everything except header
      const tabs = widget.querySelector('.xmon-tabs');
      const panels = widget.querySelectorAll('.xmon-tab-panel');
      const footer = widget.querySelector('.xmon-footer');
      if (tabs) tabs.style.display = 'none';
      panels.forEach(p => p.style.display = 'none');
      if (footer) footer.style.display = 'none';
    }
  }

  // ============================================================
  // EVENT LISTENERS
  // ============================================================
  function attachEventListeners() {
    // Minimize
    const minBtn = document.getElementById('xmon-minimize-btn');
    if (minBtn) {
      minBtn.onclick = () => {
        state.isMinimized = !state.isMinimized;
        renderUI();
      };
    }

    // Tab switching
    const tabBtns = document.querySelectorAll('.xmon-tab[data-tab]');
    tabBtns.forEach(tab => {
      tab.onclick = () => {
        state.activeTab = tab.dataset.tab;
        renderUI();
      };
    });

    // Alert dismissal
    const dismissAlertBtn = document.getElementById('xmon-dismiss-alert-btn');
    if (dismissAlertBtn) {
      dismissAlertBtn.onclick = (e) => {
        e.stopPropagation();
        state.activeAlert = null;
        renderUI();
      };
    }

    // Dropzone
    const dropzone = document.getElementById('xmon-dropzone');
    if (dropzone) {
      dropzone.onclick = () => {
        const fileInput = document.getElementById('xmon-file-input');
        if (fileInput) fileInput.click();
      };

      dropzone.ondragover = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drag-over');
      };

      dropzone.ondragleave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-over');
      };

      dropzone.ondrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-over');
        handleFileDrop(e.dataTransfer.files);
      };
    }

    // File input change
    const fileInput = document.getElementById('xmon-file-input');
    if (fileInput) {
      fileInput.onchange = (e) => {
        handleFileDrop(e.target.files);
        e.target.value = ''; // Reset for re-selection
      };
    }

    // Start queue
    const startBtn = document.getElementById('xmon-start-btn');
    if (startBtn) startBtn.onclick = () => processQueue();

    // Pause
    const pauseBtn = document.getElementById('xmon-pause-btn');
    if (pauseBtn) pauseBtn.onclick = () => {
      state.isPaused = true;
      updateStatus('Pausing after current operation...', 'paused');
      renderUI();
    };

    // Resume
    const resumeBtn = document.getElementById('xmon-resume-btn');
    if (resumeBtn) resumeBtn.onclick = () => {
      state.isPaused = false;
      updateStatus('Resuming...', 'active');
      renderUI();
    };

    // Stop
    const stopBtns = document.querySelectorAll('#xmon-stop-btn, #xmon-stop-publish-btn');
    stopBtns.forEach(btn => {
      btn.onclick = () => {
        state.stopRequested = true;
        state.isPaused = false;
        updateStatus('Stopping after current operation...', 'idle');
        renderUI();
      };
    });

    // Retry failed
    const retryBtn = document.getElementById('xmon-retry-btn');
    if (retryBtn) {
      retryBtn.onclick = () => {
        state.queue.forEach(v => {
          if (v.status === STATUS.FAILED) {
            v.status = STATUS.WAITING;
            v.error = null;
            v.retryCount = (v.retryCount || 0) + 1;
          }
        });
        state.failedCount = 0;
        showToast('Failed videos queued for retry', 'info');
        renderUI();
        saveQueueState();
      };
    }

    // Clear queue
    const clearBtn = document.getElementById('xmon-clear-btn');
    if (clearBtn) {
      clearBtn.onclick = () => {
        if (state.isRunning) {
          showToast('Cannot clear queue while processing', 'warning');
          return;
        }
        state.queue = [];
        state.processedIds.clear();
        state.totalCount = 0;
        state.uploadedCount = 0;
        state.publishedCount = 0;
        state.failedCount = 0;
        state.currentBatch = 0;
        state.totalBatches = 0;
        updateStatus('Queue cleared. Ready.', 'idle');
        showToast('Queue cleared', 'info');
        renderUI();
        saveQueueState();
      };
    }

    // Standalone draft publisher
    const pubDraftsBtn = document.getElementById('xmon-publish-drafts-btn');
    if (pubDraftsBtn) pubDraftsBtn.onclick = () => runStandaloneDraftPublisher();

    // Individual retry buttons in queue
    const retryBtns = document.querySelectorAll('[data-retry-id]');
    retryBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const videoId = btn.dataset.retryId;
        const video = state.queue.find(v => v.id === videoId);
        if (video) {
          video.status = STATUS.WAITING;
          video.error = null;
          video.retryCount = (video.retryCount || 0) + 1;
          state.failedCount = Math.max(0, state.failedCount - 1);
          showToast(`Queued "${video.name}" for retry`, 'info');
          renderUI();
          saveQueueState();
        }
      };
    });

    // Settings
    const visSelect = document.getElementById('xmon-visibility-select');
    if (visSelect) visSelect.onchange = (e) => { state.config.visibility = e.target.value; saveQueueState(); };

    const batchSelect = document.getElementById('xmon-batch-select');
    if (batchSelect) batchSelect.onchange = (e) => { state.batchSize = parseInt(e.target.value); saveQueueState(); };

    const mfkToggle = document.getElementById('xmon-mfk-toggle');
    if (mfkToggle) mfkToggle.onchange = (e) => { state.config.notMadeForKids = e.target.checked; saveQueueState(); };

    const autopubToggle = document.getElementById('xmon-autopub-toggle');
    if (autopubToggle) autopubToggle.onchange = (e) => { state.config.autoPublishDrafts = e.target.checked; saveQueueState(); };

    const autoscrollToggle = document.getElementById('xmon-autoscroll-toggle');
    if (autoscrollToggle) autoscrollToggle.onchange = (e) => { state.config.autoScroll = e.target.checked; saveQueueState(); };

    const delaySelect = document.getElementById('xmon-delay-select');
    if (delaySelect) delaySelect.onchange = (e) => { state.config.delayBetweenVideos = parseInt(e.target.value); saveQueueState(); };

    const batchDelaySelect = document.getElementById('xmon-batch-delay-select');
    if (batchDelaySelect) batchDelaySelect.onchange = (e) => { state.config.delayBetweenBatches = parseInt(e.target.value); saveQueueState(); };
  }

  // ============================================================
  // FILE DROP HANDLER
  // ============================================================
  function handleFileDrop(fileList) {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    
    // Filter video files only
    const videoFiles = files.filter(f => f.type.startsWith('video/'));
    
    if (videoFiles.length === 0) {
      showToast('No video files detected. Please drop video files.', 'error');
      return;
    }

    // Check max limit
    const currentCount = state.queue.length;
    const maxAllowed = 100 - currentCount;
    
    if (maxAllowed <= 0) {
      showToast('Queue is full (100 videos max). Clear some videos first.', 'warning');
      return;
    }

    const filesToAdd = videoFiles.slice(0, maxAllowed);
    
    if (videoFiles.length > maxAllowed) {
      showToast(`Only ${maxAllowed} more videos can be added. ${videoFiles.length - maxAllowed} skipped.`, 'warning');
    }

    // Check for duplicates by filename
    let duplicateCount = 0;
    const newVideos = [];
    
    for (const file of filesToAdd) {
      const isDuplicate = state.queue.some(v => v.name === file.name && v.size === file.size);
      if (isDuplicate) {
        duplicateCount++;
        continue;
      }
      
      newVideos.push({
        id: generateId(),
        file: file,
        name: file.name,
        size: file.size,
        status: STATUS.WAITING,
        error: null,
        retryCount: 0
      });
    }

    if (duplicateCount > 0) {
      showToast(`${duplicateCount} duplicate video(s) skipped.`, 'warning');
    }

    if (newVideos.length > 0) {
      state.queue.push(...newVideos);
      state.totalCount = state.queue.length;
      state.totalBatches = Math.ceil(state.queue.filter(v => v.status === STATUS.WAITING).length / state.batchSize);
      
      showToast(`${newVideos.length} video(s) added to queue.`, 'success');
      updateStatus(`${state.queue.length} videos in queue. Ready to start.`, 'idle');
      saveQueueState();
    }

    renderUI();
  }

  // ============================================================
  // PERIODIC UI UPDATES
  // ============================================================
  function startPeriodicUpdates() {
    setInterval(() => {
      // Update drafts count on publish tab
      const draftsCountEl = document.getElementById('xmon-drafts-count');
      if (draftsCountEl) {
        draftsCountEl.textContent = findDraftRows().length;
      }
      
      // Auto-detect YouTube daily limit error if visible on screen
      if (!state.activeAlert) {
        const detected = detectYouTubeUploadError();
        if (detected && detected.type === 'daily_limit') {
          state.activeAlert = detected;
          updateStatus('Daily upload limit reached. You can upload more videos in 24 hours.', 'error');
          showAnimatedNotification({
            type: 'daily_limit',
            title: detected.title,
            message: detected.message,
            persistent: true
          });
          if (state.isRunning) {
            state.isRunning = false;
            state.isPaused = true;
          }
          renderUI();
          saveQueueState();
        }
      }
    }, 2500);
  }

  // ============================================================
  // INITIALIZE
  // ============================================================
  function init() {
    // Only activate on YouTube Studio
    if (!window.location.hostname.includes('studio.youtube.com')) return;
    
    createWidget();
    startPeriodicUpdates();
    console.log('[XMON] Widget loaded successfully.');
  }

  // Check periodically to attach widget (handles SPA navigation)
  setInterval(() => {
    if (window.location.hostname === 'studio.youtube.com') {
      if (!document.getElementById('xmon-widget')) {
        init();
      }
    }
  }, 1500);

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
