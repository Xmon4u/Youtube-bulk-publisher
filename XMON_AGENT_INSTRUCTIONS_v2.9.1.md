# XMON YouTube Shorts Bulk Publisher — Agent Instructions (verified against v2.9.0 source)

Project: Manifest V3 Chrome extension. Files: `content.js` (all logic + UI), `background.js`, `popup.html/js`, `styles.css`, `manifest.json`, `automated_test.html`, `test_preview.html`, `README.md`.
Target release: **v2.9.1** (bug-fix only, no new features except where stated).

This list was produced by reading the actual v2.9.0 source line by line. It was NOT run on live YouTube Studio. Items tagged **[VERIFY]** depend on the real Studio DOM: test them in the browser, or ask the owner, before changing behavior.

## 0. Rules

1. Work phase by phase (P1 → P5). After each phase: run the tests, summarize changes, wait for confirmation if anything is **[VERIFY]**.
2. Minimal, targeted edits. Never rewrite whole files. Keep all existing features (batching, pause/resume/stop, daily-limit handling, minimize persistence, standalone Publish tab).
3. **Core safety rule:** never publish or change visibility of a video unless it is a draft positively matched to a queue item (or explicitly confirmed by the user in the standalone Publish tab). If unsure → mark FAILED/needs-check and skip. Wrongly publishing is worse than skipping.
4. Never mark a video PUBLISHED unless the result was verified (see P1-4).
5. No remote scripts, no new network calls. Update version in `manifest.json`, `popup.html`, the `EXT_VERSION` fallback in `content.js`, and add a README changelog entry.

## Already fixed in v2.9.0 — do NOT redo or regress

- `findDraftRows()` is strict (visibility text or real "Edit draft" button) and has no hover side effects. It skips rows with `data-xmon-status` of `published`/`failed`.
- `verifyAndSyncBatchDrafts` has no positional "Pass 2"; unmatched videos become FAILED.
- Queue UI strings are escaped with `escapeHtml`.
- Internal file input is marked `data-xmon-internal`; file injection uses Method A then Method B only as fallback; batch capped at 15.
- `BATCH_LIMIT_EXCEEDED` has a retry cap (2); `config.maxRetries` is used in publish loops.
- Periodic detector no longer sets `isRunning=false`.
- `restoreQueueState` restores `queueMeta` as `needs-file`, plus `activeAlert`, `statusMessage`, `batchSize`.

---

## P1 — Critical (wrong results, lost work, wrong videos affected)

### P1-1. Upload completion is detected too early (closes dialog while files still upload)
**Where:** `waitForBatchUploadComplete`, step 6.
**Problem:** `isDraftSavedInText` checks the **whole dialog's** `textContent` for `'upload complete'`, `'saved as draft'`, `'checks complete'`. In a multi-file dialog, the first finished item makes that text true for the entire dialog. `isUploadCloseBtnEnabled()` is almost always non-null because the top-right X (`#close-button`) is always enabled. Progress bars are filtered by `aria-valuenow` in (0,100), and elements such as `ytcp-video-upload-progress` often have no value, so `activeProgressBars` is usually empty. Result: after two polls (~3 s) the loop returns true, the dialog is closed, and remaining uploads are cut off or left unconfirmed.
**Fix:**
- Decide completion only from **per-item** state: count items (`ytcp-uploads-file-item`, de-duplicated) whose own text indicates done, and require `doneItems >= expectedCount`. Do not use dialog-wide text for the "done" decision.
- Do not treat the X button's enabled state as a completion signal.
- Keep the draft-based exit (all videos matched to distinct drafts) as the primary success path.
- Keep deadline extension while any item still shows progress; also treat "item count increased / text changed" as progress.
**Done when:** with 15 files where only 1 is finished, the loop does not return; with all 15 item states done, it returns.

