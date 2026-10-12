/* ============================================================
   XMON YouTube Shorts Bulk Upload & Auto Publisher
   Content Script v2.9.1
   ============================================================ */

(() => {
  // Prevent duplicate injection
  if (window.__XMON_BULK_PUBLISHER_V2__) return;
  window.__XMON_BULK_PUBLISHER_V2__ = true;

  const EXT_VERSION = chrome?.runtime?.getManifest?.()?.version || '2.7.0';
  console.log(`[XMON] Extension v${EXT_VERSION} initialized on YouTube Studio.`);

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
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
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
  // ============================================================
  // SELECTOR TOKENIZER (P2-5 / P3-3)
  // Splits a CSS selector string on top-level commas or spaces only
  // (i.e. NOT inside [], (), or quoted strings).
  // ============================================================
  function splitTopLevel(selector, splitChar) {
    const parts = [];
    let depth = 0;
    let inQuote = null;
    let current = '';
    for (let i = 0; i < selector.length; i++) {
      const ch = selector[i];
      if (inQuote) {
        current += ch;
        if (ch === inQuote) inQuote = null;
      } else if (ch === '"' || ch === "'") {
        inQuote = ch;
        current += ch;
      } else if (ch === '(' || ch === '[') {
        depth++;
        current += ch;
      } else if (ch === ')' || ch === ']') {
        depth--;
        current += ch;
      } else if (depth === 0 && ch === splitChar) {
        // skip trailing spaces after comma
        const trimmed = current.trim();
        if (trimmed) parts.push(trimmed);
        current = '';
        // skip the space that follows a comma split
        if (splitChar === ',' && selector[i + 1] === ' ') i++;
      } else {
        current += ch;
      }
    }
    const trimmed = current.trim();
    if (trimmed) parts.push(trimmed);
    return parts;
  }

  function deepQuery(selector, root = document) {
    if (!root) return null;
    const trimmed = selector.trim();

    // P2-5: Split comma list at top level only (not inside [] or quotes)
    if (trimmed.includes(',')) {
      for (const part of splitTopLevel(trimmed, ',')) {
        const found = deepQuery(part, root);
        if (found) return found;
      }
      return null;
    }

    // Descendant across shadow boundaries: split on first top-level space
    const spaceParts = splitTopLevel(trimmed, ' ');
    if (spaceParts.length === 2) {
      // Try native first (light DOM)
      try {
        const nativeMatch = root.querySelector?.(trimmed);
        if (nativeMatch) return nativeMatch;
      } catch (e) {}
      // Cross-shadow traversal for exactly one level
      const [head, tail] = spaceParts;
      const headEl = deepQuery(head, root);
      if (headEl) {
        const found = deepQuery(tail, headEl);
        if (found) return found;
      }
    } else if (spaceParts.length > 2) {
      // Multi-level — let native handle it, then give up (shadow not traversed for >2 levels)
      try {
        const nativeMatch = root.querySelector?.(trimmed);
        if (nativeMatch) return nativeMatch;
      } catch (e) {}
    }

    // Direct querySelector on root
    try {
      const direct = root.querySelector?.(trimmed);
      if (direct) return direct;
    } catch (e) {}

    // Root's own shadowRoot
    if (root.shadowRoot) {
      const inShadow = deepQuery(trimmed, root.shadowRoot);
      if (inShadow) return inShadow;
    }

    // P3-3: Only traverse shadowRoots of custom elements (localName includes '-')
    const children = root.querySelectorAll ? Array.from(root.querySelectorAll('*')) : [];
    for (const el of children) {
      if (el.shadowRoot && el.localName.includes('-')) {
        const inChildShadow = deepQuery(trimmed, el.shadowRoot);
        if (inChildShadow) return inChildShadow;
      }
    }
    return null;
  }

  function deepQueryAll(selector, root = document) {
    if (!root) return [];
    const results = [];
    const trimmed = selector.trim();

    // P2-5: comma split at top level only
    if (trimmed.includes(',')) {
      for (const part of splitTopLevel(trimmed, ',')) {
        results.push(...deepQueryAll(part, root));
      }
      return Array.from(new Set(results));
    }

    // Descendant across boundaries
    const spaceParts = splitTopLevel(trimmed, ' ');
    if (spaceParts.length >= 2) {
      try {
        const native = root.querySelectorAll?.(trimmed);
        if (native && native.length > 0) results.push(...Array.from(native));
      } catch (e) {}

      if (spaceParts.length === 2) {
        const [head, tail] = spaceParts;
        for (const h of deepQueryAll(head, root)) {
          results.push(...deepQueryAll(tail, h));
        }
      }
      return Array.from(new Set(results));
    }

    // Native querySelectorAll on root
    try {
      if (root.querySelectorAll) results.push(...Array.from(root.querySelectorAll(trimmed)));
    } catch (e) {}

    // Root's own shadowRoot
    if (root.shadowRoot) results.push(...deepQueryAll(trimmed, root.shadowRoot));

    // P3-3: Only custom elements' shadow roots
    const children = root.querySelectorAll ? Array.from(root.querySelectorAll('*')) : [];
    for (const el of children) {
      if (el.shadowRoot && el.localName.includes('-')) {
        results.push(...deepQueryAll(trimmed, el.shadowRoot));
      }
    }

    return Array.from(new Set(results));
  }

  // P3-5: isElementVisible — use rect size + display/visibility only.
  // Do NOT filter on opacity or pointer-events (misreports animated/disabled elements).
  function isElementVisible(el) {
    if (!el) return false;
    if (el.hasAttribute('hidden')) return false;
    if (el.hasAttribute('opened') && el.getAttribute('opened') === 'false') return false;
    try {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
    } catch (e) {}
    const rect = el.getBoundingClientRect();
    return (rect.width > 0 && rect.height > 0);
  }

  function isDialogOpen(dialog) {
    if (!dialog) return false;
    // Only treat as closed if opened is explicitly set to 'false'
    // opened="" (empty) or opened (no value) means the dialog IS open in HTML
    if (dialog.hasAttribute('opened')) {
      const openedVal = dialog.getAttribute('opened');
      if (openedVal === 'false') return false;
      // opened="" or opened="true" or opened (no value) — all mean open
    }
    if (dialog.hasAttribute('hidden')) return false;

    // Check computed visibility — dialog may exist in DOM but be hidden via CSS
    try {
      const style = window.getComputedStyle(dialog);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
    } catch (e) {}

    // Check inner dialog content in shadowRoot or light DOM
    const content = dialog.shadowRoot?.querySelector('#dialog, .dialog-content, tp-yt-paper-dialog, ytcp-dialog')
      || dialog.querySelector('#dialog, .dialog-content, ytcp-dialog, ytcp-multi-file-upload-dialog')
      || dialog;

    const rect = content.getBoundingClientRect();
    if (rect.width > 50 && rect.height > 50) return true;

    const hostRect = dialog.getBoundingClientRect();
    return hostRect.width > 50 && hostRect.height > 50;
  }

  // Expose helpers for automated testing & verification
  window.__XMON_DEV__ = window.__XMON_DEV__ || {};

  function normalizeVideoTitle(str) {
    if (!str) return '';
    return String(str)
      .replace(/\.[a-z0-9]{2,5}$/i, '')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .toLowerCase()
      .trim();
  }

  function toYouTubeCandidateTitle(fileName) {
    if (!fileName) return '';
    const noExt = String(fileName).replace(/\.[a-z0-9]{2,5}$/i, '');
    const sanitized = noExt.replace(/[<>]/g, '').slice(0, 100);
    return sanitized;
  }

  function isTitleMatching(titleA, titleB, allowSuffix = false) {
    if (!titleA || !titleB) return false;
    const a = normalizeVideoTitle(titleA);
    const b = normalizeVideoTitle(titleB);
    if (!a || !b) return false;
    // 1. Exact equality of normalized titles
    if (a === b) return true;

    // 2. Exact equality after applying YouTube upload title sanitization (strip <> and truncate to 100 chars)
    const ytA = normalizeVideoTitle(toYouTubeCandidateTitle(titleA));
    const ytB = normalizeVideoTitle(toYouTubeCandidateTitle(titleB));
    if (ytA === b || a === ytB || ytA === ytB) return true;

    // 3. Delimited trailing copy/number suffix (only enabled in secondary pass)
    if (allowSuffix) {
      const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const trailingPatternA = new RegExp('^' + escapeRegex(b) + '\\s+(?:\\d+|copy)$');
      const trailingPatternB = new RegExp('^' + escapeRegex(a) + '\\s+(?:\\d+|copy)$');
      if (trailingPatternA.test(a) || trailingPatternB.test(b)) {
        return true;
      }
    }

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

  // P3-3: Default poll raised from 100ms to 250ms to reduce DOM scan frequency.
  async function waitFor(predicate, timeoutMs = 10000, pollIntervalMs = 250) {
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
    publishedDraftKeys: new Set(), // Track positively published draft videoIds/titles (P1-9)
    failedDraftKeys: new Set(),    // Track failed draft videoIds/titles (P1-9)
    
    // Process control
    isRunning: false,
    isPaused: false,
    stopRequested: false,
    runToken: 0,
    limitReached: false,
    
    // Batch management
    batchSize: 15,
    currentBatch: 0,
    totalBatches: 0,
    
    // Counters
    totalCount: 0,
    uploadedCount: 0,
    publishedCount: 0,
    failedCount: 0,
    standalonePublished: 0,
    standaloneFailed: 0,
    
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
    
    // UI minimized (persisted across reloads)
    isMinimized: (() => {
      try {
        return localStorage.getItem('xmon_is_minimized') === 'true';
      } catch (e) {
        return false;
      }
    })(),
    
    // Current processing info
    currentVideoName: '',
    
    // Active animated alert/notification
    activeAlert: null // { type: 'daily_limit'|'format_error'|'duplicate'|'error', title, message, raw }
  };

  // Video status enum
  const STATUS = {
    WAITING: 'waiting',
    NEEDS_FILE: 'needs-file',
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
  // P5: RING-BUFFER DEBUG LOG
  // Last 300 events. Exposed on window.__XMON_DEV__.getLog().
  // ============================================================
  const _xmonLogBuffer = [];
  const _XMON_LOG_MAX = 300;

  function xmonLog(level, ...args) {
    const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    const entry = { t: new Date().toISOString(), level, msg };
    _xmonLogBuffer.push(entry);
    if (_xmonLogBuffer.length > _XMON_LOG_MAX) _xmonLogBuffer.shift();
    if (level === 'WARN' || level === 'ERROR') {
      console[level === 'ERROR' ? 'error' : 'warn']('[XMON]', msg);
    } else {
      console.debug('[XMON]', msg);
    }
  }

  function getDebugLog() {
    return _xmonLogBuffer.map(e => `[${e.t}] [${e.level}] ${e.msg}`).join('\n');
  }

  // ============================================================
  // P5: SELECTOR HEALTH CHECK
  // ============================================================
  function runSelectorHealthCheck() {
    const checks = [
      { name: 'Upload dialog', sel: 'ytcp-uploads-dialog' },
      { name: 'Multi-upload dialog', sel: 'ytcp-multi-file-upload-dialog' },
      { name: 'Video row', sel: 'ytcp-video-row' },
      { name: 'Editor dialog', sel: 'ytcp-video-metadata-editor, ytcp-video-editor' },
      { name: 'Done/Save button', sel: '#done-button, #save-button' },
      { name: 'Title textarea', sel: '#title-textarea' },
      { name: 'Visibility radio (PUBLIC)', sel: '[name="PUBLIC"]' },
      { name: 'Stepper step', sel: 'ytcp-stepper-step' },
      { name: 'MFK radio', sel: '[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]' },
      { name: 'Sidebar Content', sel: '[test-id="menu-item-content"], a[href*="/videos"]' },
      { name: 'Draft edit button', sel: '[aria-label*="Edit" i]' }
    ];
    const results = [];
    for (const c of checks) {
      const el = deepQuery(c.sel);
      const found = !!el;
      const visible = found ? isElementVisible(el) : false;
      results.push({ name: c.name, found, visible });
      xmonLog(found ? 'INFO' : 'WARN', `Health: ${c.name} — ${found ? (visible ? 'found+visible' : 'found(hidden)') : 'NOT FOUND'}`);
    }
    return results;
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
        ${isDailyLimit ? '<div class="xmon-toast-sub">YouTube quota reached \u2022 Queue paused safely for 24 hours</div>' : ''}
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
  // P2-3: detectYouTubeUploadError — separates dedicated error element text from dialog-wide text.
  // Broad patterns (upload failed, already uploaded) only run on DEDICATED error elements,
  // NOT on dialog-wide text (which contains filenames that may match those words).
  function detectYouTubeUploadError() {
    try {
      const dedicatedErrorSelectors = [
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

      // Text from DEDICATED error elements only — safe for broad pattern matching
      const dedicatedTexts = [];
      for (const sel of dedicatedErrorSelectors) {
        for (const el of deepQueryAll(sel)) {
          if (el && isElementVisible(el)) {
            const txt = (el.textContent || '').trim();
            if (txt) dedicatedTexts.push(txt);
          }
        }
      }

      // Check paper/ytcp toasts (dedicated elements)
      for (const t of deepQueryAll('ytcp-toast, paper-toast')) {
        if (t && isElementVisible(t)) dedicatedTexts.push(t.textContent || '');
      }

      const dedicatedText = dedicatedTexts.join(' ').toLowerCase();

      // Dialog-wide text — ONLY for quota/batch limit detection (regex-gated, not plain string)
      let dialogWideText = '';
      const uploadDialog = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
      if (uploadDialog && isElementVisible(uploadDialog)) {
        dialogWideText = (uploadDialog.textContent || '').toLowerCase();
      }

      // Combined text is used ONLY for patterns that are not filename-matchable
      // (daily limit / batch limit messages are very specific, low false-positive risk)
      const fullText = dedicatedText + ' ' + dialogWideText;

      // PATTERN 1: Daily Upload Limit (safe to check dialog-wide, uses regex)
      if (
        /daily\s*upload\s*limit\s*reached/.test(fullText) ||
        /upload\s*more\s*videos\s*in\s*24\s*hours/.test(fullText) ||
        /reached\s*your\s*daily\s*upload\s*limit/.test(fullText) ||
        /daily\s*limit\s*reached/.test(dedicatedText)
      ) {
        return {
          type: 'daily_limit',
          title: 'Daily upload limit reached',
          message: 'You can upload more videos in 24 hours.',
          raw: 'Daily upload limit reached. You can upload more videos in 24 hours.'
        };
      }

      // PATTERN 2: Batch Limit Exceeded (safe: very specific numeric phrase)
      if (
        /cannot\s*upload\s*more\s*than\s*15/.test(fullText) ||
        /more\s*than\s*15\s*videos\s*at\s*a\s*time/.test(fullText)
      ) {
        return {
          type: 'batch_limit_exceeded',
          title: 'Max 15 Videos Per Batch',
          message: 'YouTube allows maximum 15 videos at a time. The queue will upload in batches of 15.',
          raw: 'You cannot upload more than 15 videos at a time'
        };
      }

      // PATTERN 3: Video format unsupported (dedicated elements only)
      if (
        dedicatedText.includes('processing abandoned') ||
        dedicatedText.includes('format not supported') ||
        dedicatedText.includes('invalid file format') ||
        dedicatedText.includes('video could not be processed')
      ) {
        return {
          type: 'format_error',
          title: 'Unsupported Video Format',
          message: 'YouTube could not process this video format.',
          raw: 'Video format unsupported'
        };
      }

      // PATTERN 4: Duplicate (dedicated elements only — avoid filename false positives)
      if (dedicatedText.includes('duplicate video')) {
        return {
          type: 'duplicate',
          title: 'Duplicate Video Detected',
          message: 'This video has already been uploaded to your channel.',
          raw: 'Duplicate video'
        };
      }

      // PATTERN 5: Generic upload error (dedicated elements only)
      if (/\bupload\s+failed\b/.test(dedicatedText) || /\bserver\s+error\b/.test(dedicatedText)) {
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
      retryCount: v.retryCount || 0,
      draftId: v.draftId || null,
      draftTitle: v.draftTitle || null
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
      batchSize: state.batchSize,
      activeAlert: state.activeAlert,
      statusMessage: state.statusMessage
    };
    
    try {
      chrome.storage.local.set({ xmonQueueState: persistData });
    } catch (e) {
      console.warn('[XMON] Failed to persist queue state:', e);
    }
  }

  function setMinimized(val) {
    state.isMinimized = !!val;
    try {
      localStorage.setItem('xmon_is_minimized', state.isMinimized ? 'true' : 'false');
      if (chrome?.storage?.local) {
        chrome.storage.local.set({ xmon_is_minimized: state.isMinimized });
      }
    } catch (e) {}
    renderUI();
  }

  function restoreQueueState() {
    try {
      if (chrome?.storage?.local) {
        chrome.storage.local.get(['xmonQueueState', 'xmon_is_minimized'], (result) => {
          if (typeof result.xmon_is_minimized === 'boolean') {
            state.isMinimized = result.xmon_is_minimized;
            try { localStorage.setItem('xmon_is_minimized', String(state.isMinimized)); } catch(e) {}
          }
          if (result.xmonQueueState) {
            const data = result.xmonQueueState;
            if (data.config) state.config = { ...state.config, ...data.config };
            if (data.activeAlert) {
              if (data.activeAlert.type === 'daily_limit' && data.activeAlert.at && (Date.now() - data.activeAlert.at >= 24 * 60 * 60 * 1000)) {
                console.log('[XMON] Stored daily limit alert has expired (24h cooldown passed). Discarding.');
                state.activeAlert = null;
                state.limitReached = false;
                saveQueueState();
              } else {
                state.activeAlert = data.activeAlert;
              }
            }
            if (data.statusMessage) state.statusMessage = data.statusMessage;
            if (data.batchSize) state.batchSize = data.batchSize;
            state.uploadedCount = data.uploadedCount || 0;
            state.publishedCount = data.publishedCount || 0;
            state.failedCount = data.failedCount || 0;
            state.currentBatch = data.currentBatch || 0;
            state.totalBatches = data.totalBatches || 0;

            if (Array.isArray(data.queueMeta) && data.queueMeta.length > 0 && state.queue.length === 0) {
              state.queue = data.queueMeta.map(item => ({
                id: item.id || generateId(),
                file: null, // Needs user re-drop to re-attach file object
                name: item.name,
                size: item.size,
                status: (item.status === STATUS.PUBLISHED || item.status === STATUS.UPLOADED) ? item.status : STATUS.NEEDS_FILE,
                error: (item.status === STATUS.PUBLISHED) ? null : (item.error || 'Re-add file to resume'),
                retryCount: item.retryCount || 0,
                draftId: item.draftId || null,
                draftTitle: item.draftTitle || null
              }));
              state.totalCount = state.queue.length;
            }
          }
          renderUI();
        });
      }
    } catch (e) {
      console.warn('[XMON] Failed to restore queue state:', e);
    }
  }

  // Scroll helper for YouTube Studio's internal table container
  function scrollStudioTable(yOffset = 800) {
    const containers = [
      document.querySelector('#main-container'),
      document.querySelector('ytcp-table'),
      document.querySelector('ytcp-video-section'),
      document.querySelector('#page-container'),
      document.querySelector('#video-list'),
      document.querySelector('[role="main"]'),
      document.documentElement,
      window
    ];
    for (const el of containers) {
      if (el && typeof el.scrollBy === 'function') {
        try {
          el.scrollBy(0, yOffset);
          el.dispatchEvent(new Event('scroll', { bubbles: true }));
        } catch (e) {}
      }
    }
  }

  // ============================================================
  // FIND DRAFT ROWS (preserved & enhanced from v1)
  // ============================================================
  function findDraftRows() {
    const rows = deepQueryAll('ytcp-video-row');
    const drafts = [];

    const draftKeywords = [
      'draft', 'খসড়া', 'ड्राफ्ट', 'borrador', 'brouillon',
      'entwurf', 'rascunho', 'черновик', 'draf', 'taslak',
      'bozza', 'مسودة', 'bản nháp', '下書き', '초안', '草稿'
    ];

    for (const row of rows) {
      if (row.getAttribute('data-xmon-status') === 'published' || row.getAttribute('data-xmon-status') === 'failed') continue;

      // Visibility cell check - covers class, ID, role, custom elements & badges, fallback to row itself (like 2.1.0)
      const visCell = row.querySelector('#visibility-cell, #visibility, [id*="visibility" i], .cell-body.visibility, [class*="visibility" i], ytcp-video-list-cell-visibility, ytcp-badge, [role="cell"][id*="visibility" i]')
        || deepQuery('#visibility-cell, #visibility, [id*="visibility" i], .cell-body.visibility, [class*="visibility" i], ytcp-video-list-cell-visibility, ytcp-badge, [role="cell"][id*="visibility" i]', row)
        || row;
      const visText = (visCell.textContent || '').toLowerCase();
      let isDraftByVis = draftKeywords.some(kw => visText.includes(kw));

      // Edit draft button check (like 2.1.0)
      let editDraftBtn = row.querySelector('#edit-draft-button, .edit-draft-button, [test-id="edit-draft-button"]')
        || deepQuery('#edit-draft-button, .edit-draft-button, [test-id="edit-draft-button"]', row);

      if (!editDraftBtn) {
        const buttons = deepQueryAll('ytcp-button, ytcp-icon-button, button, a, [role="button"]', row);
        editDraftBtn = buttons.find(b => {
          const text = (b.textContent || b.getAttribute('aria-label') || b.getAttribute('title') || b.getAttribute('tooltip') || '').toLowerCase();
          return /edit\s*draft/i.test(text) || (text.includes('draft') && text.includes('edit')) || (text.includes('খসড়া') && text.includes('সম্পাদনা'));
        }) || null;
      }

      // If visCell didn't yield draft, check inner badges or cells in the row
      if (!isDraftByVis && !editDraftBtn) {
        const badgesOrCells = deepQueryAll('ytcp-badge, [role="cell"], .cell-body, span.badge', row);
        for (const el of badgesOrCells) {
          const t = (el.textContent || '').toLowerCase();
          if (draftKeywords.some(kw => t.includes(kw))) {
            isDraftByVis = true;
            break;
          }
        }
      }

      // Check title and non-title text
      const titleEl = row.querySelector('#video-title, .video-title, #title-link, a[href*="/video/"]')
        || deepQuery('#video-title, .video-title, #title-link, a[href*="/video/"]', row);
      const title = titleEl ? titleEl.textContent.trim() : 'Draft Video';
      const nonTitleText = (row.textContent || '').replace(title, '').toLowerCase();

      // Fallback: check whole row text excluding title & reject if clearly public/unlisted/private
      if (!isDraftByVis && !editDraftBtn) {
        const isPublishedState = /(public|unlisted|private|সর্বজনীন|পাবলিক|ব্যক্তিগত|না-তালিকাভুক্ত|público|publique|öffentlich)/i.test(nonTitleText);
        if (!isPublishedState && draftKeywords.some(kw => nonTitleText.includes(kw))) {
          isDraftByVis = true;
        }
      }

      // Strictly draft only: must match visibility text or explicit edit draft button
      const isDraft = isDraftByVis || (editDraftBtn !== null);
      if (!isDraft) continue;

      // Re-verify it is not a public row
      const isClearlyPublic = /(public|unlisted|private|সর্বজনীন|পাবলিক|ব্যক্তিগত|না-তালিকাভুক্ত)/i.test(visText) && !editDraftBtn;
      if (isClearlyPublic) continue;

      // Fallback for editDraftBtn: title link, thumbnail, or row
      if (!editDraftBtn) {
        editDraftBtn = row.querySelector('a[href*="/video/"]') || deepQuery('a[href*="/video/"]', row)
          || row.querySelector('#thumbnail, ytcp-video-thumbnail') || deepQuery('#thumbnail, ytcp-video-thumbnail', row)
          || row;
      }

      const videoId = row.getAttribute('video-id') ||
        row.querySelector('a[href*="/video/"]')?.href?.match(/\/video\/([^/?#]+)/)?.[1] ||
        deepQuery('a[href*="/video/"]', row)?.href?.match(/\/video\/([^/?#]+)/)?.[1] ||
        '';

      drafts.push({ row, editBtn: editDraftBtn, title, videoId });
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

    // Step 1: Click "Edit draft" — with retry/re-hover loop
    let buttonToClick = editBtn;
    let editBtnFound = !!buttonToClick;

    // Retry up to 3 times with increasing hover delay to find the edit button
    for (let hoverAttempt = 0; !editBtnFound && hoverAttempt < 3; hoverAttempt++) {
      try {
        // Scroll the row into view first
        row.scrollIntoView({ block: 'center', behavior: 'smooth' });
        await sleep(200);

        // Dispatch both mouseenter and mouseover for compatibility
        row.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        row.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        // Also try focusing the row
        try { row.focus(); } catch(e) {}
      } catch (e) {}

      // Wait longer on each retry (500ms, 800ms, 1200ms)
      await sleep(500 + hoverAttempt * 300);

      // Try extended selectors
      buttonToClick = deepQuery('#edit-draft-button, .edit-draft-button, [test-id="edit-draft-button"], [aria-label*="draft" i], [aria-label*="Edit" i], [title*="draft" i]', row);

      if (!buttonToClick) {
        const buttons = deepQueryAll('ytcp-button, ytcp-icon-button, button, a, [role="button"]', row);
        buttonToClick = buttons.find(b => {
          const text = (b.textContent || b.getAttribute('aria-label') || b.getAttribute('title') || b.getAttribute('tooltip') || '').toLowerCase();
          return /edit\s*draft/i.test(text) || /edit\s*video/i.test(text) || text.includes('খসড়া');
        });
      }

      // Fallback: look for icon buttons in action area
      if (!buttonToClick) {
        const actionBtns = deepQueryAll('ytcp-icon-button, [icon="icons:create"], [icon="icons:more-vert"]', row);
        buttonToClick = actionBtns.find(b => {
          const label = (b.getAttribute('aria-label') || b.getAttribute('title') || '').toLowerCase();
          return label.includes('edit') || label.includes('draft');
        });
      }

      // Fallback: title link, thumbnail or title element (all navigate into editor in YouTube Studio)
      if (!buttonToClick) {
        const titleLink = row.querySelector('a[href*="/video/"]') || deepQuery('a[href*="/video/"]', row);
        if (titleLink && isElementVisible(titleLink)) {
          buttonToClick = titleLink;
        } else {
          const thumb = row.querySelector('#thumbnail, ytcp-video-thumbnail') || deepQuery('#thumbnail, ytcp-video-thumbnail', row);
          if (thumb && isElementVisible(thumb)) {
            buttonToClick = thumb;
          } else {
            const titleEl = row.querySelector('#video-title, .video-title, #title-link') || deepQuery('#video-title, .video-title, #title-link', row);
            if (titleEl && isElementVisible(titleEl)) {
              buttonToClick = titleEl;
            }
          }
        }
      }

      if (buttonToClick) editBtnFound = true;
    }

    if (!buttonToClick) throw new Error('Edit draft button not found');
    clickElement(buttonToClick);

    // Step 2: Wait for editor dialog (aligned with v2.1.0 proven logic)
    const dialog = await waitFor(() => {
      const d = document.querySelector('ytcp-uploads-dialog, ytcp-video-metadata-editor')
        || deepQuery('ytcp-uploads-dialog, ytcp-video-metadata-editor, ytcp-video-metadata-editor-advanced, ytcp-video-editor');
      return (d && (isElementVisible(d) || isDialogOpen(d))) ? d : null;
    }, 15000);

    if (!dialog) throw new Error('Editor dialog did not open');
    await sleep(600);

    // Step 3: Audience - "Not made for kids"
    if (state.config.notMadeForKids) {
      const notForKidsRadio = await waitFor(() => {
        // Try direct name attribute first
        const directMatch = deepQuery('tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]', dialog)
          || deepQuery('[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]', dialog);
        if (directMatch) return directMatch;

        // Fallback: find by text content
        const allRadios = deepQueryAll('tp-yt-paper-radio-button, [role="radio"]', dialog);
        return allRadios.find(el =>
          /not made for kids/i.test(el.textContent) ||
          el.getAttribute('name') === 'VIDEO_MADE_FOR_KIDS_NOT_MFK'
        ) || null;
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
    const stepperTabs = deepQueryAll('ytcp-stepper-step, [role="tab"]', dialog);
    const visTab = stepperTabs.find(tab => /visibility/i.test(tab.textContent)) || stepperTabs[stepperTabs.length - 1];

    if (visTab && isButtonEnabled(visTab)) {
      clickElement(visTab);
      await sleep(400);
    }

    // Click "Next" if needed to reach visibility
    let nextTries = 0;
    while (nextTries < 6) {
      const pubRadio = deepQuery(`tp-yt-paper-radio-button[name="${state.config.visibility}"]`, dialog)
        || deepQuery(`[name="${state.config.visibility}"]`, dialog);
      if (pubRadio && isElementVisible(pubRadio)) break;

      const nextBtn = deepQuery('#next-button', dialog)
        || deepQueryAll('ytcp-button', dialog).find(b => /^next$/i.test((b.textContent || '').trim()));
      if (nextBtn && isButtonEnabled(nextBtn)) {
        clickElement(nextBtn);
        await sleep(400);
      } else {
        break;
      }
      nextTries++;
    }

    // Step 5: Select Visibility — expanded selectors for YouTube Studio component changes
    const targetVisibility = state.config.visibility.toUpperCase();
    const visRadio = await waitFor(() => {
      // Try direct name match first
      const r = deepQuery(`tp-yt-paper-radio-button[name="${targetVisibility}"]`, dialog)
        || deepQuery(`[name="${targetVisibility}"]`, dialog);
      if (r && isElementVisible(r)) return r;

      // Fallback: search all radio buttons by name and text content
      const allRadios = deepQueryAll('tp-yt-paper-radio-button, [role="radio"], ytcp-ve-visibility-radio-button', dialog);
      const isTargetPublic = targetVisibility === 'PUBLIC';
      const isTargetUnlisted = targetVisibility === 'UNLISTED';
      const isTargetPrivate = targetVisibility === 'PRIVATE';

      const match = allRadios.find(el => {
        const nameAttr = (el.getAttribute('name') || '').toUpperCase();
        if (nameAttr === targetVisibility) return true;
        const text = (el.textContent || '').trim().toLowerCase();
        if (isTargetPublic && (text.includes('public') || text.includes('সর্বজনীন') || text.includes('পাবলিক') || text.includes('público'))) return true;
        if (isTargetUnlisted && (text.includes('unlisted') || text.includes('তালিকাবিহীন') || text.includes('না-তালিকাভুক্ত') || text.includes('oculto'))) return true;
        if (isTargetPrivate && (text.includes('private') || text.includes('ব্যক্তিগত') || text.includes('privado'))) return true;
        return false;
      });
      return (match && isElementVisible(match)) ? match : null;
    }, 8000);

    if (!visRadio) throw new Error(`Could not find ${targetVisibility} radio button`);

    const isVisChecked = visRadio.getAttribute('aria-checked') === 'true' || visRadio.checked;
    if (!isVisChecked) {
      clickElement(visRadio);
      await sleep(300);
    }

    // Step 6: Click Save/Publish/Done
    const doneBtn = await waitFor(() => {
      const btn = deepQuery('#done-button, #save-button, ytcp-button#done-button', dialog)
        || deepQueryAll('ytcp-button, button', dialog).find(b => /^(publish|save|done|প্রকাশ করুন|পাবলিশ|সংরক্ষণ করুন|publicar|enregistrer|guardar)$/i.test((b.textContent || '').trim()));
      return (btn && isButtonEnabled(btn)) ? btn : null;
    }, 8000);

    if (!doneBtn) throw new Error('Publish/Done button remained disabled or was not found');
    clickElement(doneBtn);
    await sleep(800);

    // Step 7: Wait for dialog dismiss (aligned with v2.1.0 proven logic)
    await waitFor(() => {
      // Check for YouTube Studio confirmation prompts (e.g. "Checks still running", "Publish anyway")
      const promptConfirm = deepQuery('ytcp-confirmation-dialog #confirm-button, ytcp-alert-dialog #confirm-button, #dialog-action-buttons [aria-label*="Publish" i]');
      if (promptConfirm && isElementVisible(promptConfirm) && isButtonEnabled(promptConfirm)) {
        clickElement(promptConfirm);
      }

      // Close share dialog if it appears
      const shareClose = deepQuery('ytcp-video-share-dialog #close-button, ytcp-video-share-dialog [aria-label="Close"], #share-dialog #close-button, ytcp-video-share-dialog ytcp-button');
      if (shareClose && isElementVisible(shareClose)) {
        clickElement(shareClose);
      }

      const activeDialog = document.querySelector('ytcp-uploads-dialog, ytcp-video-metadata-editor')
        || deepQuery('ytcp-uploads-dialog, ytcp-video-metadata-editor, ytcp-video-metadata-editor-advanced, ytcp-video-editor');
      return !activeDialog || !isElementVisible(activeDialog) || activeDialog.getAttribute('aria-hidden') === 'true';
    }, 12000);

    // Close any lingering share dialog
    const lingeringShare = deepQuery('ytcp-video-share-dialog #close-button, ytcp-video-share-dialog [aria-label="Close"]');
    if (lingeringShare && isElementVisible(lingeringShare)) {
      clickElement(lingeringShare);
      await sleep(300);
    }

    row.setAttribute('data-xmon-status', 'published');
    row.style.outline = '2px solid #2ecc71';
    state.publishedCount = (state.publishedCount || 0) + 1;
    if (!state.publishedDraftKeys) state.publishedDraftKeys = new Set();
    const draftKey = draftItem.videoId || draftItem.title;
    state.publishedDraftKeys.add(draftKey);
  }

  // ============================================================
  // UPLOAD VIDEOS TO YOUTUBE
  // ============================================================
  // Helper: Open YouTube Studio Upload Dialog (handles direct icon and CREATE menu)
  async function openYouTubeUploadDialog() {
    // 1. If dialog is ALREADY open, check if it's usable for uploading
    const existingDialog = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
    if (existingDialog && (isDialogOpen(existingDialog) || isElementVisible(existingDialog))) {
      // Check if it already has active upload items (still uploading previous batch)
      const hasUploadItems = deepQueryAll('ytcp-uploads-file-item, .upload-item', existingDialog).length > 0;
      if (hasUploadItems) {
        console.log('[XMON] Upload dialog open and actively uploading files. Reusing dialog.');
        return true;
      }

      // Check if dropzone, file input, or "Select files" button is present
      const hasDropzone = deepQuery('ytcp-upload-drop-target, #drop-target, #file-loader, input[type="file"]:not([data-xmon-internal]), #select-button', existingDialog);
      if (hasDropzone) {
        console.log('[XMON] Upload dialog open and ready for file injection. Reusing dialog.');
        return true;
      }

      // Check dialog text for upload cues
      const dialogText = (existingDialog.textContent || '').toLowerCase();
      if (dialogText.includes('upload') || dialogText.includes('drag and drop') || dialogText.includes('select files')) {
        console.log('[XMON] Upload dialog recognized by text cues. Reusing dialog.');
        return true;
      }

      // If open in an unrecognized state, attempt a clean close before reopening
      console.log('[XMON] Existing dialog in unknown state. Closing before reopening...');
      await closeUploadDialog();
      await sleep(1200);
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
        return (d && (isDialogOpen(d) || isElementVisible(d))) ? d : null;
      }, 5000).catch(err => { if (err?.message === 'CANCELLED_BY_USER') throw err; return null; });
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
      }, 5000).catch(err => { if (err?.message === 'CANCELLED_BY_USER') throw err; return null; });

      if (uploadItem) {
        console.log('[XMON] Clicking "Upload videos" dropdown item...');
        clickElement(uploadItem);
        const dialog = await waitFor(() => {
          const d = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
          return (d && (isDialogOpen(d) || isElementVisible(d))) ? d : null;
        }, 6000).catch(err => { if (err?.message === 'CANCELLED_BY_USER') throw err; return null; });
        if (dialog) return true;
      }
    }

    // 4. Final verification if dialog appeared
    const dialog = await waitFor(() => {
      const d = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
      return (d && (isDialogOpen(d) || isElementVisible(d))) ? d : null;
    }, 4000).catch(err => { if (err?.message === 'CANCELLED_BY_USER') throw err; return null; });

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

    // Step 4: Populate DataTransfer (strictly capped at 15 for YouTube Studio limit)
    const safeBatchFiles = (batchFiles || []).slice(0, 15);
    const dt = new DataTransfer();
    for (const file of safeBatchFiles) {
      dt.items.add(file);
    }

    // Clear input value first if possible
    if (ytFileInput) {
      try { ytFileInput.value = ''; } catch (e) {}
    }

    // Step 5: Inject files — use Method A first, fallback to Method B ONLY if Method A fails
    // CRITICAL: Previously both Method A AND Method B ran sequentially, injecting 15 + 15 = 30 files,
    // which caused YouTube Studio to display "You cannot upload more than 15 videos at a time".
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

    // Method B: DragEvent drop ONLY as fallback if Method A was not dispatched
    if (!dispatched) {
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
          console.log('[XMON] Dispatched drop event onto YouTube drop target (fallback)');
        } catch (err) {
          console.warn('[XMON] Drop event fallback error:', err);
        }
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
      let retryDispatched = false;
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
          retryDispatched = true;
          console.log('[XMON] Retry injection sent.');
        } catch (retryErr) {
          console.warn('[XMON] Retry injection failed:', retryErr);
        }
      }

      if (!retryDispatched) {
        const targetElement = dropTarget || deepQuery('ytcp-uploads-dialog');
        if (targetElement) {
          try {
            const dragInit = { bubbles: true, cancelable: true, composed: true, dataTransfer: dt };
            targetElement.dispatchEvent(new DragEvent('drop', dragInit));
          } catch (e) {}
        }
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
    const dialog = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
    if (!dialog) return null;

    const selectors = [
      '#close-button',
      'ytcp-icon-button#close-button',
      'ytcp-button#close-button',
      '[aria-label="Close"]',
      '#dialog-close-button',
      '#dismiss-button'
    ];
    for (const sel of selectors) {
      const btn = deepQuery(sel, dialog);
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
    if (!uploadDialog) {
      return;
    }

    console.log('[XMON] Attempting to close upload dialog...');

    for (let attempt = 0; attempt < 5; attempt++) {
      // 1. Search for close button inside uploadDialog first, then globally
      const closeBtn = deepQuery('#close-button, ytcp-icon-button#close-button, ytcp-button#close-button, [aria-label="Close"], #dismiss-button', uploadDialog)
        || deepQuery('#close-button, [aria-label="Close"]');

      if (closeBtn && isElementVisible(closeBtn)) {
        console.log('[XMON] Found close button, clicking...');
        clickElement(closeBtn);
        await sleep(700);
      }

      // 2. Handle confirmation prompt if shown
      const confirmDialog = deepQuery('ytcp-confirmation-dialog, ytcp-alert-dialog');
      if (confirmDialog && (isDialogOpen(confirmDialog) || isElementVisible(confirmDialog))) {
        const cBtns = deepQueryAll('ytcp-button, button', confirmDialog);
        for (const cBtn of cBtns) {
          const text = (cBtn.textContent || '').toLowerCase().trim();
          // First check for destructive actions to avoid accidentally clicking them
          const isDestructive = text.includes('cancel upload') || text.includes('discard') || text.includes('abandon') || text.includes('delete');
          // Safe actions: save as draft, keep, close (non-destructive)
          const isSafe = !isDestructive && (
            text.includes('save') || text.includes('draft') || text.includes('keep') ||
            text === 'close' || text.includes('yes') || text.includes('proceed')
          );
          if (isSafe && isElementVisible(cBtn)) {
            console.log('[XMON] Clicking safe confirmation prompt button:', text);
            clickElement(cBtn);
            await sleep(700);
            break;
          }
        }
      }

      // 3. Check if upload dialog is closed
      const active = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
      if (!active || (!isDialogOpen(active) && !isElementVisible(active))) {
        console.log('[XMON] Upload dialog successfully closed.');
        await sleep(500);
        return;
      }

      // 4. Send Escape key to dialog and window
      uploadDialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, code: 'Escape', bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, code: 'Escape', bubbles: true }));
      await sleep(800);
    }

    // Final check: wait up to 3s for dialog to fully disappear from DOM
    await waitFor(() => {
      const d = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
      return (!d || (!isDialogOpen(d) && !isElementVisible(d))) ? true : null;
    }, 3000).catch(err => { if (err?.message === 'CANCELLED_BY_USER') throw err; return null; });
  }

  // ============================================================
  // UPLOAD COMPLETION DETECTION
  // ============================================================
  async function waitForBatchUploadComplete(batchCount, currentBatchVideos = []) {
    updateStatus(`Uploading ${batchCount} video(s) to YouTube...`, 'active');
    
    // Configurable timeout: at least 120s, 20s per video
    const timeoutMs = Math.max(batchCount * 20000, 120000);
    let deadline = Date.now() + timeoutMs;
    let consecutiveDoneCount = 0;
    const trackedVideoIds = new Set();
    let highestProgressSum = 0;
    // P2-2: track which non-critical notification types have been shown this batch to avoid spam
    const shownNotificationTypes = new Set();

    while (Date.now() < deadline) {
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
          state.limitReached = true;
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
        } else if (detectedError.type === 'batch_limit_exceeded') {
          console.warn('[XMON] Max batch limit exceeded detected on YouTube Studio dialog');
          updateStatus('Batch limit exceeded (max 15). Closing dialog to recover...', 'warning');
          showToast('YouTube limit: Max 15 videos per batch', 'warning', 4000);
          await closeUploadDialog();
          await sleep(1500);
          throw new Error('BATCH_LIMIT_EXCEEDED');
        } else {
          // P2-2: show each non-critical notification type at most once per batch
          if (!shownNotificationTypes.has(detectedError.type)) {
            shownNotificationTypes.add(detectedError.type);
            showAnimatedNotification({
              type: detectedError.type,
              title: detectedError.title,
              message: detectedError.message,
              duration: 6000
            });
          }
        }
      }

      // 2. Direct Content Draft Check: requires ALL expected videos matched to distinct drafts
      const contentDrafts = findDraftRows();
      if (contentDrafts.length > 0) {
        const claimedDraftKeys = new Set(
          currentBatchVideos
            .filter(v => v.status === STATUS.UPLOADED && v.draftId)
            .map(v => v.draftId)
        );

        for (const video of currentBatchVideos) {
          if (video.status === STATUS.UPLOADED && video.draftId) continue;
          const match = contentDrafts.find(d => {
            const key = d.videoId || d.title;
            if (claimedDraftKeys.has(key)) return false;
            return isTitleMatching(video.name, d.title);
          });
          if (match) {
            const key = match.videoId || match.title;
            claimedDraftKeys.add(key);
            if (video.status === STATUS.UPLOADING) {
              video.status = STATUS.UPLOADED;
              video.draftId = key;
              video.draftTitle = match.title;
              state.processedIds.add(video.id);
              trackedVideoIds.add(video.id);
            }
          }
        }

        const allMatched = currentBatchVideos.every(v => v.status === STATUS.UPLOADED || v.status === STATUS.PUBLISHED);
        if (allMatched) {
          console.log(`[XMON] All ${currentBatchVideos.length} batch videos confirmed as distinct drafts in YouTube Studio. Exiting wait loop.`);
          renderUI();
          return true;
        }
      }

      // 3. Multi-file items tracking in active upload dialog (de-duplicate nested matches)
      let fileItems = deepQueryAll('ytcp-uploads-file-item');
      if (fileItems.length === 0) {
        fileItems = deepQueryAll('.upload-item, ytcp-upload-item');
      }
      // De-duplicate if parent and child both match
      fileItems = fileItems.filter(el => !fileItems.some(other => other !== el && other.contains(el)));

      let completedInDom = 0;
      let failedInDom = 0;

      if (fileItems.length > 0) {
        fileItems.forEach((item) => {
          const extractedName = extractItemFileName(item);
          const itemText = (item.textContent || '').toLowerCase();
          const isDone = itemText.includes('saved as draft') ||
                         itemText.includes('upload complete') ||
                         itemText.includes('uploads complete') ||
                         itemText.includes('checks complete') ||
                         itemText.includes('100%');
          const isFailed = itemText.includes('abandoned') ||
                            itemText.includes('upload failed') ||
                            itemText.includes('upload rejected');

          if (isDone || isFailed) completedInDom++;
          if (isFailed) failedInDom++;

          for (const video of currentBatchVideos) {
            if (trackedVideoIds.has(video.id)) continue;
            // P1-2: Match against extracted title or word boundary in item text for progress tracking
            let matches = isTitleMatching(video.name, extractedName, false);
            if (!matches && (extractedName || itemText)) {
              const normVideo = normalizeVideoTitle(video.name);
              const normExtracted = normalizeVideoTitle(extractedName || itemText);
              const wordBoundary = new RegExp('(?:^|\\s)' + normVideo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\s|$)', 'i');
              matches = wordBoundary.test(normExtracted);
            }

            if (matches) {
              if (isDone && video.status === STATUS.UPLOADING) {
                video.status = STATUS.UPLOADED;
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

      // 4. Check if upload dialog closed / disappeared after grace period
      const activeUploadDialog = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
      const dialogDisappeared = !activeUploadDialog || (!isDialogOpen(activeUploadDialog) && !isElementVisible(activeUploadDialog));
      if (dialogDisappeared && Date.now() - (deadline - timeoutMs) > 8000) {
        console.log('[XMON] Upload dialog closed. Advancing to Content page draft verification.');
        renderUI();
        return true;
      }

      // 5. Track active upload progress bars and extend deadline if advancing (P1-1)
      const activeProgressBars = deepQueryAll('tp-yt-paper-progress, ytcp-video-upload-progress, paper-progress').filter(p => {
        if (!isElementVisible(p)) return false;
        const val = parseInt(p.getAttribute('aria-valuenow') || p.value || '0', 10);
        return val > 0 && val < 100;
      });

      let currentProgressSum = 0;
      for (const bar of activeProgressBars) {
        currentProgressSum += parseInt(bar.getAttribute('aria-valuenow') || bar.value || '0', 10);
      }
      const currentItemsSig = fileItems.map(i => (i.textContent || '').slice(0, 40)).join('|');
      if (fileItems.length > lastItemCount || currentItemsSig !== lastItemsSignature || currentProgressSum > highestProgressSum) {
        lastItemCount = fileItems.length;
        lastItemsSignature = currentItemsSig;
        if (currentProgressSum > highestProgressSum) highestProgressSum = currentProgressSum;
        // Extend deadline while active progress, item count, or text changes occur
        deadline = Math.max(deadline, Date.now() + 30000);
      }

      // 6. Check per-item completion in active dialog (P1-1: STRICT, never use dialog-wide text or close button alone)
      const isAllItemsCompletedInDom = (fileItems.length >= batchCount) && (completedInDom >= batchCount);

      if (isAllItemsCompletedInDom) {
        consecutiveDoneCount++;
        if (consecutiveDoneCount >= 2) {
          console.log(`[XMON] Batch upload confirmed complete on dialog: all ${completedInDom}/${batchCount} items finished.`);
          updateStatus('Batch upload confirmed. Ready to close dialog...', 'active');
          renderUI();
          return true;
        }
      } else {
        consecutiveDoneCount = 0;
      }

      await sleep(1500);
    }

    console.warn('[XMON] Batch upload wait deadline reached. Advancing to draft verification without blindly marking uploaded...');
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
    // P2-4: Removed history.pushState fallback (was pushing /videos/upload which reopened upload dialog).
    // Prefer sidebar click only; if not found, report a clear error and stop.
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

      if (!clicked) {
        console.warn('[XMON] navigateToContentSafe: Could not find sidebar Content item. Cannot navigate. Please navigate to Content page manually.');
        xmonLog('WARN', 'navigateToContentSafe: sidebar Content item not found — manual navigation required.');
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
    
    // Ensure we are on Content page (Shorts tab first for Shorts, or Videos)
    const initialTab = window.location.href.includes('/short') ? 'shorts' : 'videos';
    await navigateToContentSafe(initialTab);
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

      // Pass 1: Strict title matching with unique draft claiming
      const claimedDraftKeys = new Set(
        currentBatchVideos
          .filter(v => (v.status === STATUS.UPLOADED || v.status === STATUS.PUBLISHED) && v.draftId)
          .map(v => v.draftId)
      );

      for (const video of currentBatchVideos) {
        if (video.status === STATUS.UPLOADED && video.draftId) continue;
        if (video.status === STATUS.PUBLISHED) continue;

        const matchingDraft = drafts.find(d => {
          const key = d.videoId || d.title;
          if (claimedDraftKeys.has(key)) return false;
          return isTitleMatching(video.name, d.title);
        });

        if (matchingDraft) {
          const draftKey = matchingDraft.videoId || matchingDraft.title;
          claimedDraftKeys.add(draftKey);
          console.log(`[XMON] Confirmed draft in YouTube Studio: "${matchingDraft.title}" matches "${video.name}"`);
          video.status = STATUS.UPLOADED;
          video.draftId = draftKey;
          video.draftTitle = matchingDraft.title;
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

    // Strict rule: Any video without verified matching draft becomes FAILED (never UPLOADED)
    for (const video of currentBatchVideos) {
      if (video.status !== STATUS.UPLOADED && video.status !== STATUS.PUBLISHED) {
        console.warn(`[XMON] Draft not found for "${video.name}". Marking FAILED.`);
        video.status = STATUS.FAILED;
        video.error = 'Draft not found on YouTube Studio after upload';
        state.failedCount++;
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

      if (!draftItem) {
        // P3-4: Scroll the nearest scrollable ancestor of the draft rows,
        // not window (Studio renders its list in an inner container).
        const anyRow = deepQuery('ytcp-video-row');
        if (anyRow) {
          let scrollable = anyRow.parentElement;
          while (scrollable && scrollable !== document.body) {
            const style = window.getComputedStyle(scrollable);
            if (/auto|scroll/.test(style.overflowY) && scrollable.scrollHeight > scrollable.clientHeight) break;
            scrollable = scrollable.parentElement;
          }
          if (scrollable && scrollable !== document.body) {
            scrollable.scrollBy(0, 600);
          } else {
            window.scrollBy(0, 600);
          }
        } else {
          window.scrollBy(0, 600);
        }
        await sleep(1200);
        drafts = findDraftRows();
        if (video.draftId) {
          draftItem = drafts.find(d => (d.videoId && d.videoId === video.draftId) || d.title === video.draftTitle);
        }
        if (!draftItem) {
          draftItem = drafts.find(d => isTitleMatching(video.name, d.title));
        }
      }

      // Strictly never fallback to unrelated drafts[0]
      if (!draftItem) {
        console.warn(`[XMON] Draft row for "${video.name}" not found at publish step.`);
        video.status = STATUS.FAILED;
        video.error = 'Draft row not visible during publish step';
        state.failedCount++;
        renderUI();
        continue;
      }

      const maxRetries = Math.max(1, state.config.maxRetries || 2);
      let pubSuccess = false;
      let lastErr = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        if (state.stopRequested) break;
        try {
          video.status = STATUS.PUBLISHING;
          renderUI();

          await publishSingleDraft(draftItem, i + 1, readyVideos.length);
          pubSuccess = true;
          break;
        } catch (pubErr) {
          lastErr = pubErr;
          if (pubErr.message === 'CANCELLED_BY_USER') throw pubErr;
          console.warn(`[XMON] Publish attempt ${attempt}/${maxRetries} failed for "${video.name}":`, pubErr);
          await closeStuckDialogs(true);
          if (attempt < maxRetries) await sleep(1500);
        }
      }

      if (pubSuccess) {
        video.status = STATUS.PUBLISHED;
        showToast(`Published: ${video.name}`, 'success', 2500);
        renderUI();
        saveQueueState();
      } else {
        console.error(`[XMON] Failed to publish draft for "${video.name}" after ${maxRetries} attempts:`, lastErr);
        video.status = STATUS.FAILED;
        video.error = `Publish error: ${lastErr?.message || 'Unknown error'}`;
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
    state.runToken = (state.runToken || 0) + 1;
    const currentRunToken = state.runToken;
    state.limitReached = false;
    state.stopRequested = false;
    state.isPaused = false;
    
    const initialWaiting = state.queue.filter(v => v.status === STATUS.WAITING || v.status === STATUS.FAILED);
    if (initialWaiting.length === 0) {
      // P2-6: Show a more helpful message if all items are needs-file
      const needsFileCount = state.queue.filter(v => v.status === STATUS.NEEDS_FILE).length;
      if (needsFileCount > 0) {
        showToast(`Re-add ${needsFileCount} file(s) to resume. Drop the original video files onto the queue.`, 'warning', 6000);
      } else {
        showToast('No videos to process in queue.', 'warning');
      }
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
    state.batchSize = Math.min(state.batchSize || 15, 15);
    state.totalBatches = Math.ceil(activeWaiting.length / state.batchSize);
    state.currentBatch = 0;
    state.uploadedCount = state.queue.filter(v => v.status === STATUS.UPLOADED || v.status === STATUS.PUBLISHED).length;
    state.publishedCount = state.queue.filter(v => v.status === STATUS.PUBLISHED).length;
    state.failedCount = 0;
    
    showToast(`Starting queue: ${activeWaiting.length} video(s) in ${state.totalBatches} batch(es)`, 'info');
    renderUI();
    
    let batchLimitRetries = 0;

    try {
      while (!state.stopRequested) {
        if (state.runToken !== currentRunToken) return;
        if (state.limitReached || (state.activeAlert && state.activeAlert.type === 'daily_limit')) {
          console.warn('[XMON] Daily limit reached flag detected. Stopping queue processing.');
          break;
        }

        if (state.isPaused) {
          updateStatus('Queue paused. Click Resume to continue.', 'paused');
          renderUI();
          await waitForResume();
          if (state.stopRequested || state.runToken !== currentRunToken) break;
        }

        // Dynamically get the remaining waiting videos
        const waitingVideos = state.queue.filter(v => v.status === STATUS.WAITING);
        if (waitingVideos.length === 0) {
          console.log('[XMON] All waiting videos in queue have been processed!');
          break;
        }

        state.currentBatch++;
        const currentBatchVideos = waitingVideos.slice(0, state.batchSize);
        const batchFiles = currentBatchVideos.filter(v => v.file).map(v => v.file).slice(0, 15);
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

          // Step 1: Pre-batch cleanup — close stuck or leftover dialogs with old items
          const existingD = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
          const hasStuckOldItems = existingD && deepQueryAll('ytcp-uploads-file-item, .upload-item', existingD).length > 0;
          if (hasStuckOldItems) {
            updateStatus(`Batch ${state.currentBatch}/${state.totalBatches} - Preparing (closing previous dialog)...`, 'active');
            await closeStuckDialogs(true);
            await closeUploadDialog();
            await waitFor(() => {
              const d = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
              return (!d || (!isDialogOpen(d) && !isElementVisible(d))) ? true : null;
            }, 6000).catch(err => { if (err?.message === 'CANCELLED_BY_USER') throw err; return null; });
            await sleep(800);
          }

          // Step 2: Inject and upload the batch files to YouTube Studio
          await uploadBatchToYouTube(batchFiles);
          
          // Step 3: Wait for uploads in the dialog & draft save
          await waitForBatchUploadComplete(expectedUploadCount, currentBatchVideos);

          // Step 4: Close the upload dialog and wait for it to be fully gone
          updateStatus('Closing upload dialog...', 'active');
          await closeUploadDialog();
          // Confirm dialog is gone before proceeding
          await waitFor(() => {
            const d = deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
            return (!d || (!isDialogOpen(d) && !isElementVisible(d))) ? true : null;
          }, 6000).catch(err => { if (err?.message === 'CANCELLED_BY_USER') throw err; return null; });
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
          
          // Reset batch limit retries counter on successful batch
          batchLimitRetries = 0;

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
          
          if (batchErr.message === 'BATCH_LIMIT_EXCEEDED') {
            batchLimitRetries++;
            if (batchLimitRetries > 2) {
              console.error('[XMON] Batch limit exceeded retry cap reached (2). Failing current batch.');
              for (const video of currentBatchVideos) {
                if (video.status === STATUS.UPLOADING) {
                  video.status = STATUS.FAILED;
                  video.error = 'YouTube batch upload limit exceeded (max 15 videos)';
                  state.failedCount++;
                }
              }
              showToast('Batch limit exceeded retry cap reached. Batch failed.', 'error', 4000);
              await closeStuckDialogs(true);
              renderUI();
              saveQueueState();
              continue;
            }

            console.warn(`[XMON] Handling batch limit error (attempt ${batchLimitRetries}/2): clamping batchSize to 15 and retrying waiting videos...`);
            state.batchSize = 15;
            for (const video of currentBatchVideos) {
              if (video.status === STATUS.UPLOADING) {
                video.status = STATUS.WAITING;
                video.error = null;
              }
            }
            state.currentBatch = Math.max(0, state.currentBatch - 1);
            showToast('Batch capped at 15 videos. Retrying batch...', 'info', 3000);
            await closeStuckDialogs(true);
            await sleep(2000);
            renderUI();
            saveQueueState();
            continue;
          }
          
          const isDailyLimit = batchErr.message === 'DAILY_UPLOAD_LIMIT_REACHED' ||
                                (state.activeAlert && state.activeAlert.type === 'daily_limit');
          
          if (isDailyLimit) {
            console.warn('[XMON] Daily upload limit reached. Halting queue safely.');
            state.limitReached = true;
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
      if (state.runToken === currentRunToken) {
        state.isRunning = false;
        state.isPaused = false;
        state.currentVideoName = '';

        // P2-8: On stop, attempt to close any open upload dialog cleanly
        if (state.stopRequested) {
          try { await closeStuckDialogs(true); } catch(e) {}
          try { await closeUploadDialog(); } catch(e) {}
        }

        const finalMsg = `Complete! Uploaded: ${state.uploadedCount}, Published: ${state.publishedCount}, Failed: ${state.failedCount}`;
        updateStatus(finalMsg, 'idle');
        saveQueueState();
        renderUI();

        showToast(finalMsg, state.failedCount > 0 ? 'warning' : 'success', 5000);
      }
    }
  }

  // ============================================================
  // DRAFT PUBLISHER (Standalone Mode)
  // ============================================================
  async function publishAllDrafts(maxToPublish = 50) {
    let publishRound = 0;
    const maxRounds = maxToPublish || 50;
    let consecutiveEmpty = 0;
    const publishedVideoIds = new Set();
    
    while (!state.stopRequested && publishRound < maxRounds) {
      if (state.isPaused) {
        await waitForResume();
        if (state.stopRequested) break;
      }
      
      let drafts = findDraftRows().filter(d => !d.videoId || !publishedVideoIds.has(d.videoId));

      // If no drafts found on initial scan, check alternate Content tab (Shorts vs Videos)
      if (drafts.length === 0 && publishRound === 0) {
        const isShortsUrl = window.location.href.includes('/short');
        const altTab = isShortsUrl ? 'videos' : 'shorts';
        updateStatus(`No drafts found on current view. Checking ${altTab} tab...`, 'active');
        renderUI();
        try {
          await switchToContentTab(altTab);
          await sleep(1500);
          drafts = findDraftRows().filter(d => !d.videoId || !publishedVideoIds.has(d.videoId));
        } catch (e) {}
      }

      if (drafts.length === 0) {
        if (state.config.autoScroll) {
          updateStatus('Scrolling to load more drafts...', 'active');
          scrollStudioTable(800);
          await sleep(2000);
          const moreDrafts = findDraftRows().filter(d => !d.videoId || !publishedVideoIds.has(d.videoId));
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
      const draftKey = currentDraft.videoId || currentDraft.title;
      const maxRetries = Math.max(1, state.config.maxRetries || 2);
      let pubSuccess = false;
      let lastErr = null;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        if (state.stopRequested) break;
        try {
          await publishSingleDraft(currentDraft, idx, total);
          pubSuccess = true;
          break;
        } catch (err) {
          lastErr = err;
          if (err.message === 'CANCELLED_BY_USER') throw err;
          console.warn(`[XMON] Standalone publish attempt ${attempt}/${maxRetries} failed for "${currentDraft.title}":`, err);
          await closeStuckDialogs(true);
          if (attempt < maxRetries) await sleep(1500);
        }
      }

      if (pubSuccess) {
        if (currentDraft.videoId) publishedVideoIds.add(currentDraft.videoId);
        state.standalonePublished = (state.standalonePublished || 0) + 1;
        updateStatus(`Published (${state.standalonePublished}): ${currentDraft.title.substring(0, 30)}`, 'active');
        
        for (const qItem of state.queue) {
          if (qItem.status === STATUS.UPLOADED || qItem.status === STATUS.DRAFT) {
            const qName = normalizeVideoTitle(qItem.name);
            const draftTitle = normalizeVideoTitle(currentDraft.title);
            if (isTitleMatching(qName, draftTitle)) {
              qItem.status = STATUS.PUBLISHED;
              break;
            }
          }
        }
        renderUI();
      } else {
        console.error(`[XMON] Skipping failed draft "${currentDraft.title}" after ${maxRetries} attempts:`, lastErr);
        state.standaloneFailed = (state.standaloneFailed || 0) + 1;
        currentDraft.row.setAttribute('data-xmon-status', 'failed');
        currentDraft.row.style.outline = '2px solid #e74c3c';
        await closeStuckDialogs(true);
        renderUI();
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
    state.standalonePublished = 0;
    state.standaloneFailed = 0;

    // Reset published/failed sets so past run keys do not block drafts
    if (state.publishedDraftKeys) state.publishedDraftKeys.clear();
    if (state.failedDraftKeys) state.failedDraftKeys.clear();

    // Clear failed marks on any existing rows so user can retry them
    try {
      const existingRows = deepQueryAll('ytcp-video-row[data-xmon-status="failed"]');
      existingRows.forEach(r => {
        r.removeAttribute('data-xmon-status');
        r.style.outline = '';
      });
    } catch(e) {}

    updateStatus('Starting draft publishing...', 'active');
    renderUI();

    // Ensure on Content page if on another Studio route
    if (!window.location.href.includes('/videos')) {
      updateStatus('Navigating to YouTube Studio Content page...', 'active');
      renderUI();
      try {
        await navigateToContentSafe();
        await sleep(2000);
      } catch (e) {
        console.warn('[XMON] Navigation to Content page warning:', e);
      }
    }

    try {
      await publishAllDrafts();
    } finally {
      state.isRunning = false;
      const msg = `Draft publishing complete! Published: ${state.standalonePublished}, Failed: ${state.standaloneFailed}`;
      updateStatus(msg, 'idle');
      renderUI();
      showToast(msg, state.standaloneFailed > 0 ? 'warning' : 'success', 5000);
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
    const pubStatusText = document.getElementById('xmon-pub-status-text');
    const pubStatusDot = document.getElementById('xmon-pub-status-dot');
    
    if (statusText) {
      statusText.textContent = message;
      statusText.setAttribute('title', message);
    }
    if (pubStatusText) {
      pubStatusText.textContent = message;
      pubStatusText.setAttribute('title', message);
    }

    const applyDotClass = (dot) => {
      if (!dot) return;
      dot.className = 'xmon-status-indicator';
      if (type === 'active') dot.classList.add('active');
      else if (type === 'paused') dot.classList.add('paused');
      else if (type === 'error') dot.classList.add('error');
    };

    applyDotClass(statusDot);
    applyDotClass(pubStatusDot);
  }

  // ============================================================
  // UI CREATION & RENDERING
  // ============================================================
  function createWidget() {
    if (document.getElementById('xmon-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'xmon-widget';
    if (state.isMinimized) {
      widget.classList.add('xmon-minimized');
    }
    widget.innerHTML = buildWidgetHTML();
    document.body.appendChild(widget);

    if (state.isMinimized) {
      const tabs = widget.querySelector('.xmon-tabs');
      const panels = widget.querySelectorAll('.xmon-tab-panel');
      const footer = widget.querySelector('.xmon-footer');
      if (tabs) tabs.style.display = 'none';
      panels.forEach(p => p.style.display = 'none');
      if (footer) footer.style.display = 'none';
    }

    // Hidden file input for click-to-browse: remove duplicate if already present
    document.getElementById('xmon-file-input')?.remove();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'xmon-file-input';
    fileInput.className = 'xmon-file-input';
    fileInput.setAttribute('data-xmon-internal', 'true');
    fileInput.accept = 'video/*,.mp4,.mov,.webm,.mkv,.avi,.m4v';
    fileInput.multiple = true;
    document.body.appendChild(fileInput);

    attachEventListeners();
    restoreQueueState();
  }

  // ============================================================
  // RECOMPUTE COUNTERS FROM QUEUE STATE
  // ============================================================
  function recomputeCounters() {
    state.totalCount = state.queue.length;
    state.uploadedCount = state.queue.filter(v => v.status === STATUS.UPLOADED || v.status === STATUS.PUBLISHED).length;
    state.publishedCount = state.queue.filter(v => v.status === STATUS.PUBLISHED).length;
    state.failedCount = state.queue.filter(v => v.status === STATUS.FAILED).length;
    const batchCountFromTotal = state.batchSize > 0 ? Math.ceil(state.queue.length / state.batchSize) : 0;
    state.totalBatches = Math.max(state.currentBatch, batchCountFromTotal);
  }

  function buildWidgetHTML() {
    recomputeCounters();
    const queueCount = state.queue.length;
    const failedCount = state.failedCount;
    const completedCount = state.uploadedCount;
    const totalProgress = queueCount > 0 ? Math.round((completedCount / queueCount) * 100) : 0;
    // P3-1: Only call findDraftRows() when the Publish tab is active (or for badge on tab bar).
    // Cache the result for this render cycle so we don't double-scan.
    const draftsOnScreen = (state.activeTab === 'publish') ? findDraftRows().length : (state._cachedDraftCount || 0);

    // Animated in-widget alert banner HTML
    // P2-1: Use class instead of id for dismiss button — prevents duplicate IDs when banner
    // appears in both Upload and Queue panels simultaneously.
    const alertBannerHTML = state.activeAlert ? `
      <div class="xmon-alert-card ${state.activeAlert.type} xmon-active-alert-box">
        <div class="xmon-alert-header">
          <div class="xmon-alert-icon-wrap">
            ${state.activeAlert.type === 'daily_limit' ? ICONS.alertTriangle : ICONS.alertCircle}
            <div class="xmon-alert-beacon"></div>
          </div>
          <div class="xmon-alert-titles">
            <span class="xmon-alert-title">${escapeHtml(state.activeAlert.title)}</span>
            <span class="xmon-alert-msg">${escapeHtml(state.activeAlert.message)}</span>
          </div>
          <button class="xmon-alert-dismiss xmon-dismiss-alert-btn" title="Dismiss" type="button">
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
            ${state.isMinimized ? ICONS.plus : ICONS.minus}
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
            <span class="xmon-status-text" id="xmon-status-text" title="${escapeHtml(state.statusMessage)}">${escapeHtml(state.statusMessage)}</span>
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
              <div class="xmon-queue-item status-${escapeHtml(v.status)}" data-id="${escapeHtml(v.id)}">
                <span class="xmon-queue-num">${i + 1}</span>
                <span class="xmon-queue-name" title="${escapeHtml(v.name)}">${escapeHtml(v.name)}</span>
                <span class="xmon-queue-status ${escapeHtml(v.status)}">${escapeHtml(v.status)}</span>
                ${v.status === STATUS.FAILED ? `<button class="xmon-queue-retry-btn" data-retry-id="${escapeHtml(v.id)}" type="button">Retry</button>` : ''}
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
          
          <div class="xmon-summary-card" style="position: relative;">
            <div class="xmon-summary-big" id="xmon-drafts-count">${draftsOnScreen}</div>
            <div class="xmon-summary-label">Drafts on Screen</div>
            <button class="xmon-btn xmon-btn-secondary" id="xmon-scan-drafts-btn" type="button" title="Scan YouTube Studio for Drafts" style="position: absolute; right: 12px; top: 12px; padding: 4px 10px; font-size: 11px; height: auto;">
              <span class="xmon-btn-icon">${ICONS.refresh}</span>
              <span>Scan</span>
            </button>
          </div>

          <div class="xmon-stats" style="grid-template-columns: repeat(2, 1fr);">
            <div class="xmon-stat">
              <span class="xmon-stat-val success">${state.standalonePublished || 0}</span>
              <span class="xmon-stat-lbl">Published</span>
            </div>
            <div class="xmon-stat">
              <span class="xmon-stat-val danger">${state.standaloneFailed || 0}</span>
              <span class="xmon-stat-lbl">Skipped</span>
            </div>
          </div>

          <div class="xmon-status-bar">
            <div class="xmon-status-indicator ${state.statusType === 'active' ? 'active' : ''}" id="xmon-pub-status-dot"></div>
            <span class="xmon-status-text" id="xmon-pub-status-text" title="${escapeHtml(state.statusMessage)}">${escapeHtml(state.statusMessage)}</span>
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

          <div class="xmon-divider"></div>

          <!-- P5 Diagnostics -->
          <div class="xmon-section-title" style="margin-top:4px;">Diagnostics</div>
          <div class="xmon-actions">
            <button class="xmon-btn xmon-btn-secondary" id="xmon-copy-log-btn" type="button" style="font-size:11px;">
              <span class="xmon-btn-icon">${ICONS.list}</span>
              <span>Copy Debug Log</span>
            </button>
            <button class="xmon-btn xmon-btn-secondary" id="xmon-health-check-btn" type="button" style="font-size:11px;">
              <span class="xmon-btn-icon">${ICONS.refresh}</span>
              <span>Selector Health</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="xmon-footer">
        <span class="xmon-footer-text">XMON Systems</span>
        <span class="xmon-footer-version">v${EXT_VERSION}</span>
      </div>
    `;
  }

  // ============================================================
  // RENDER UI — P3-2: throttled, targeted DOM updates
  // Full rebuild only on tab switch / minimize change.
  // Incremental update (~4/s) for stats, progress, status only.
  // ============================================================
  let _renderScheduled = false;
  let _lastFullRenderTab = null;
  let _lastMinimizedState = null;

  function renderUI() {
    const widget = document.getElementById('xmon-widget');
    if (!widget) return;

    const tabChanged = state.activeTab !== _lastFullRenderTab;
    const minimizedChanged = state.isMinimized !== _lastMinimizedState;

    // Full rebuild required on tab/minimize change
    if (tabChanged || minimizedChanged) {
      _lastFullRenderTab = state.activeTab;
      _lastMinimizedState = state.isMinimized;
      _renderScheduled = false;

      if (state.isMinimized) {
        widget.classList.add('xmon-minimized');
      } else {
        widget.classList.remove('xmon-minimized');
      }

      widget.innerHTML = buildWidgetHTML();
      attachEventListeners();

      if (state.isMinimized) {
        const tabs = widget.querySelector('.xmon-tabs');
        const panels = widget.querySelectorAll('.xmon-tab-panel');
        const footer = widget.querySelector('.xmon-footer');
        if (tabs) tabs.style.display = 'none';
        panels.forEach(p => p.style.display = 'none');
        if (footer) footer.style.display = 'none';
      }
      return;
    }

    // Throttle incremental updates to ~4/s (250ms)
    if (_renderScheduled) return;
    _renderScheduled = true;
    setTimeout(() => {
      _renderScheduled = false;
      _renderIncremental(widget);
    }, 250);
  }

  // Targeted DOM updates without full innerHTML rebuild
  function _renderIncremental(widget) {
    if (!widget) return;
    recomputeCounters();

    // --- Status text / dot ---
    const st = widget.querySelector('#xmon-status-text, #xmon-pub-status-text');
    if (st) {
      st.textContent = state.statusMessage;
      st.setAttribute('title', state.statusMessage);
    }
    widget.querySelectorAll('#xmon-status-dot, #xmon-pub-status-dot').forEach(dot => {
      dot.className = 'xmon-status-indicator';
      if (state.statusType === 'active') dot.classList.add('active');
      else if (state.statusType === 'paused') dot.classList.add('paused');
      else if (state.statusType === 'error') dot.classList.add('error');
    });

    // --- Stats ---
    const queueCount = state.queue.length;
    const totalProgress = queueCount > 0 ? Math.round((state.uploadedCount / queueCount) * 100) : 0;
    const statVals = widget.querySelectorAll('.xmon-stat-val');
    if (statVals.length >= 4) {
      statVals[0].textContent = queueCount;
      statVals[1].textContent = state.uploadedCount;
      statVals[2].textContent = state.publishedCount;
      statVals[3].textContent = state.failedCount;
    }

    // --- Progress bar ---
    const fill = widget.querySelector('.xmon-progress-bar-fill');
    if (fill) fill.style.width = totalProgress + '%';

    // --- Batch info ---
    const batchVal = widget.querySelector('.xmon-batch-value');
    if (batchVal) batchVal.textContent = `${state.currentBatch} / ${state.totalBatches}`;

    // --- Queue list rows (status badges only) ---
    widget.querySelectorAll('.xmon-queue-item[data-id]').forEach(row => {
      const vid = state.queue.find(v => v.id === row.dataset.id);
      if (!vid) return;
      row.className = `xmon-queue-item status-${vid.status}`;
      const badge = row.querySelector('.xmon-queue-status');
      if (badge) { badge.textContent = vid.status; badge.className = `xmon-queue-status ${vid.status}`; }
    });

    // --- Draft count on Publish tab (P3-1: only when tab active) ---
    const draftsEl = widget.querySelector('#xmon-drafts-count');
    if (draftsEl && state.activeTab === 'publish') {
      const cnt = findDraftRows().length;
      state._cachedDraftCount = cnt;
      draftsEl.textContent = cnt;
    }

    // --- Tab badge on Publish tab ---
    const publishTabBadge = widget.querySelector('.xmon-tab[data-tab="publish"] .xmon-tab-badge');
    if (publishTabBadge) publishTabBadge.textContent = state._cachedDraftCount || 0;
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

    // Minimize / Maximize toggle with state persistence
    const minBtn = document.getElementById('xmon-minimize-btn');
    if (minBtn) {
      minBtn.onclick = () => {
        setMinimized(!state.isMinimized);
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

    // Alert dismissal — P2-1: use querySelectorAll (class) to handle multiple panels
    document.querySelectorAll('#xmon-widget .xmon-dismiss-alert-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        state.activeAlert = null;
        state.limitReached = false;
        saveQueueState();
        renderUI();
      };
    });

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
        recomputeCounters();
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
        state.currentBatch = 0;
        recomputeCounters();
        updateStatus('Queue cleared. Ready.', 'idle');
        showToast('Queue cleared', 'info');
        renderUI();
        saveQueueState();
      };
    }

    // Standalone draft publisher
    const pubDraftsBtn = document.getElementById('xmon-publish-drafts-btn');
    if (pubDraftsBtn) pubDraftsBtn.onclick = () => runStandaloneDraftPublisher();

    // Scan drafts button on Publish tab
    const scanDraftsBtn = document.getElementById('xmon-scan-drafts-btn');
    if (scanDraftsBtn) {
      scanDraftsBtn.onclick = async () => {
        scanDraftsBtn.disabled = true;
        updateStatus('Scanning YouTube Studio for drafts...', 'active');
        renderUI();
        if (!window.location.href.includes('/videos')) {
          try {
            await navigateToContentSafe();
            await sleep(1500);
          } catch(e) {}
        }
        let cnt = findDraftRows().length;
        if (cnt === 0) {
          const isShorts = window.location.href.includes('/short');
          try {
            await switchToContentTab(isShorts ? 'videos' : 'shorts');
            await sleep(1500);
            cnt = findDraftRows().length;
          } catch(e) {}
        }
        state._cachedDraftCount = cnt;
        updateStatus(`Found ${cnt} draft(s) on screen.`, 'idle');
        renderUI();
      };
    }

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
          recomputeCounters();
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

    // P5: Copy Debug Log
    const copyLogBtn = document.getElementById('xmon-copy-log-btn');
    if (copyLogBtn) {
      copyLogBtn.onclick = () => {
        const log = getDebugLog();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(log).then(() => showToast('Debug log copied to clipboard!', 'success', 3000));
        } else {
          const ta = document.createElement('textarea');
          ta.value = log;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('Debug log copied!', 'success', 3000);
        }
      };
    }

    // P5: Selector Health Check
    const healthBtn = document.getElementById('xmon-health-check-btn');
    if (healthBtn) {
      healthBtn.onclick = () => {
        const results = runSelectorHealthCheck();
        const pass = results.filter(r => r.found).length;
        const fail = results.filter(r => !r.found).length;
        const summary = results.map(r =>
          `${r.found ? (r.visible ? '✓' : '~') : '✗'} ${r.name}`
        ).join('\n');
        showToast(`Health: ${pass} found, ${fail} missing. Check console for details.`, fail > 0 ? 'warning' : 'success', 6000);
        console.log('[XMON] Selector Health Check:\n' + summary);
      };
    }
  }

  // ============================================================
  // FILE DROP HANDLER
  // ============================================================
  function handleFileDrop(fileList) {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    
    // Filter video files by MIME type or known video extension
    const isVideo = (f) => (f.type && f.type.startsWith('video/')) || /\.(mp4|mov|webm|mkv|avi|m4v|flv|wmv)$/i.test(f.name || '');
    const videoFiles = [];
    const skippedFiles = [];

    for (const f of files) {
      if (isVideo(f)) {
        videoFiles.push(f);
      } else {
        skippedFiles.push(f);
      }
    }

    if (skippedFiles.length > 0) {
      const skippedNames = skippedFiles.map(f => f.name).slice(0, 3).join(', ') + (skippedFiles.length > 3 ? '...' : '');
      showToast(`${skippedFiles.length} non-video file(s) skipped (${skippedNames}).`, 'warning', 4000);
    }
    
    if (videoFiles.length === 0) {
      showToast('No video files detected. Please drop video files (e.g. .mp4, .mov, .mkv, .webm).', 'error');
      return;
    }

    // P2-6: Count only UNFINISHED items toward max-100 (published/failed don't block new adds)
    const unfinishedCount = state.queue.filter(v =>
      v.status !== STATUS.PUBLISHED && v.status !== STATUS.FAILED
    ).length;
    const maxAllowed = 100 - unfinishedCount;

    if (maxAllowed <= 0) {
      showToast('Queue is full (100 unfinished videos max). Clear or publish completed videos first.', 'warning');
      return;
    }

    const filesToAdd = videoFiles.slice(0, maxAllowed);

    if (videoFiles.length > maxAllowed) {
      showToast(`Only ${maxAllowed} more videos can be added. ${videoFiles.length - maxAllowed} skipped.`, 'warning');
    }

    // Check for duplicates by filename
    let duplicateCount = 0;
    let reattachedCount = 0;
    const newVideos = [];
    
    for (const file of filesToAdd) {
      // Re-attach file object to existing restored queue items if matching name and size
      const existingNeedsFile = state.queue.find(v => v.name === file.name && v.size === file.size && !v.file);
      if (existingNeedsFile) {
        existingNeedsFile.file = file;
        if (existingNeedsFile.status === STATUS.NEEDS_FILE) {
          existingNeedsFile.status = STATUS.WAITING;
          existingNeedsFile.error = null;
        }
        reattachedCount++;
        continue;
      }

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

    if (reattachedCount > 0) {
      showToast(`Re-attached ${reattachedCount} file(s) to resume queue.`, 'info');
      saveQueueState();
    }

    if (newVideos.length > 0) {
      state.queue.push(...newVideos);
      recomputeCounters();
      
      showToast(`${newVideos.length} video(s) added to queue.`, 'success');
      updateStatus(`${state.queue.length} video(s) in queue. Ready to start.`, 'idle');
      saveQueueState();
    }

    renderUI();
  }

  // ============================================================
  // PERIODIC UI UPDATES
  // P3-3: Raise interval to 4s; gate detectYouTubeUploadError to
  // only run when upload dialog is present or queue is running.
  // P3-1: Draft count update only when Publish tab is active.
  // ============================================================
  let _periodicUpdateIntervalId = null;

  function startPeriodicUpdates() {
    if (_periodicUpdateIntervalId !== null) {
      clearInterval(_periodicUpdateIntervalId);
      _periodicUpdateIntervalId = null;
    }
    _periodicUpdateIntervalId = setInterval(() => {
      // P3-1: Update draft count only when publish tab is visible
      if (state.activeTab === 'publish') {
        const draftsCountEl = document.getElementById('xmon-drafts-count');
        if (draftsCountEl) {
          const cnt = findDraftRows().length;
          state._cachedDraftCount = cnt;
          draftsCountEl.textContent = cnt;
        }
      }

      // P3-3: Only run error detector when an upload dialog exists or queue is actively running
      if (!state.activeAlert) {
        const hasUploadDialog = !!deepQuery('ytcp-uploads-dialog, ytcp-multi-file-upload-dialog');
        if (hasUploadDialog || state.isRunning) {
          const detected = detectYouTubeUploadError();
          if (detected && detected.type === 'daily_limit') {
            state.activeAlert = { ...detected, at: Date.now() };
            state.limitReached = true;
            updateStatus('Daily upload limit reached. You can upload more videos in 24 hours.', 'error');
            showAnimatedNotification({
              type: 'daily_limit',
              title: detected.title,
              message: detected.message,
              persistent: true
            });
            renderUI();
            saveQueueState();
          }
        }
      }
    }, 4000);
  }

  // ============================================================
  // INITIALIZE
  // ============================================================
  let _spaCheckIntervalId = null;

  function init() {
    // Only activate on YouTube Studio
    if (!window.location.hostname.includes('studio.youtube.com')) return;
    
    createWidget();
    startPeriodicUpdates();
    console.log('[XMON] Widget loaded successfully.');
  }

  // Check periodically to attach widget (handles SPA navigation)
  // Use a single interval, cleared and re-set if needed
  if (_spaCheckIntervalId !== null) {
    clearInterval(_spaCheckIntervalId);
  }
  _spaCheckIntervalId = setInterval(() => {
    if (window.location.hostname === 'studio.youtube.com') {
      if (!document.getElementById('xmon-widget')) {
        init();
      }
    }
  }, 1500);

  // Expose internals on window.__XMON_DEV__ for verification & automated testing
  Object.assign(window.__XMON_DEV__, {
    deepQuery,
    deepQueryAll,
    isDialogOpen,
    isElementVisible,
    normalizeVideoTitle,
    isTitleMatching,
    findDraftRows,
    verifyAndSyncBatchDrafts,
    waitForBatchUploadComplete,
    publishBatchDrafts,
    publishSingleDraft,
    publishAllDrafts,
    processQueue,
    saveQueueState,
    restoreQueueState,
    detectYouTubeUploadError,
    recomputeCounters,
    escapeHtml,
    buildWidgetHTML,
    handleFileDrop,
    STATUS,
    state,
    // P5 diagnostics
    xmonLog,
    getDebugLog,
    runSelectorHealthCheck,
    __setState: (newState) => Object.assign(state, newState),
    __getState: () => state
  });

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
