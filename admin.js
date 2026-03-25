/**
 * TFM Admin — Link Manager
 * admin.js  |  Firebase Firestore + icon upload + analytics
 */

import { initializeApp }          from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore, collection, doc,
         onSnapshot, addDoc, updateDoc, deleteDoc,
         orderBy, query, serverTimestamp,
         increment, setDoc, getDoc }
  from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

/* ── Firebase init ───────────────────────────────────────── */
const app = initializeApp({
  apiKey:            'AIzaSyAsThoFIJoKK6pNgjbdWJUGe_D2KEFAPDU',
  authDomain:        'tfm-dashboards.firebaseapp.com',
  projectId:         'tfm-dashboards',
  storageBucket:     'tfm-dashboards.firebasestorage.app',
  messagingSenderId: '83016073364',
  appId:             '1:83016073364:web:7350dc13e4dd52b4543481',
});
const db = getFirestore(app);
const LINKS_COL     = 'onelink_links';
const ANALYTICS_COL = 'onelink_analytics';

/* ── Preset icons ────────────────────────────────────────── */
const PRESETS = [
  { id:'instagram', label:'Instagram', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>` },
  { id:'snapchat',  label:'Snapchat',  svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.206 1c.386 0 4.07.105 5.862 3.956.422.915.322 2.46.24 3.777-.018.29-.035.573-.047.843.2.11.572.226 1.077.098.261-.065.52-.036.702.078.274.17.424.48.395.82-.047.547-.565.97-1.536 1.255-.066.02-.13.038-.192.055-.36.104-.752.218-1.018.722-.142.269-.164.513-.064.84.52 1.715 2.892 2.88 4.074 3.07.134.02.228.14.22.274a.258.258 0 0 1-.018.082c-.24.672-1.56 1.166-4.02 1.514-.04.183-.082.392-.128.624-.055.277-.308.476-.602.476a.59.59 0 0 1-.117-.012c-.307-.063-.598-.095-.868-.095-.25 0-.483.027-.69.08-.535.14-1.038.472-1.563.821C13.282 20.8 12.42 21.343 11.27 21.343c-.038 0-.073-.001-.109-.003l-.098.003c-1.145 0-2.007-.544-2.798-1.064-.523-.348-1.027-.68-1.558-.82-.211-.055-.446-.082-.698-.082-.273 0-.564.032-.87.095a.587.587 0 0 1-.114.012c-.295 0-.548-.2-.603-.477-.046-.23-.088-.44-.128-.622-2.464-.347-3.784-.841-4.024-1.514a.26.26 0 0 1-.018-.082.252.252 0 0 1 .22-.274c1.183-.19 3.554-1.355 4.074-3.07.1-.326.078-.57-.063-.838-.268-.505-.66-.62-1.02-.723-.063-.018-.127-.036-.194-.055-.97-.286-1.488-.71-1.535-1.258-.029-.338.12-.647.395-.817.19-.116.452-.142.712-.075.475.12.842.016 1.046-.087a17.04 17.04 0 0 1-.047-.852c-.082-1.317-.183-2.86.24-3.776C5.727 1.105 9.41 1 9.796 1l.207.004L12.206 1z"/></svg>` },
  { id:'tiktok',    label:'TikTok',    svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.08a4.85 4.85 0 0 1-1-.39z"/></svg>` },
  { id:'whatsapp',  label:'WhatsApp',  svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>` },
  { id:'globe',     label:'Website',   svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>` },
  { id:'maps',      label:'Maps',      svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>` },
  { id:'phone',     label:'Phone',     svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.92a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>` },
  { id:'email',     label:'Email',     svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>` },
  { id:'youtube',   label:'YouTube',   svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>` },
  { id:'x',         label:'X',         svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
  { id:'facebook',  label:'Facebook',  svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>` },
  { id:'linkedin',  label:'LinkedIn',  svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>` },
];

/* ── State ───────────────────────────────────────────────── */
let links     = [];   // [{id, title, url, category, iconType, iconPreset, iconData, order, clicks}]
let analytics = {};   // {linkId: clicks}
let editingId = null;
let selectedPreset  = 'maps';
let customIconData  = null;   // base64 data URL
let activeTab       = 'preset';
let selectedCat     = 'social';

/* ── DOM refs ────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const backdrop   = $('backdrop');
const modal      = $('modal');
const linksList  = $('linksList');
const emptyState = $('emptyState');
const toast      = $('toast');

/* ── Theme ───────────────────────────────────────────────── */
const MOON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const SUN  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

function initTheme() {
  const saved = localStorage.getItem('tfm-admin-theme') || 'dark';
  setTheme(saved);
}
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('tfm-admin-theme', t);
  $('themeToggle').innerHTML = t === 'dark' ? SUN : MOON;
}
$('themeToggle').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  setTheme(cur === 'dark' ? 'light' : 'dark');
});