### P1-2. Per-item tracking never matches (uses strict title match against whole item text)
**Where:** `waitForBatchUploadComplete`, step 3: `isTitleMatching(video.name, itemText)`.
**Problem:** `itemText` is the full item text (filename + status words + percentages). `isTitleMatching` now requires exact equality (or a delimited suffix), so this never matches. Dialog-based tracking is therefore dead; only draft-row detection works.
**Fix:** extract the file name from the item (try a dedicated title/name element first **[VERIFY selector]**), normalize it, then compare with `isTitleMatching`. Fallback: word-boundary containment `\bnormalizedName\b` against `normalizeVideoTitle(itemText)`, used for **progress tracking only**, never for publish decisions.

### P1-3. Verification window is too short and gives up too early
**Where:** `processQueue` step 5 → `verifyAndSyncBatchDrafts(currentBatchVideos, 25000)`.
**Problem:** only 25 s after closing the dialog; if YouTube is still saving drafts (slow upload, timeout from P1-1, large files), videos are marked FAILED although the drafts appear later. Retrying then uploads **duplicates**.
**Fix:**
- Raise the window (e.g. `max(60s, 8s * batchCount)`, capped at ~3 min), and re-scan on each poll.
- Add a lightweight **Re-sync** action: for FAILED items whose error is `Draft not found...`, re-scan drafts and rematch by title; if found, set UPLOADED with `draftId` (no re-upload).
- When unmatched videos remain, search **both** Content tabs (Shorts and Videos) on every poll, not only when `drafts.length === 0`. Today, if the current tab contains any old draft, the other tab is never checked.
- Before each batch upload, snapshot the existing draft keys (`videoId`/title). Prefer drafts not in the snapshot when matching (prevents claiming an old same-titled draft).

### P1-4. Publish success is not verified (Escape fallback can cancel the publish)
**Where:** `publishSingleDraft`, step 7 and the end of the function.
**Problem:** after clicking Done, if the editor dialog is still open after 3 s the code sends **Escape**. Escape may close the editor **without saving** (or show a discard prompt). The function then unconditionally sets `data-xmon-status="published"`, and the caller marks the video PUBLISHED and shows a success toast.
**Fix:**
- Do not send Escape while the save may still be in progress. Wait longer (≥ 15–20 s) for the dialog to close, and handle the "Video is still processing / Checks / Publish anyway / Discard changes" prompts explicitly **[VERIFY wording]**.
- After closing, **verify**: re-find the row by `videoId` and confirm it no longer shows Draft (visibility cell text changed, or the edit-draft button is gone). Only then mark published. If not confirmed → throw so the retry/FAILED logic runs.

### P1-5. A restored/old daily-limit alert blocks "Start Queue" forever
**Where:** `processQueue` loop head + `saveQueueState`/`restoreQueueState`.
**Problem:** `activeAlert` (type `daily_limit`) is persisted and restored. The main loop does `if (state.limitReached || activeAlert.type === 'daily_limit') break;` at the first iteration, so the next day Start immediately does nothing (and then reports "Complete!") until the user manually dismisses the alert. The Dismiss button also does not call `saveQueueState()`.
**Fix:** store `alert.at = Date.now()`; on restore, drop `daily_limit` alerts older than 24 h (and show remaining time while it is active); at `processQueue` start, clear a stale alert and `limitReached`; dismissing must persist. Show "Daily limit active until HH:MM" instead of a false "Complete!" if the loop ends due to the limit.

### P1-6. Daily limit hit mid-batch strands drafts and causes duplicates
**Where:** `processQueue` catch block for `DAILY_UPLOAD_LIMIT_REACHED`.
**Problem:** only videos still `UPLOADING` become FAILED. Videos that already reached UPLOADED (draft saved) are never published, because the publish step is skipped and the queue only processes `WAITING` items. Videos wrongly marked FAILED (they were merely not uploaded) re-upload later and may duplicate existing drafts.
**Fix:** on daily limit: (a) run draft verification for the batch, (b) publish the verified ones if auto-publish is on, (c) set not-yet-uploaded videos back to **WAITING** (not FAILED) with a note, (d) pause the queue. Also let `processQueue` handle items that are `UPLOADED` with a `draftId` (publish-only pass) so restored/stranded drafts get published without re-upload.

