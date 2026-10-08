/* ============================================================
   XMON YouTube Shorts Publisher - Upgraded Popup Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Logo fallback handling (CSP-safe, no inline handlers)
  const logoImg = document.getElementById('popup-logo-img');
  const logoSvg = document.getElementById('popup-logo-svg');
  if (logoImg && logoSvg) {
    logoImg.addEventListener('error', () => {
      logoImg.style.display = 'none';
      logoSvg.style.display = 'block';
    });
  }

  // 2. Load live queue statistics from storage
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['xmonQueueState', 'queueState'], (res) => {
        const state = res.xmonQueueState || res.queueState;
        if (!state) return;

        // Update stats if elements exist
        const qsVals = document.querySelectorAll('.qs-val');
        if (qsVals.length >= 3) {
          const totalCount = state.totalCount || (state.queueMeta ? state.queueMeta.length : 0);
          const publishedCount = state.publishedCount || 0;
          
          if (totalCount > 0) {
            qsVals[0].textContent = totalCount;
            qsVals[0].title = 'Total Videos Queued';
          }
          if (publishedCount > 0) {
            qsVals[2].textContent = publishedCount;
            qsVals[2].title = 'Videos Published';
          }
        }

        // Update status strip
        const statusText = document.querySelector('.status-strip-text');
        const statusDot = document.querySelector('.status-dot');
        if (state.activeAlert && state.activeAlert.type === 'daily_limit') {
          if (statusText) {
            statusText.innerHTML = `<strong style="color:#ff5263;">Daily Limit:</strong> You can upload in 24h`;
          }
          if (statusDot) {
            statusDot.style.background = '#ff4e50';
            statusDot.style.boxShadow = '0 0 10px rgba(255, 78, 80, 0.8)';
          }
        } else if (statusText && state.statusMessage) {
          statusText.innerHTML = `<strong>Status:</strong> ${escapeHtml(state.statusMessage)}`;
        }
      });
    }
  } catch (e) {
    console.debug('[XMON Popup] Storage read notice:', e);
  }

  // 3. Smart "Open YouTube Studio" (activates existing tab or creates new)
  const openBtn = document.getElementById('open-studio-btn');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ url: '*://studio.youtube.com/*' }, (tabs) => {
          if (tabs && tabs.length > 0) {
            // Focus existing YouTube Studio tab
            const tab = tabs[0];
            chrome.tabs.update(tab.id, { active: true }, () => {
              if (chrome.windows && tab.windowId) {
                chrome.windows.update(tab.windowId, { focused: true });
              }
              window.close();
            });
          } else {
            // Open new tab
            chrome.tabs.create({ url: 'https://studio.youtube.com' });
            window.close();
          }
        });
      } else {
        window.open('https://studio.youtube.com', '_blank');
      }
    });
  }
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