/* ── Preset grid ─────────────────────────────────────────── */
function buildPresetGrid() {
  const grid = $('presetGrid');
  grid.innerHTML = PRESETS.map(p => `
    <button type="button" class="preset-item${p.id === selectedPreset ? ' picked' : ''}"
            data-preset="${p.id}" title="${p.label}">
      ${p.svg}
      <span>${p.label}</span>
    </button>`).join('');
  grid.querySelectorAll('.preset-item').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedPreset = btn.dataset.preset;
      grid.querySelectorAll('.preset-item').forEach(b => b.classList.toggle('picked', b === btn));
    });
  });
}

/* ── Icon tab switching ──────────────────────────────────── */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    activeTab = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
    $('panelPreset').classList.toggle('hidden', activeTab !== 'preset');
    $('panelUpload').classList.toggle('hidden', activeTab !== 'upload');
  });
});

/* ── Category segmented control ─────────────────────────── */
document.querySelectorAll('.seg').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedCat = btn.dataset.cat;
    document.querySelectorAll('.seg').forEach(b => b.classList.toggle('active', b === btn));
  });
});

/* ── File upload & validation ────────────────────────────── */
const dropZone  = $('dropZone');
const fileInput = $('fileInput');
const dropIdle  = $('dropIdle');
const dropPrev  = $('dropPreview');
const prevImg   = $('previewImg');
const prevName  = $('previewName');
const prevSize  = $('previewSize');
const uploadErr = $('uploadErr');

$('browseBtn').addEventListener('click', () => fileInput.click());
$('removeFile').addEventListener('click', clearUpload);

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

// Drag & drop
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('over');
  const f = e.dataTransfer.files[0];
  if (f) handleFile(f);
});

function clearUpload() {
  customIconData = null;
  fileInput.value = '';
  dropIdle.classList.remove('hidden');
  dropPrev.classList.add('hidden');
  uploadErr.classList.add('hidden');
  uploadErr.textContent = '';
  prevImg.src = '';
}

function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1024 / 1024).toFixed(1) + ' MB';
}

function showUploadError(msg) {
  uploadErr.textContent = msg;
  uploadErr.classList.remove('hidden');
  clearUpload();
}