### P1-7. Title matching edge cases
**Where:** `isTitleMatching`, `verifyAndSyncBatchDrafts`, `waitForBatchUploadComplete` (draft matching), `handleFileDrop`.
**Problems:**
- The delimited-suffix rule makes `clip` match a draft `clip 2` and vice-versa. Matching is order-dependent, so with files `clip.mp4` and `clip_2.mp4` one video can claim the other's draft and then fail.
- YouTube truncates titles to 100 chars and strips `<` `>`; long or such names never match exactly.
- Two files with the same normalized name (`a.mp4`, `a.mov`) are indistinguishable.
**Fix:**
- Matching in **two passes** per batch: first claim all **exact** normalized matches, then allow suffix matches only for leftovers.
- Compare after applying YouTube's rules to the file name (remove `<`/`>`, truncate to 100 chars) as an additional candidate.
- In `handleFileDrop`, detect same-normalized-name collisions, skip the later file, and warn the user.

### P1-8. "Publish All Drafts" acts on every draft with no confirmation; "Not made for kids" is forced
**Where:** `runStandaloneDraftPublisher`, `publishAllDrafts`, `publishSingleDraft` step 3.
**Problems:** one click publishes **all** drafts on screen (including unrelated or unfinished ones) with the configured visibility (default Public). `maxToPublish=50` silently caps the run. The audience setting is always forced to "Not made for kids" when the toggle is on (default on), which can be wrong for some channels.
**Fix:** show a confirmation with count and visibility before starting; show a clear message when the 50 cap is reached; keep the toggle but change its default to a visible, explained setting (label it "Set audience to 'Not made for kids' for every video").

### P1-9. Stale DOM references and DOM-attribute state
**Where:** `publishBatchDrafts`, `publishSingleDraft`, `findDraftRows`.
**Problems:** the same `draftItem` (old `row`/`editBtn` elements) is reused across retry attempts after dialogs opened/closed and the table may have re-rendered. `data-xmon-status` is stored **on row elements**; Studio's list may recycle elements for other videos **[VERIFY]**, so a recycled row could carry `published/failed` for a different video and be skipped forever (or keep a blue/green outline).
**Fix:** re-find the draft by `videoId`/title at the start of **each** attempt; track published/failed drafts in a `Set` of draft keys held in JS state (and clear outlines), using attributes only as visual hints.

---

## P2 — Functional bugs

### P2-1. Duplicate element IDs break alert dismiss
`alertBannerHTML` (with `id="xmon-active-alert-box"` and `id="xmon-dismiss-alert-btn"`) is inserted in both the Upload and Queue panels. `getElementById` returns only the first, so Dismiss in the Queue tab does nothing. Use classes, and attach handlers with `querySelectorAll`.

### P2-2. Notification spam
In `waitForBatchUploadComplete`, non-daily errors call `showAnimatedNotification` on every 1.5 s poll, re-creating the toast each time. Track shown `type+message` and show once per batch (or at most every N seconds).

### P2-3. False-positive error detection
`detectYouTubeUploadError` includes the entire upload-dialog text when certain phrases are found, and tests substrings like `'already uploaded'`, `'upload failed'`, `'server error'`, and per-item `itemText.includes('error')` marks a file FAILED. File names containing such words trigger false errors. Restrict to dedicated error elements or exact phrases, and mark an item failed only from its own status element, not from its filename text.

### P2-4. Fragile SPA navigation
`navigateToContentSafe` falls back to `history.pushState('/channel/<id>/videos/upload')` + a synthetic `popstate` **[VERIFY]**. That path is the upload route and may reopen the upload dialog or do nothing. Prefer clicking the sidebar "Content" item; if it is not found, report a clear error instead of pushing URLs.

### P2-5. Selector parsing and over-broad "Close" clicks
- `deepQuery/deepQueryAll` split on the first space even inside attribute selectors (`[aria-label="Close" i]`, `[aria-label="Upload videos"]`). Native `querySelector` rescues light-DOM cases, but shadow-DOM traversal silently fails. Write a small tokenizer that splits only on top-level spaces/commas (outside `[]`/`()`/quotes).
- `closeStuckDialogs(true)` and `publishSingleDraft` step 7 click the **first visible `[aria-label="Close"]` anywhere on the page**. Scope to the specific dialog (`ytcp-video-share-dialog`, upload dialog, editor) so unrelated panels/toasts are not closed.
- `closeUploadDialog`'s first query includes the generic `ytcp-dialog`, which may select an unrelated dialog; scope it to the upload dialog.

