/* ============================================================
   XMON YouTube Shorts Bulk Upload & Auto Publisher
   Content Script v2.4.0
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
  let extLogoUrl = '';
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      extLogoUrl = chrome.runtime.getURL('icon128.png');
    }
  } catch (e) {}

  const XMON_LOGO_B64 = "data:image/png;base64,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";
  const XMON_LOGO_SRC = extLogoUrl || XMON_LOGO_B64;

  const XMON_LOGO_HTML = `<img src="${XMON_LOGO_SRC}" alt="" class="xmon-logo-img" /><svg class="xmon-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="xml-g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#dce5ef"/><stop offset="70%" stop-color="#8ba0b5"/><stop offset="100%" stop-color="#46586d"/></linearGradient><linearGradient id="xml-g2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e2e8f0"/><stop offset="45%" stop-color="#64748b"/><stop offset="100%" stop-color="#1e293b"/></linearGradient><filter id="xml-glow"><feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="rgba(0,0,0,0.7)"/></filter></defs><polygon points="18,16 42,16 52,47 40,53 16,25" fill="url(#xml-g1)" filter="url(#xml-glow)"/><polygon points="40,53 52,47 84,84 68,84 34,57" fill="url(#xml-g2)"/><polygon points="82,16 66,16 48,45 58,51 84,22" fill="url(#xml-g1)" filter="url(#xml-glow)"/><polygon points="48,45 58,51 24,84 16,84 42,55" fill="url(#xml-g2)"/></svg>`;


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
    if (el.getAttribute('aria-hidden') === 'true') return false;
    if (el.hasAttribute('hidden')) return false;
    if (el.hasAttribute('opened') && el.getAttribute('opened') === 'false') return false;
    try {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || style.pointerEvents === 'none') {
        return false;
      }
    } catch (e) {}
    const rect = el.getBoundingClientRect();
    return (rect.width > 0 && rect.height > 0);
  }

  function isDialogOpen(dialog) {
    if (!dialog) return false;
    if (!isElementVisible(dialog)) return false;
    if (dialog.getAttribute('aria-hidden') === 'true') return false;
    if (dialog.hasAttribute('opened') && dialog.getAttribute('opened') === 'false') return false;
    const content = dialog.querySelector('#dialog, .dialog-content, ytcp-dialog, ytcp-multi-file-upload-dialog') || dialog;
    const rect = content.getBoundingClientRect();
    return rect.width > 50 && rect.height > 50;
  }

  function normalizeVideoTitle(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .replace(/\.[a-z0-9]{2,5}$/i, '')
      .replace(/[\s\-_._~+=()\[\]{}!@#$%^&*\\/|:;"'<>,?]+/g, ' ')
      .trim();
  }

  function isTitleMatching(titleA, titleB) {
    if (!titleA || !titleB) return false;
    const a = normalizeVideoTitle(titleA);
    const b = normalizeVideoTitle(titleB);
    if (!a || !b) return false;
    if (a === b) return true;
    if (a.includes(b) || b.includes(a)) return true;
    const prefixA = a.substring(0, 15).trim();
    const prefixB = b.substring(0, 15).trim();
    if (prefixA.length >= 4 && (b.includes(prefixA) || a.includes(prefixB))) return true;
    return false;
  }

  function isButtonEnabled(el) {
    if (!el) return false;
    const disabled = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
    return !disabled && isElementVisible(el);
  }

  function clickElement(el) {
    if (!el) return;
    const innerBtn = el.shadowRoot?.querySelector('button, #radioContainer, [role="button"]') || el;
    try {
      innerBtn.click();
    } catch (e) {}
    if (innerBtn !== el) {
      try {
        el.click();
      } catch (e2) {}
    }
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
        ${isDailyLimit ? '<div class="xmon-toast-sub">YouTube quota reached â€¢ Queue paused safely for 24 hours</div>' : ''}
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
    const rows = deepQueryAll('ytcp-video-row');
    const drafts = [];

    for (const row of rows) {
      if (row.getAttribute('data-xmon-status') === 'published') continue;

      try {
        row.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      } catch (e) {}

      let editBtn = row.querySelector('#edit-draft-button, .edit-draft-button, [test-id="edit-draft-button"]')
        || deepQuery('#edit-draft-button, .edit-draft-button, [test-id="edit-draft-button"], [aria-label*="draft" i], [title*="draft" i]', row);

      if (!editBtn) {
        const buttons = deepQueryAll('ytcp-button, button, a', row);
        editBtn = buttons.find(b => {
          const text = (b.textContent || b.getAttribute('aria-label') || b.getAttribute('title') || '').toLowerCase();
          return text.includes('draft') || text.includes('edit draft') || text.includes('খসড়া');
        });
      }

      const visCell = row.querySelector('.cell-body.visibility, [class*="visibility"], ytcp-video-list-cell-visibility')
        || deepQuery('.cell-body.visibility, [class*="visibility"], ytcp-video-list-cell-visibility', row)
        || row;
      const visText = (visCell.textContent || '').toLowerCase();
      const isDraftText = visText.includes('draft') || visText.includes('খসড়া') || (editBtn !== null);

      if (editBtn || isDraftText) {
        const titleEl = row.querySelector('#video-title, .video-title, #title-link')
          || deepQuery('#video-title, .video-title, #title-link', row);
        const title = titleEl ? titleEl.textContent.trim() : 'Draft Video';
        const videoId = row.getAttribute('video-id') ||
          row.querySelector('a[href*="/video/"]')?.href?.match(/\/video\/([^/?#]+)/)?.[1] ||
          deepQuery('a[href*="/video/"]', row)?.href?.match(/\/video\/([^/?#]+)/)?.[1] ||
          '';
        drafts.push({ row, editBtn, title, videoId });
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
    let buttonToClick = editBtn;
    if (!buttonToClick) {
      try {
        row.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      } catch (e) {}
      await sleep(200);
      buttonToClick = deepQuery('#edit-draft-button, .edit-draft-button, [aria-label*="draft" i]', row)
        || deepQueryAll('ytcp-button, button, a', row).find(b => /edit\s*draft/i.test(b.textContent || b.getAttribute('aria-label') || ''));
    }

    if (!buttonToClick) throw new Error('Edit draft button not found');
    clickElement(buttonToClick);

    // Step 2: Wait for editor dialog
    const dialog = await waitFor(() => {
      const d = deepQuery('ytcp-uploads-dialog, ytcp-video-metadata-editor');
      return (d && isDialogOpen(d)) ? d : null;
    }, 12000);

    if (!dialog) throw new Error('Editor dialog did not open');
    await sleep(600);

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
    await sleep(800);

    // Step 7: Wait for editor dialog and share dialog to fully close
    const dialogCloseStart = Date.now();
    while (Date.now() - dialogCloseStart < 10000) {
      const shareClose = deepQuery('ytcp-video-share-dialog #close-button, ytcp-video-share-dialog [aria-label="Close"], #share-dialog #close-button');
      if (shareClose && isElementVisible(shareClose)) {
        clickElement(shareClose);
        await sleep(400);
      }
      const activeDialog = deepQuery('ytcp-uploads-dialog, ytcp-video-metadata-editor');
      if (!activeDialog || !isDialogOpen(activeDialog)) {
        break;
      }
      if (Date.now() - dialogCloseStart > 3000) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, code: 'Escape', bubbles: true }));
      }
      await sleep(500);
    }

    // Safety cleanup of any leftover share dialog or backdrop
    const lingeringShare = deepQuery('ytcp-video-share-dialog #close-button, ytcp-video-share-dialog [aria-label="Close"]');
    if (lingeringShare && isElementVisible(lingeringShare)) {
      clickElement(lingeringShare);
      await sleep(300);
    }

    row.setAttribute('data-xmon-status', 'published');
    row.style.outline = '2px solid #2ecc71';
    state.publishedCount++;
  }

  // ============================================================
  // UPLOAD VIDEOS TO YOUTUBE
  // ============================================================
  // Helper: Open YouTube Studio Upload Dialog (handles direct icon and CREATE menu)
  async function openYouTubeUploadDialog() {
    // 1. Is dialog already open and visible with an active drop zone or loader?
    const existingDialog = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
    if (existingDialog && isDialogOpen(existingDialog)) {
      const dropzone = deepQuery('ytcp-upload-drop-target, #drop-target, input[type="file"]:not([data-xmon-internal])', existingDialog);
      if (dropzone && isElementVisible(dropzone)) {
        console.log('[XMON] Upload dialog is already open and ready for files.');
        return true;
      }
      console.log('[XMON] Stale dialog detected. Closing to open a fresh dialog...');
      await closeUploadDialog();
      await sleep(1000);
    }

    // 2. Try direct upload button / icon on the page
    const directUploadBtn = deepQuery([
      '#upload-icon',
      '[aria-label="Upload videos"]',
      'ytcp-button#upload-button',
      'ytcp-icon-button#upload-button',
      'ytcp-button[aria-label*="Upload" i]',
      'button[aria-label*="Upload" i]'
    ].join(', '));
    if (directUploadBtn && isElementVisible(directUploadBtn)) {
      console.log('[XMON] Clicking direct upload icon...');
      clickElement(directUploadBtn);
      const dialog = await waitFor(() => {
        const d = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
        return (d && isDialogOpen(d)) ? d : null;
      }, 5000);
      if (dialog) return true;
    }

    // 3. Try "CREATE" button in header (and click "Upload videos" in the popup menu)
    const createBtn = deepQuery([
      '#create-icon',
      '#create-button',
      '[aria-label="Create"]',
      'ytcp-button#create-icon',
      'ytcp-button#create-button',
      'ytcp-button[aria-label*="Create" i]',
      'button[aria-label*="Create" i]'
    ].join(', '));
    if (createBtn && isElementVisible(createBtn)) {
      console.log('[XMON] Clicking CREATE button in header...');
      clickElement(createBtn);
      await sleep(700);

      // Look for the "Upload videos" item in the opened dropdown menu
      const uploadItem = await waitFor(() => {
        const item = deepQuery('[test-id="upload-action"], tp-yt-paper-item[test-id="upload-action"]');
        if (item && isElementVisible(item)) return item;

        const items = deepQueryAll('tp-yt-paper-item, ytcp-text-menu-item, paper-item, [role="menuitem"]');
        for (const it of items) {
          const t = (it.textContent || it.getAttribute('aria-label') || '').toLowerCase();
          if (t.includes('upload') && isElementVisible(it)) return it;
        }
        return null;
      }, 5000);

      if (uploadItem) {
        console.log('[XMON] Clicking "Upload videos" dropdown item...');
        clickElement(uploadItem);
        const dialog = await waitFor(() => {
          const d = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
          return (d && isDialogOpen(d)) ? d : null;
        }, 6000);
        if (dialog) return true;
      }
    }

    // 4. Final verification if dialog appeared
    const dialog = await waitFor(() => {
      const d = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
      return (d && isDialogOpen(d)) ? d : null;
    }, 4000);

    return !!dialog;
  }

  // Helper: Locate YouTube Studio's REAL file input element (strictly excluding XMON internal input)
  function findYouTubeUploadInput() {
    // 1. Check inside active ytcp-uploads-dialog
    const dialog = deepQuery('ytcp-uploads-dialog');
    if (dialog && isDialogOpen(dialog)) {
      const inp = deepQuery('input[type="file"]:not([data-xmon-internal])', dialog);
      if (inp && inp.id !== 'xmon-file-input') return inp;
    }

    // 2. Check inside ytcp-upload-drop-target
    const dropTarget = deepQuery('ytcp-upload-drop-target, #drop-target');
    if (dropTarget) {
      const inp = deepQuery('input[type="file"]:not([data-xmon-internal])', dropTarget);
      if (inp && inp.id !== 'xmon-file-input') return inp;
    }

    // 3. Check for #file-loader specifically
    const loader = deepQuery('#file-loader, input[type="file"].input');
    if (loader && loader.id !== 'xmon-file-input' && !loader.hasAttribute('data-xmon-internal')) {
      return loader;
    }

    // 4. Scan all file inputs excluding XMON
    const all = deepQueryAll('input[type="file"]');
    for (const input of all) {
      if (input.id === 'xmon-file-input' || input.hasAttribute('data-xmon-internal') || input.closest('#xmon-widget')) {
        continue;
      }
      return input;
    }
    return null;
  }

  // Upload a batch of files to YouTube Studio
  async function uploadBatchToYouTube(batchFiles) {
    if (!batchFiles || batchFiles.length === 0) {
      throw new Error('No files provided in batch');
    }

    console.log(`[XMON] Preparing upload batch of ${batchFiles.length} video(s)...`);

    // Step 1: Open YouTube Studio Upload Dialog
    const isDialogOpenResult = await openYouTubeUploadDialog();
    if (!isDialogOpenResult) {
      throw new Error('Could not open YouTube Studio upload dialog. Please check if you are logged into YouTube Studio.');
    }

    await sleep(800);

    // Step 2: Locate YouTube Studio's REAL file input
    const ytFileInput = await waitFor(() => findYouTubeUploadInput(), 8000);

    // Step 3: Locate YouTube Studio's drop target element
    const dropTarget = await waitFor(() => {
      const dt = deepQuery('ytcp-upload-drop-target, #drop-target');
      if (dt && isElementVisible(dt)) return dt;
      return deepQuery('ytcp-uploads-dialog');
    }, 4000);

    if (!ytFileInput && !dropTarget) {
      throw new Error('Could not find YouTube upload input or drop target element.');
    }

    // Step 4: Populate DataTransfer
    const dt = new DataTransfer();
    for (const file of batchFiles) {
      dt.items.add(file);
    }

    // Clear input value first if possible
    if (ytFileInput) {
      try { ytFileInput.value = ''; } catch (e) {}
    }

    // Step 5: Inject files — use multiple robust methods
    let dispatched = false;

    // Method A: Native setter via Object.getOwnPropertyDescriptor (most reliable for Shadow DOM inputs)
    if (ytFileInput) {
      try {
        const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'files');
        if (nativeInputSetter && nativeInputSetter.set) {
          nativeInputSetter.set.call(ytFileInput, dt.files);
        } else {
          ytFileInput.files = dt.files;
        }
        ytFileInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        ytFileInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        dispatched = true;
        console.log('[XMON] Injected files via native setter into YouTube file input');
      } catch (err) {
        console.warn('[XMON] File input native setter error:', err);
        try {
          ytFileInput.files = dt.files;
          ytFileInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
          dispatched = true;
        } catch (e2) {
          console.warn('[XMON] File input direct assignment also failed:', e2);
        }
      }
    }

    // Method B: DragEvent drop on the drop target element
    const targetElement = dropTarget || deepQuery('ytcp-uploads-dialog');
    if (targetElement) {
      try {
        const dragInit = {
          bubbles: true,
          cancelable: true,
          composed: true,
          dataTransfer: dt
        };
        targetElement.dispatchEvent(new DragEvent('dragenter', dragInit));
        await sleep(100);
        targetElement.dispatchEvent(new DragEvent('dragover', dragInit));
        await sleep(100);
        targetElement.dispatchEvent(new DragEvent('drop', dragInit));
        dispatched = true;
        console.log('[XMON] Dispatched drop event onto YouTube drop target');
      } catch (err) {
        console.warn('[XMON] Drop event error:', err);
      }
    }

    if (!dispatched) {
      throw new Error('Failed to dispatch files to YouTube Studio');
    }

    await sleep(500);

    // Step 6: Verify YouTube Studio accepted the files (with retry)
    let uploadStarted = await waitFor(() => {
      const items = deepQueryAll('ytcp-uploads-file-item, .upload-item');
      if (items.length > 0) return true;

      const stepper = deepQuery('#step-badge-0, #title-textarea, #next-button');
      if (stepper && isElementVisible(stepper)) return true;

      const dropzone = deepQuery('ytcp-upload-drop-target');
      const dialog = deepQuery('ytcp-uploads-dialog');
      if (dialog && isDialogOpen(dialog) && dropzone && !isElementVisible(dropzone)) return true;

      const progress = deepQuery('ytcp-video-upload-progress, tp-yt-paper-progress, [class*="progress-label"], [class*="upload-progress"]');
      if (progress && isElementVisible(progress)) return true;

      const err = detectYouTubeUploadError();
      if (err) return true;

      return false;
    }, 10000);

    if (!uploadStarted) {
      console.warn('[XMON] YouTube did not react. Retrying file injection...');
      const freshInput = await waitFor(() => findYouTubeUploadInput(), 3000);
      if (freshInput) {
        try {
          const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'files');
          if (nativeInputSetter && nativeInputSetter.set) {
            nativeInputSetter.set.call(freshInput, dt.files);
          } else {
            freshInput.files = dt.files;
          }
          freshInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
          freshInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
          console.log('[XMON] Retry injection sent.');
        } catch (retryErr) {
          console.warn('[XMON] Retry injection failed:', retryErr);
        }
      }

      if (targetElement) {
        try {
          const dragInit = { bubbles: true, cancelable: true, composed: true, dataTransfer: dt };
          targetElement.dispatchEvent(new DragEvent('drop', dragInit));
        } catch (e) {}
      }

      await sleep(2000);

      uploadStarted = await waitFor(() => {
        const items = deepQueryAll('ytcp-uploads-file-item, .upload-item');
        if (items.length > 0) return true;
        const stepper = deepQuery('#step-badge-0, #title-textarea, #next-button');
        if (stepper && isElementVisible(stepper)) return true;
        const progress = deepQuery('ytcp-video-upload-progress, tp-yt-paper-progress');
        if (progress && isElementVisible(progress)) return true;
        return false;
      }, 5000);

      if (!uploadStarted) {
        console.warn('[XMON] Upload still did not start after retry. Continuing to wait loop...');
      }
    }

    return true;
  }

  // ============================================================
  // HELPER: Check if a YouTube upload close/done button is truly enabled
  // ============================================================
  function isUploadCloseBtnEnabled() {
    const selectors = [
      'ytcp-uploads-dialog #close-button',
      'ytcp-multi-file-upload-dialog #close-button',
      'ytcp-uploads-dialog ytcp-button[id="close-button"]',
      'ytcp-multi-file-upload-dialog ytcp-button[id="close-button"]',
      'ytcp-uploads-dialog ytcp-icon-button#close-button',
      'ytcp-multi-file-upload-dialog ytcp-icon-button#close-button',
      'ytcp-uploads-dialog [aria-label="Close"]',
      'ytcp-multi-file-upload-dialog [aria-label="Close"]',
      '#dialog-close-button',
      'ytcp-button#close-button',
      'ytcp-button#dismiss-button'
    ];
    for (const sel of selectors) {
      const btn = deepQuery(sel);
      if (!btn || !isElementVisible(btn)) continue;
      if (btn.hasAttribute('disabled')) continue;
      if (btn.getAttribute('aria-disabled') === 'true') continue;
      const innerBtn = btn.shadowRoot?.querySelector('button') || btn.querySelector('button');
      if (innerBtn && (innerBtn.disabled || innerBtn.getAttribute('aria-disabled') === 'true')) continue;
      return btn;
    }
    return null;
  }

  // ============================================================
  // HELPER: Close the upload dialog and wait for it to disappear
  // ============================================================
  async function closeUploadDialog() {
    const uploadDialog = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog, ytcp-dialog');
    if (!uploadDialog || !isDialogOpen(uploadDialog)) {
      return;
    }

    const closeSelectors = [
      'ytcp-uploads-dialog #close-button',
      'ytcp-multi-file-upload-dialog #close-button',
      'ytcp-uploads-dialog ytcp-button[id="close-button"]',
      'ytcp-multi-file-upload-dialog ytcp-button[id="close-button"]',
      'ytcp-uploads-dialog ytcp-icon-button#close-button',
      'ytcp-multi-file-upload-dialog ytcp-icon-button#close-button',
      'ytcp-uploads-dialog [aria-label="Close"]',
      'ytcp-multi-file-upload-dialog [aria-label="Close"]',
      '#dialog-close-button',
      'ytcp-button#dismiss-button',
      'ytcp-button#close-button'
    ];

    for (let attempt = 0; attempt < 4; attempt++) {
      for (const sel of closeSelectors) {
        const btn = deepQuery(sel);
        if (btn && isElementVisible(btn)) {
          clickElement(btn);
          await sleep(600);
          break;
        }
      }

      // Handle confirmation prompts - ONLY click "Save as draft" or "Close".
      // NEVER click "Cancel uploads" as that aborts the upload entirely.
      const confirmPromptBtns = deepQueryAll([
        'ytcp-confirmation-dialog #confirm-button',
        'ytcp-confirmation-dialog ytcp-button',
        'ytcp-alert-dialog #confirm-button',
        'ytcp-dialog #confirm-button'
      ].join(', '));
      for (const cBtn of confirmPromptBtns) {
        if (cBtn && isElementVisible(cBtn)) {
          const text = (cBtn.textContent || '').toLowerCase().trim();
          // Only click buttons that save/close - never buttons that cancel/abort uploads
          const isSafeToClick = text.includes('save') ||
                                text.includes('draft') ||
                                text === 'close' ||
                                text.includes('yes') ||
                                text.includes('proceed');
          // Explicitly reject buttons that would abort the upload
          const isDestructive = text.includes('cancel upload') ||
                                text.includes('discard') ||
                                text.includes('abandon');
          if (isSafeToClick && !isDestructive) {
            clickElement(cBtn);
            await sleep(600);
            break;
          }
        }
      }

      const active = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
      if (!active || !isDialogOpen(active)) {
        console.log('[XMON] Upload dialog confirmed closed.');
        await sleep(500);
        return;
      }

      // Send Escape key if still open
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, code: 'Escape', bubbles: true }));
      await sleep(600);
    }
  }

  // ============================================================
  // UPLOAD COMPLETION DETECTION
  // ============================================================
  async function waitForBatchUploadComplete(batchCount, currentBatchVideos = []) {
    updateStatus(`Uploading ${batchCount} video(s) to YouTube...`, 'active');
    
    // Max 3.5 minutes for batch (short videos typically upload in 20-60s)
    const maxWaitMs = Math.max(batchCount * 25000, 210000);
    const start = Date.now();
    let consecutiveDoneCount = 0;
    const trackedVideoIds = new Set();

    while (Date.now() - start < maxWaitMs) {
      if (state.stopRequested) throw new Error('CANCELLED_BY_USER');
      if (state.isPaused) {
        await waitForResume();
      }

      // 1. Real-time check for YouTube Studio upload errors & daily limits
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

      // 2. Multi-file items tracking
      const fileItems = deepQueryAll('ytcp-uploads-file-item, .upload-item, ytcp-upload-item, [class*="upload-item"]');
      let completedInDom = 0;
      let failedInDom = 0;

      if (fileItems.length > 0) {
        fileItems.forEach((item) => {
          const itemText = (item.textContent || '').toLowerCase();
          const isDone = itemText.includes('complete') ||
                         itemText.includes('saved as draft') ||
                         itemText.includes('processing') ||
                         itemText.includes('checks complete') ||
                         itemText.includes('100%');
          const isFailed = itemText.includes('abandoned') ||
                            itemText.includes('upload failed') ||
                            itemText.includes('error');

          if (isDone || isFailed) completedInDom++;
          if (isFailed) failedInDom++;

          for (const video of currentBatchVideos) {
            if (trackedVideoIds.has(video.id)) continue;
            if (isTitleMatching(video.name, itemText)) {
              if (isDone && video.status === STATUS.UPLOADING) {
                video.status = STATUS.UPLOADED;
                state.uploadedCount++;
                state.processedIds.add(video.id);
                trackedVideoIds.add(video.id);
                renderUI();
              } else if (isFailed && video.status === STATUS.UPLOADING) {
                video.status = STATUS.FAILED;
                video.error = 'YouTube upload failed';
                state.failedCount++;
                trackedVideoIds.add(video.id);
                renderUI();
              }
              break;
            }
          }
        });
      }

      // 3. Check if YouTube Close button is enabled
      const closeBtn = isUploadCloseBtnEnabled();
      const uploadDialog = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
      const dialogText = uploadDialog ? (uploadDialog.textContent || '').toLowerCase() : '';
      const isDraftSavedInText = dialogText.includes('saved as draft') ||
                                 dialogText.includes('uploads complete') ||
                                 dialogText.includes('all uploads complete') ||
                                 dialogText.includes('upload complete') ||
                                 dialogText.includes('checks complete');

      // Check if any active upload progress bar exists
      const activeProgressBars = deepQueryAll('tp-yt-paper-progress, ytcp-video-upload-progress, paper-progress').filter(p => {
        if (!isElementVisible(p)) return false;
        const val = parseInt(p.getAttribute('aria-valuenow') || p.value || '0', 10);
        return val > 0 && val < 100;
      });

      const isAllUploadsFinished = (closeBtn !== null && activeProgressBars.length === 0) ||
                                   (isDraftSavedInText && activeProgressBars.length === 0) ||
                                   (completedInDom >= batchCount);

      if (isAllUploadsFinished) {
        consecutiveDoneCount++;
        if (consecutiveDoneCount >= 2) {
          console.log(`[XMON] Batch upload confirmed complete. CloseBtn=${!!closeBtn}, isDraftSaved=${isDraftSavedInText}, completedInDom=${completedInDom}`);
          for (const video of currentBatchVideos) {
            if (video.status === STATUS.UPLOADING) {
              video.status = STATUS.UPLOADED;
              state.uploadedCount++;
              state.processedIds.add(video.id);
            }
          }
          updateStatus('Batch upload confirmed. Ready to close dialog...', 'active');
          renderUI();
          // Do NOT close dialog here - let processQueue handle it after this function returns
          return true;
        }
      } else {
        consecutiveDoneCount = 0;
      }

      await sleep(1500);
    }

    console.warn('[XMON] Batch upload wait finished/timed out. Marking remaining as uploaded...');
    for (const video of currentBatchVideos) {
      if (video.status === STATUS.UPLOADING) {
        video.status = STATUS.UPLOADED;
        state.uploadedCount++;
        state.processedIds.add(video.id);
      }
    }
    // Do NOT close dialog here - let processQueue handle it
    renderUI();
    return true;
  }
  
  async function waitForResume() {
    while (state.isPaused && !state.stopRequested) {
      await sleep(500);
    }
  }

  // ============================================================
  // SPA NAVIGATION & CONTENT REFRESH
  // ============================================================
  async function navigateToContentSafe(targetTab = 'videos') {
    const currentUrl = window.location.href;
    console.log(`[XMON] Ensuring navigation to Content page (${targetTab})...`);

    // 1. Ensure on /videos
    if (!currentUrl.includes('/videos') && !currentUrl.includes('/content')) {
      const sidebarItems = deepQueryAll('a[href*="/videos"], [test-id="menu-item-content"], #menu-item-content, tp-yt-paper-icon-item[test-id="menu-item-content"]');
      let clicked = false;
      for (const item of sidebarItems) {
        if (isElementVisible(item)) {
          clickElement(item);
          clicked = true;
          await sleep(2500);
          break;
        }
      }

      if (!clicked || (!window.location.href.includes('/videos') && !window.location.href.includes('/content'))) {
        const channelMatch = window.location.href.match(/\/channel\/([^/?#]+)/);
        if (channelMatch) {
          window.history.pushState({}, '', `/channel/${channelMatch[1]}/videos/upload`);
          window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
          await sleep(2500);
        }
      }
    }

    // 2. Switch to / Refresh the target tab (Videos or Shorts)
    await switchToContentTab(targetTab);
  }

  async function switchToContentTab(tabName = 'shorts') {
    const tabs = deepQueryAll('tp-yt-paper-tab, paper-tab, [role="tab"], ytcp-tab');
    for (const tab of tabs) {
      const text = (tab.textContent || '').trim().toLowerCase();
      if (text.includes(tabName.toLowerCase())) {
        clickElement(tab);
        await sleep(1500);
        return true;
      }
    }
    return false;
  }

  async function refreshContentTable() {
    const isShortsUrl = window.location.href.includes('/short');
    const otherTab = isShortsUrl ? 'videos' : 'shorts';
    const mainTab = isShortsUrl ? 'shorts' : 'videos';

    await switchToContentTab(otherTab);
    await sleep(600);
    await switchToContentTab(mainTab);
    await sleep(1500);
    window.scrollTo(0, 100);
    await sleep(300);
    window.scrollTo(0, 0);
    await sleep(500);
  }

  // ============================================================
  // STRICT DRAFT VERIFICATION ON YOUTUBE STUDIO CONTENT PAGE
  // ============================================================
  async function verifyAndSyncBatchDrafts(currentBatchVideos, maxWaitMs = 25000) {
    updateStatus(`Verifying drafts in YouTube Studio...`, 'active');
    
    // Ensure we are on Content page (Videos tab first, where new drafts appear)
    await navigateToContentSafe('videos');
    await sleep(2000);

    const start = Date.now();

    while (Date.now() - start < maxWaitMs) {
      if (state.stopRequested) break;

      let drafts = findDraftRows();

      // If no drafts on Videos tab, try switching between tabs or scrolling
      if (drafts.length === 0) {
        await refreshContentTable();
        drafts = findDraftRows();
        if (drafts.length === 0) {
          await switchToContentTab('shorts');
          await sleep(1500);
          drafts = findDraftRows();
          if (drafts.length === 0) {
            await switchToContentTab('videos');
            await sleep(1500);
            drafts = findDraftRows();
          }
        }
      }

      // Pass 1: Title matching
      for (const video of currentBatchVideos) {
        if (video.status === STATUS.UPLOADED && video.draftId) continue;
        if (video.status === STATUS.PUBLISHED) continue;

        const matchingDraft = drafts.find(d => isTitleMatching(video.name, d.title));
        if (matchingDraft) {
          console.log(`[XMON] Confirmed draft in YouTube Studio: "${matchingDraft.title}" matches "${video.name}"`);
          video.status = STATUS.UPLOADED;
          video.draftId = matchingDraft.videoId || matchingDraft.title;
          video.draftTitle = matchingDraft.title;
          state.processedIds.add(video.id);
          renderUI();
        }
      }

      // Pass 2: Positional assignment for drafts in same batch
      // Since 15 videos were uploaded together, any unassigned draft rows on top correspond to the remaining videos
      const unassignedVideos = currentBatchVideos.filter(v => v.status !== STATUS.UPLOADED && v.status !== STATUS.PUBLISHED);
      if (unassignedVideos.length > 0 && drafts.length > 0) {
        const assignedDraftIds = new Set(currentBatchVideos.map(v => v.draftId).filter(Boolean));
        const availableDrafts = drafts.filter(d => !assignedDraftIds.has(d.videoId || d.title));

        for (let i = 0; i < Math.min(unassignedVideos.length, availableDrafts.length); i++) {
          const video = unassignedVideos[i];
          const d = availableDrafts[i];
          video.status = STATUS.UPLOADED;
          video.draftId = d.videoId || d.title;
          video.draftTitle = d.title;
          state.processedIds.add(video.id);
          renderUI();
        }
      }

      const allConfirmed = currentBatchVideos.every(v => v.status === STATUS.UPLOADED || v.status === STATUS.PUBLISHED);
      if (allConfirmed) {
        console.log(`[XMON] All ${currentBatchVideos.length} videos verified as drafts in YouTube Studio!`);
        saveQueueState();
        return currentBatchVideos.filter(v => v.status === STATUS.UPLOADED || v.status === STATUS.PUBLISHED).length;
      }

      await sleep(2000);
    }

    // Safety fallback: any video still marked UPLOADING is set to UPLOADED so publishBatchDrafts will attempt publishing
    for (const video of currentBatchVideos) {
      if (video.status === STATUS.UPLOADING) {
        video.status = STATUS.UPLOADED;
        state.processedIds.add(video.id);
      }
    }

    renderUI();
    saveQueueState();
    return currentBatchVideos.filter(v => v.status === STATUS.UPLOADED || v.status === STATUS.PUBLISHED).length;
  }

  // ============================================================
  // PUBLISH BATCH DRAFTS (Targeted to the current batch)
  // ============================================================
  async function publishBatchDrafts(currentBatchVideos) {
    const readyVideos = currentBatchVideos.filter(v => v.status === STATUS.UPLOADED);
    if (readyVideos.length === 0) {
      console.log('[XMON] No verified drafts to publish in this batch.');
      return;
    }

    updateStatus(`Batch ${state.currentBatch} - Publishing ${readyVideos.length} draft(s)...`, 'active');

    for (let i = 0; i < readyVideos.length; i++) {
      if (state.stopRequested) break;
      if (state.isPaused) {
        await waitForResume();
        if (state.stopRequested) break;
      }

      const video = readyVideos[i];

      // Re-scan drafts to get fresh DOM element references
      let drafts = findDraftRows();
      let draftItem = null;

      if (video.draftId) {
        draftItem = drafts.find(d => (d.videoId && d.videoId === video.draftId) || d.title === video.draftTitle);
      }
      if (!draftItem) {
        draftItem = drafts.find(d => isTitleMatching(video.name, d.title));
      }
      if (!draftItem && drafts.length > 0) {
        draftItem = drafts[0];
      }

      if (!draftItem) {
        // Try scrolling to load drafts from virtualized table
        window.scrollBy(0, 600);
        await sleep(1200);
        drafts = findDraftRows();
        draftItem = drafts[0] || null;
      }

      if (!draftItem) {
        console.warn(`[XMON] Draft row for "${video.name}" not found at publish step.`);
        video.status = STATUS.FAILED;
        video.error = 'Draft row not visible during publish step';
        state.failedCount++;
        renderUI();
        continue;
      }

      try {
        video.status = STATUS.PUBLISHING;
        renderUI();

        await publishSingleDraft(draftItem, i + 1, readyVideos.length);

        video.status = STATUS.PUBLISHED;
        showToast(`Published: ${video.name}`, 'success', 2500);
        renderUI();
        saveQueueState();
      } catch (pubErr) {
        console.error(`[XMON] Failed to publish draft for "${video.name}":`, pubErr);
        video.status = STATUS.FAILED;
        video.error = `Publish error: ${pubErr.message}`;
        state.failedCount++;
        renderUI();
        await closeStuckDialogs(true);
      }

      await sleep(state.config.delayBetweenVideos);
    }

    await closeStuckDialogs(true);
  }

  // ============================================================
  // MAIN QUEUE PROCESSOR
  // ============================================================
  async function processQueue() {
    if (state.isRunning) return;
    
    state.isRunning = true;
    state.stopRequested = false;
    state.isPaused = false;
    
    const initialWaiting = state.queue.filter(v => v.status === STATUS.WAITING || v.status === STATUS.FAILED);
    if (initialWaiting.length === 0) {
      showToast('No videos to process in queue.', 'warning');
      state.isRunning = false;
      renderUI();
      return;
    }
    
    // Reset any failed items to waiting if user clicked Start
    state.queue.forEach(v => {
      if (v.status === STATUS.FAILED) {
        v.status = STATUS.WAITING;
        v.error = null;
      }
    });

    state.totalCount = state.queue.length;
    const activeWaiting = state.queue.filter(v => v.status === STATUS.WAITING);
    state.totalBatches = Math.ceil(activeWaiting.length / state.batchSize);
    state.currentBatch = 0;
    state.uploadedCount = state.queue.filter(v => v.status === STATUS.UPLOADED || v.status === STATUS.PUBLISHED).length;
    state.publishedCount = state.queue.filter(v => v.status === STATUS.PUBLISHED).length;
    state.failedCount = 0;
    
    showToast(`Starting queue: ${activeWaiting.length} video(s) in ${state.totalBatches} batch(es)`, 'info');
    renderUI();
    
    try {
      while (!state.stopRequested) {
        if (state.isPaused) {
          updateStatus('Queue paused. Click Resume to continue.', 'paused');
          renderUI();
          await waitForResume();
          if (state.stopRequested) break;
        }

        // Dynamically get the remaining waiting videos
        const waitingVideos = state.queue.filter(v => v.status === STATUS.WAITING);
        if (waitingVideos.length === 0) {
          console.log('[XMON] All waiting videos in queue have been processed!');
          break;
        }

        state.currentBatch++;
        const currentBatchVideos = waitingVideos.slice(0, state.batchSize);
        const batchFiles = currentBatchVideos.filter(v => v.file).map(v => v.file);
        const expectedUploadCount = batchFiles.length;

        updateStatus(`Batch ${state.currentBatch}/${state.totalBatches} - Uploading ${currentBatchVideos.length} video(s)...`, 'active');
        for (const video of currentBatchVideos) {
          video.status = STATUS.UPLOADING;
        }
        renderUI();
        saveQueueState();

        try {
          if (batchFiles.length === 0) {
            console.warn('[XMON] Batch has no uploadable files.');
            for (const video of currentBatchVideos) {
              video.status = STATUS.FAILED;
              video.error = 'File reference not available for upload';
              state.failedCount++;
            }
            renderUI();
            saveQueueState();
            continue;
          }

          // Step 1: Pre-batch cleanup — ensure previous dialogs are 100% closed
          await closeStuckDialogs(true);
          await closeUploadDialog();
          await sleep(800);

          // Step 2: Inject and upload the batch files to YouTube Studio
          await uploadBatchToYouTube(batchFiles);
          
          // Step 3: Wait for uploads in the dialog & draft save
          await waitForBatchUploadComplete(expectedUploadCount, currentBatchVideos);

          // Step 4: Close the upload dialog
          await closeUploadDialog();
          await sleep(1500);
          
          // Step 5: Draft Verification on YouTube Studio Content page
          const verifiedInBatch = await verifyAndSyncBatchDrafts(currentBatchVideos, 25000);
          console.log(`[XMON] Batch ${state.currentBatch}: ${verifiedInBatch}/${expectedUploadCount} drafts verified in YouTube Studio.`);
          renderUI();
          saveQueueState();
          
          // Step 6: Publish drafts if enabled
          if (state.config.autoPublishDrafts) {
            await publishBatchDrafts(currentBatchVideos);
          }

          // Step 7: Post-batch cleanup — ensure editor & dialogs are completely closed
          await closeStuckDialogs(true);
          await closeUploadDialog();
          
          // Step 8: Delay before next batch if more waiting videos exist
          const remainingWaiting = state.queue.filter(v => v.status === STATUS.WAITING).length;
          if (remainingWaiting > 0 && !state.stopRequested) {
            updateStatus(`Batch ${state.currentBatch} complete. Next batch starting in ${state.config.delayBetweenBatches / 1000}s...`, 'active');
            renderUI();
            await sleep(state.config.delayBetweenBatches);
          }
          
        } catch (batchErr) {
          if (batchErr.message === 'CANCELLED_BY_USER') break;
          
          console.error('[XMON] Batch error:', batchErr);
          
          const isDailyLimit = batchErr.message === 'DAILY_UPLOAD_LIMIT_REACHED' ||
                                (state.activeAlert && state.activeAlert.type === 'daily_limit');
          
          if (isDailyLimit) {
            console.warn('[XMON] Daily upload limit reached. Halting queue safely.');
            state.isRunning = false;
            state.isPaused = true;
            
            for (const video of currentBatchVideos) {
              if (video.status === STATUS.UPLOADING) {
                video.status = STATUS.FAILED;
                video.error = 'Daily upload limit reached. You can upload more videos in 24 hours.';
                state.failedCount++;
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
            await closeStuckDialogs(true);
            break;
          }
          
          for (const video of currentBatchVideos) {
            if (video.status === STATUS.UPLOADING) {
              video.status = STATUS.FAILED;
              video.error = batchErr.message;
              state.failedCount++;
            }
          }
          
          showToast(`Batch ${state.currentBatch} error: ${batchErr.message}`, 'error');
          await closeStuckDialogs(true);
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
  // DRAFT PUBLISHER (Standalone Mode)
  // ============================================================
  async function publishAllDrafts(maxToPublish = 50) {
    let publishRound = 0;
    let consecutiveEmpty = 0;
    const publishedIdsThisRun = new Set();
    
    while (!state.stopRequested && publishRound < maxToPublish) {
      if (state.isPaused) {
        await waitForResume();
        if (state.stopRequested) break;
      }
      
      const drafts = findDraftRows().filter(d => !publishedIdsThisRun.has(d.videoId || d.title));
      if (drafts.length === 0) {
        if (state.config.autoScroll) {
          window.scrollBy(0, 800);
          await sleep(2000);
          const moreDrafts = findDraftRows().filter(d => !publishedIdsThisRun.has(d.videoId || d.title));
          if (moreDrafts.length === 0) {
            consecutiveEmpty++;
            if (consecutiveEmpty >= 2) break;
          } else {
            consecutiveEmpty = 0;
          }
        } else {
          break;
        }
        continue;
      }
      
      consecutiveEmpty = 0;
      const currentDraft = drafts[0];
      if (!currentDraft) break;
      
      const idx = publishRound + 1;
      const total = Math.min(drafts.length + publishRound, maxToPublish);
      
      try {
        await publishSingleDraft(currentDraft, idx, total);
        publishedIdsThisRun.add(currentDraft.videoId || currentDraft.title);
        updateStatus(`Published (${state.publishedCount}): ${currentDraft.title.substring(0, 30)}`, 'active');
        
        for (const qItem of state.queue) {
          if (qItem.status === STATUS.UPLOADED || qItem.status === STATUS.DRAFT) {
            const qName = normalizeVideoTitle(qItem.name);
            const draftTitle = normalizeVideoTitle(currentDraft.title);
            if (draftTitle.includes(qName) || qName.includes(draftTitle)) {
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
        await closeStuckDialogs(true);
      }
      
      await sleep(state.config.delayBetweenVideos);
      publishRound++;
    }

    console.log(`[XMON] publishAllDrafts done. Published ${publishRound} draft(s) this run.`);
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

  // Legacy alias kept for backward compatibility
  async function navigateToContent() {
    return navigateToContentSafe();
  }

  // ============================================================
  // HELPER: Close stuck dialogs
  // ============================================================
  async function closeStuckDialogs(forceAll = false) {
    if (state.isRunning && !forceAll) {
      const shareClose = deepQuery('ytcp-video-share-dialog #close-button, ytcp-video-share-dialog [aria-label="Close"]');
      if (shareClose && isElementVisible(shareClose)) {
        clickElement(shareClose);
        await sleep(400);
      }
      const errorClose = deepQuery('ytcp-alert-dialog #cancel-button, ytcp-alert-dialog [aria-label="Cancel"]');
      if (errorClose && isElementVisible(errorClose)) {
        clickElement(errorClose);
        await sleep(400);
      }
      return;
    }

    const closeSelectors = [
      'ytcp-video-share-dialog #close-button',
      'ytcp-video-share-dialog [aria-label="Close"]',
      'ytcp-video-metadata-editor #close-button',
      'ytcp-video-metadata-editor [aria-label="Close"]',
      'ytcp-alert-dialog #cancel-button',
      'ytcp-alert-dialog [aria-label="Cancel"]',
      'ytcp-uploads-dialog #close-button',
      'ytcp-multi-file-upload-dialog #close-button',
      '[aria-label="Close"]',
      'ytcp-button#close-button'
    ];
    
    for (const sel of closeSelectors) {
      const btn = deepQuery(sel);
      if (btn && isElementVisible(btn)) {
        clickElement(btn);
        await sleep(400);
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
        <span class="xmon-footer-version">v2.3.0</span>
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
    // Logo error fallback handler (CSP-safe)
    const logoImg = document.querySelector('#xmon-widget .xmon-logo-img');
    const logoBox = document.querySelector('#xmon-widget .xmon-logo');
    if (logoImg && logoBox) {
      logoImg.addEventListener('error', () => {
        logoBox.classList.add('show-fallback');
      });
    }

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
      const waitingCount = state.queue.filter(v => v.status === STATUS.WAITING || v.status === STATUS.FAILED).length;
      state.totalBatches = Math.ceil(waitingCount / state.batchSize);
      
      showToast(`${newVideos.length} video(s) added to queue.`, 'success');
      updateStatus(`${state.queue.length} video(s) in queue. Ready to start.`, 'idle');
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