function handleFile(file) {
  uploadErr.classList.add('hidden');
  const isSVG = file.type === 'image/svg+xml' || file.name.endsWith('.svg');
  const isPNG = file.type === 'image/png';
  const isJPG = file.type === 'image/jpeg' || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg');

  if (!isSVG && !isPNG && !isJPG) {
    showUploadError('Unsupported file type. Please upload SVG, PNG, or JPG.');
    return;
  }

  // SVG: size check only (max 50 KB)
  if (isSVG) {
    if (file.size > 50 * 1024) {
      showUploadError(`SVG too large (${formatBytes(file.size)}). Maximum allowed: 50 KB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target.result;
      if (!text.includes('<svg')) {
        showUploadError('File does not appear to be a valid SVG.');
        return;
      }
      customIconData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(text)));
      showPreview(file, customIconData);
    };
    reader.readAsText(file);
    return;
  }

  // PNG / JPG: size + dimension check (max 200×200, 200 KB)
  if (file.size > 200 * 1024) {
    showUploadError(`Image too large (${formatBytes(file.size)}). Maximum allowed: 200 KB.`);
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 200 || img.naturalHeight > 200) {
        showUploadError(
          `Image dimensions ${img.naturalWidth}×${img.naturalHeight} px exceed the 200×200 px limit. ` +
          `Please resize the image before uploading.`
        );
        return;
      }
      customIconData = dataUrl;
      showPreview(file, dataUrl);
    };
    img.onerror = () => showUploadError('Could not read image. Please try another file.');
    img.src = dataUrl;
  };
  reader.readAsDataURL(file);
}

function showPreview(file, src) {
  prevImg.src = src;
  prevName.textContent = file.name;
  prevSize.textContent = formatBytes(file.size);
  dropIdle.classList.add('hidden');
  dropPrev.classList.remove('hidden');
}

/* ── Modal open / close ──────────────────────────────────── */
function openModal(link = null) {
  editingId = link ? link.id : null;
  $('modalTitle').textContent = link ? 'Edit Link' : 'Add Link';
  $('submitBtn').textContent  = link ? 'Save Changes' : 'Add Link';

  // Reset form
  $('fTitle').value = link ? link.title : '';
  $('fUrl').value   = link ? link.url   : '';
  $('errTitle').classList.add('hidden');
  $('errUrl').classList.add('hidden');
  $('fTitle').classList.remove('err');
  $('fUrl').classList.remove('err');

  // Icon
  selectedPreset = link?.iconPreset || 'maps';
  customIconData = link?.iconData   || null;
  activeTab = (link?.iconType === 'custom') ? 'upload' : 'preset';

  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === activeTab));
  $('panelPreset').classList.toggle('hidden', activeTab !== 'preset');
  $('panelUpload').classList.toggle('hidden', activeTab !== 'upload');

  if (customIconData) {
    prevImg.src = customIconData;
    prevName.textContent = 'Uploaded icon';
    prevSize.textContent = '';
    dropIdle.classList.add('hidden');
    dropPrev.classList.remove('hidden');
  } else {
    clearUpload();
  }

  // Category
  selectedCat = link?.category || 'social';
  document.querySelectorAll('.seg').forEach(b => b.classList.toggle('active', b.dataset.cat === selectedCat));

  buildPresetGrid();
  backdrop.classList.add('open');
  backdrop.removeAttribute('aria-hidden');
  setTimeout(() => $('fTitle').focus(), 100);
}

function closeModal() {
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden', 'true');
  editingId = null;
}

$('btnAdd').addEventListener('click', () => openModal());
$('closeModal').addEventListener('click', closeModal);
$('cancelBtn').addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── Form submit ─────────────────────────────────────────── */
$('linkForm').addEventListener('submit', async e => {
  e.preventDefault();

  const title = $('fTitle').value.trim();
  const url   = $('fUrl').value.trim();
  let valid   = true;

  if (!title) {
    $('fTitle').classList.add('err');
    $('errTitle').classList.remove('hidden');
    valid = false;
  } else {
    $('fTitle').classList.remove('err');
    $('errTitle').classList.add('hidden');
  }

  if (!url || !/^https?:\/\/.+/.test(url)) {
    $('fUrl').classList.add('err');
    $('errUrl').classList.remove('hidden');
    valid = false;
  } else {
    $('fUrl').classList.remove('err');
    $('errUrl').classList.add('hidden');
  }

  if (!valid) return;

  const iconType   = activeTab === 'upload' && customIconData ? 'custom' : 'preset';
  const iconPreset = iconType === 'preset' ? selectedPreset : null;
  const iconData   = iconType === 'custom' ? customIconData  : null;

  const payload = {
    title,
    url,
    category: selectedCat,
    iconType,
    iconPreset: iconPreset || null,
    iconData:   iconData   || null,
    updatedAt: serverTimestamp(),
  };

  $('submitBtn').disabled = true;

  try {
    if (editingId) {
      await updateDoc(doc(db, LINKS_COL, editingId), payload);
      showToast('Link updated');
    } else {
      payload.order     = Date.now();
      payload.createdAt = serverTimestamp();
      await addDoc(collection(db, LINKS_COL), payload);
      showToast('Link added');
    }
    closeModal();
  } catch (err) {
    console.error(err);
    showToast('Error saving link — check console');
  } finally {
    $('submitBtn').disabled = false;
  }
});

/* ── Delete ──────────────────────────────────────────────── */
async function deleteLink(id) {
  if (!confirm('Delete this link? This cannot be undone.')) return;
  try {
    await deleteDoc(doc(db, LINKS_COL, id));
    showToast('Link deleted');
  } catch (err) {
    console.error(err);
    showToast('Error deleting link');
  }
}

/* ── Render links ────────────────────────────────────────── */
function getIconHTML(link) {
  if (link.iconType === 'custom' && link.iconData) {
    return `<img src="${link.iconData}" alt="" />`;
  }
  const preset = PRESETS.find(p => p.id === link.iconPreset) || PRESETS.find(p => p.id === 'globe');
  return preset.svg;
}

function renderLinks() {
  // Remove existing cards (keep emptyState in DOM)
  linksList.querySelectorAll('.link-card').forEach(el => el.remove());

  const sorted = [...links].sort((a, b) => (a.order || 0) - (b.order || 0));

  emptyState.classList.toggle('hidden', sorted.length > 0);

  sorted.forEach(link => {
    const clicks = analytics[link.id] || 0;
    const card = document.createElement('div');
    card.className = 'link-card';
    card.dataset.id = link.id;
    card.innerHTML = `
      <div class="card-icon">${getIconHTML(link)}</div>
      <div class="card-info">
        <div class="card-title">${escHtml(link.title)}</div>
        <div class="card-url">${escHtml(link.url)}</div>
      </div>
      <div class="card-right">
        <div class="click-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          ${clicks}
        </div>
        <div class="card-actions">
          <button class="icon-btn edit-btn" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="icon-btn danger del-btn" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </div>`;

    card.querySelector('.edit-btn').addEventListener('click', () => openModal(link));
    card.querySelector('.del-btn').addEventListener('click', () => deleteLink(link.id));
    linksList.appendChild(card);
  });
}

/* ── Update analytics stats bar ─────────────────────────── */
function updateStats() {
  const total = Object.values(analytics).reduce((s, v) => s + v, 0);
  $('statTotal').textContent = total || 0;
  $('statCount').textContent = links.length;

  let topName = '—';
  let topClicks = -1;
  links.forEach(l => {
    const c = analytics[l.id] || 0;
    if (c > topClicks) { topClicks = c; topName = l.title; }
  });
  $('statTop').textContent = links.length ? topName : '—';
}

/* ── Firestore real-time listeners ───────────────────────── */
function subscribeLinks() {
  const q = query(collection(db, LINKS_COL), orderBy('order'));
  onSnapshot(q, snap => {
    links = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderLinks();
    updateStats();
  }, err => {
    console.error('Links listener error:', err);
    showToast('Could not load links — check console');
  });
}

function subscribeAnalytics() {
  onSnapshot(collection(db, ANALYTICS_COL), snap => {
    analytics = {};
    snap.docs.forEach(d => { analytics[d.id] = d.data().clicks || 0; });
    renderLinks();
    updateStats();
  }, err => {
    console.error('Analytics listener error:', err);
  });
}

/* ── Toast ───────────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ── Helpers ─────────────────────────────────────────────── */
function escHtml(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Boot ────────────────────────────────────────────────── */
initTheme();
buildPresetGrid();
subscribeLinks();
subscribeAnalytics();