### P2-6. Queue limits and states
- Max-100 check counts published/failed items already in the queue, so after 100 videos the user must press Clear. Count only unfinished items, or add "Clear completed".
- If all items are `needs-file`, Start shows "No videos to process" with no hint. Show "Re-add N files to resume".
- `STATUS.DRAFT` is defined but never used.

### P2-7. `publishSingleDraft` dialog detection
Step 2 accepts any open `ytcp-dialog`/`ytcp-uploads-dialog` as "the editor". A leftover upload dialog or other dialog can satisfy it. Require evidence of the editor (title field, stepper, or `#done-button`) before continuing.

### P2-8. Stop leaves the upload dialog in an unknown state
After Stop, in-flight uploads continue and the dialog stays open; the next Start may reuse it ("Reusing dialog"). On stop, close the dialog safely or clear the state on next start (already attempted for stuck dialogs; make it deterministic).

---

## P3 — Performance and UI stability

### P3-1. `buildWidgetHTML()` calls `findDraftRows()` on every render
`renderUI()` runs many times per second during a batch (each status change), and each call scans the whole DOM + shadow roots, running per-row `deepQuery`. Compute the draft count only when the Publish tab is active or on the periodic timer, and cache it.

### P3-2. `renderUI()` replaces the whole widget `innerHTML`
Scroll position of the queue list, open `<select>`, focus, and the logo image are reset each time. Do targeted updates (stats, progress bar, queue list rows, status text) and rebuild fully only for tab change/minimize. Throttle rendering (~4/s).

### P3-3. Polling cost
`waitFor` polls every 100 ms with full-DOM `deepQuery`. Raise default to ~250 ms, limit shadow traversal to custom elements (`localName.includes('-')`), and cache results within one tick. Run `detectYouTubeUploadError` periodically only when an upload dialog exists or the queue is running.

### P3-4. Scrolling and pagination **[VERIFY]**
`window.scrollBy` probably does not scroll Studio's content table (it scrolls in an inner container), and Content is paginated, so drafts beyond the first page are invisible. Scroll the nearest scrollable ancestor of `ytcp-video-row`, and warn when expected drafts are not on page 1 (or handle the pager).

### P3-5. `isElementVisible`
Treating `opacity:0` and `pointer-events:none` as invisible misreports elements during animations and for disabled buttons. Use rect size + `display`/`visibility`; check disabled via `isButtonEnabled`.

---

## P4 — Other files

### manifest.json
- Icons `icon16/48/128.png`, `xmon_logo.png`, `xmon_emblem.png` are referenced from the extension root, but README shows an `icons/` folder and no image files appear in the project listing. **A missing icon prevents loading.** Make paths and folder consistent and confirm the files exist **[VERIFY]**. Remove `xmon_emblem.png` if unused.
- `activeTab` and `https://www.youtube.com/*` are not used. Remove them (and `tabs` if `chrome.tabs.query` by URL works with the Studio host permission **[VERIFY]**).

### background.js
Dead code: nothing sends `UPDATE_QUEUE_STATE`, nothing listens for `STATE_UPDATE`, and it uses a different storage key (`queueState`) than `content.js` (`xmonQueueState`); MV3 workers also lose in-memory state. Remove the queue logic (keep `OPEN_STUDIO` or delete the worker and manifest entry). Also drop the `queueState` fallback read in `popup.js`.

### popup.html / popup.js
- The "Max Videos" and "Publish" tiles get overwritten with live counts while the labels stay ("Max Videos: 12"). Use separate live elements with correct labels (Queued / Published), and keep the static facts static.
- "Active on YouTube Studio" is always shown. Query for a Studio tab and show Active/Inactive.
- A stale persisted daily-limit alert is shown as current; apply the 24 h expiry from P1-5.
- Remove the remote Google Fonts link; use the system stack.

### styles.css
- `animation: xmon-toast-timeout` is used but **`@keyframes xmon-toast-timeout` does not exist**, so the toast progress bar never animates. Add it (`from{width:100%} to{width:0}`).
- `.xmon-alert-beacon` is styled only under `#xmon-widget`, but toasts live in `#xmon-toast-hub` outside the widget, so the toast beacon is unstyled. Add scoped styles for toasts.
- Toast types `success/warning/info` have no styles; the icon is always red. Add per-type colors.
- `.xmon-tab-panel` and `.xmon-body` both set `overflow-y:auto` → possible double scrollbars; keep one.
- `.xmon-status-text` truncates long errors; allow 2-line wrap or rely on a visible `title`.
- Remove `@import` of Google Fonts (extra external request on every Studio page).

### Tests
- `automated_test.html` Suites 2–5 are **simulations** with a local `localNormalize` (only `a-z0-9`), not the real code; only Suite 6 uses `__XMON_DEV__`. Move meaningful checks to real functions. Add tests for: P1-1 (partial completion does not return), P1-2 (item name extraction), P1-7 (two-pass matching: `clip` vs `clip 2`; 100-char truncation; same-name collision), P1-3 (re-sync recovers a FAILED item), P1-5 (stale alert expiry), P2-1 (unique IDs), P3 (no `findDraftRows` call in render when Publish tab is inactive).
- Delete `test_output.html` (empty, appears duplicated) and `test_out.txt` (stale snapshot) or add them to `.gitignore`.
- `test_preview.html`: duplicate `id="xmon-widget"` (use classes), a "Resume Tomorrow" button that does not exist in the real UI, version v2.0.0.

### README
- Folder structure (`icons/`) does not match the manifest; `.gitignore` is named `_gitignore` in the project.
- State exactly what persistence does (needs-file + re-drop to re-attach), the real timeout behavior, and drop "Smart retry" wording unless P1-3/P1-6 are done.
- Changelog v2.2.0 says "timeout → mark UPLOADED"; later versions say never. Add a note that this was superseded.

### Minor cleanup
- `EXT_VERSION` fallback `'2.7.0'`; unused `navigateToContent()` alias, non-force branch of `closeStuckDialogs`, `state.currentVideoName`; `_spaCheckIntervalId` null check is meaningless; `substr` is deprecated; `localStorage` writes on YouTube's origin are unnecessary next to `chrome.storage`.
- Two Studio tabs share one storage key and overwrite each other; note it or guard with a tab-owned lock.

---

## P5 — Diagnostics (recommended, small)

Because real failures depend on the live Studio DOM:
1. Add a ring-buffer log (last ~300 `[XMON]` events with timestamps and video names) and a "Copy debug log" button in the Config tab.
2. Add a **selector health check** (button in Config): reports which key elements are found right now (upload button, file input, dialog, draft rows, edit-draft button, visibility radios, Done button). This makes Studio UI changes visible immediately instead of failing mid-queue.

---

## Final checklist (report each item with evidence)

- [ ] Dialog is never closed while any expected file item is unfinished (P1-1).
- [ ] No video becomes UPLOADED/PUBLISHED without a matched draft; PUBLISHED requires post-publish verification (P1-3, P1-4).
- [ ] FAILED "draft not found" items can be recovered without re-upload (P1-3).
- [ ] Daily limit expires after 24 h, mid-batch limit keeps/publishes existing drafts and requeues the rest (P1-5, P1-6).
- [ ] Matching is two-pass and collision-safe (P1-7).
- [ ] Standalone publish asks for confirmation (P1-8).
- [ ] Retry re-finds the draft each attempt (P1-9).
- [ ] No duplicate IDs; Dismiss works in every tab (P2-1).
- [ ] Rendering no longer triggers full-DOM scans on every update (P3-1/2).
- [ ] Manifest loads without missing files; unused permissions removed.
- [ ] Tests call real functions and pass; README/versions match code.

List every **[VERIFY]** item you could not confirm without live Studio and ask the owner to test it manually.
