/* ─── TimeWeave — app.js ─── */

/* ── Constants ── */
const SWATCHES = [
  '#D88C9A', '#A3B18A', '#6B8EAD', '#A68A7E',
  '#C19A6B', '#5F7682', '#BF6A5A', '#4F6A5B',
  '#D4AF37', '#7B6D8D'
];

const HALF_HOURS = 48; // 30-min slots across 24h

/* All IANA timezone identifiers with friendly labels */
const TIMEZONES = [
  { label: '(UTC−12:00) Baker Island',         value: 'Etc/GMT+12' },
  { label: '(UTC−11:00) Samoa',                value: 'Pacific/Pago_Pago' },
  { label: '(UTC−10:00) Hawaii',               value: 'Pacific/Honolulu' },
  { label: '(UTC−09:00) Alaska',               value: 'America/Anchorage' },
  { label: '(UTC−08:00) Los Angeles (PST)',     value: 'America/Los_Angeles' },
  { label: '(UTC−07:00) Denver (MST)',          value: 'America/Denver' },
  { label: '(UTC−07:00) Phoenix',              value: 'America/Phoenix' },
  { label: '(UTC−06:00) Chicago (CST)',         value: 'America/Chicago' },
  { label: '(UTC−06:00) Mexico City',          value: 'America/Mexico_City' },
  { label: '(UTC−05:00) New York (EST)',        value: 'America/New_York' },
  { label: '(UTC−05:00) Bogotá',              value: 'America/Bogota' },
  { label: '(UTC−04:00) Halifax',             value: 'America/Halifax' },
  { label: '(UTC−04:00) Santiago',            value: 'America/Santiago' },
  { label: '(UTC−03:00) São Paulo',           value: 'America/Sao_Paulo' },
  { label: '(UTC−03:00) Buenos Aires',        value: 'America/Argentina/Buenos_Aires' },
  { label: '(UTC−02:00) South Georgia',       value: 'Atlantic/South_Georgia' },
  { label: '(UTC−01:00) Azores',             value: 'Atlantic/Azores' },
  { label: '(UTC+00:00) London (GMT/UTC)',     value: 'Europe/London' },
  { label: '(UTC+00:00) Reykjavik',           value: 'Atlantic/Reykjavik' },
  { label: '(UTC+01:00) Paris / Berlin (CET)', value: 'Europe/Paris' },
  { label: '(UTC+01:00) Lagos',              value: 'Africa/Lagos' },
  { label: '(UTC+02:00) Cairo',              value: 'Africa/Cairo' },
  { label: '(UTC+02:00) Johannesburg',       value: 'Africa/Johannesburg' },
  { label: '(UTC+02:00) Helsinki',           value: 'Europe/Helsinki' },
  { label: '(UTC+03:00) Moscow',             value: 'Europe/Moscow' },
  { label: '(UTC+03:00) Nairobi',            value: 'Africa/Nairobi' },
  { label: '(UTC+03:30) Tehran',             value: 'Asia/Tehran' },
  { label: '(UTC+04:00) Dubai',              value: 'Asia/Dubai' },
  { label: '(UTC+04:00) Baku',               value: 'Asia/Baku' },
  { label: '(UTC+04:30) Kabul',              value: 'Asia/Kabul' },
  { label: '(UTC+05:00) Karachi',            value: 'Asia/Karachi' },
  { label: '(UTC+05:30) Mumbai / New Delhi', value: 'Asia/Kolkata' },
  { label: '(UTC+05:45) Kathmandu',          value: 'Asia/Kathmandu' },
  { label: '(UTC+06:00) Dhaka',              value: 'Asia/Dhaka' },
  { label: '(UTC+06:30) Yangon',             value: 'Asia/Yangon' },
  { label: '(UTC+07:00) Bangkok / Jakarta',  value: 'Asia/Bangkok' },
  { label: '(UTC+07:00) Ho Chi Minh City',   value: 'Asia/Ho_Chi_Minh' },
  { label: '(UTC+08:00) Singapore',          value: 'Asia/Singapore' },
  { label: '(UTC+08:00) Beijing / Shanghai', value: 'Asia/Shanghai' },
  { label: '(UTC+08:00) Perth',              value: 'Australia/Perth' },
  { label: '(UTC+08:00) Taipei',             value: 'Asia/Taipei' },
  { label: '(UTC+09:00) Tokyo',              value: 'Asia/Tokyo' },
  { label: '(UTC+09:00) Seoul',              value: 'Asia/Seoul' },
  { label: '(UTC+09:30) Adelaide',           value: 'Australia/Adelaide' },
  { label: '(UTC+10:00) Sydney',             value: 'Australia/Sydney' },
  { label: '(UTC+10:00) Port Moresby',       value: 'Pacific/Port_Moresby' },
  { label: '(UTC+11:00) Solomon Islands',    value: 'Pacific/Guadalcanal' },
  { label: '(UTC+12:00) Auckland',           value: 'Pacific/Auckland' },
  { label: '(UTC+13:00) Apia',               value: 'Pacific/Apia' },
  { label: '(UTC+14:00) Kiritimati',         value: 'Pacific/Kiritimati' },
];

/* ── State ── */
let members = [];
let selectedColor = SWATCHES[0];
let bestWindows  = [];   // [{startSlot, len}]
let bestWindowIdx = 0;
let tickInterval  = null;
let editingMemberId = null; // null or member id

/* ── DOM refs ── */
const memberNameEl     = document.getElementById('memberName');
const tzSelectEl       = document.getElementById('tzSelect');
const colorPickerEl    = document.getElementById('colorPicker');
const addMemberBtn     = document.getElementById('addMemberBtn');
const cancelEditBtn    = document.getElementById('cancelEditBtn');
const slotsContainer   = document.getElementById('slotsContainer');
const addSlotBtn       = document.getElementById('addSlotBtn');
const membersListEl    = document.getElementById('membersList');
const memberCountEl    = document.getElementById('memberCount');
const emptyStateEl     = document.getElementById('emptyState');
const viewTzEl         = document.getElementById('viewTz');
const viewTzLabelEl    = document.getElementById('viewTzLabel');
const meetingDurEl     = document.getElementById('meetingDuration');
const highlightBestEl  = document.getElementById('highlightBest');
const timeRulerEl      = document.getElementById('timeRuler');
const overlapGridEl    = document.getElementById('overlapGrid');
const gridPlaceholderEl= document.getElementById('gridPlaceholder');
const summaryBarEl     = document.getElementById('summaryBar');
const summaryTextEl    = document.getElementById('summaryText');
const cycleBestBtn     = document.getElementById('cycleBestBtn');
const exportBtn        = document.getElementById('exportBtn');
const clearAllBtn      = document.getElementById('clearAllBtn');
const exportModal      = document.getElementById('exportModal');
const modalClose       = document.getElementById('modalClose');
const modalCloseBtn    = document.getElementById('modalCloseBtn');
const exportTextEl     = document.getElementById('exportText');
const copyExportBtn    = document.getElementById('copyExportBtn');
const toastEl          = document.getElementById('toast');

/* ── Init ── */
function init() {
  populateTzSelects();
  buildColorPicker();
  buildTimeRuler();
  initSlots();
  loadFromStorage();
  renderGrid();
  tickClock();
  tickInterval = setInterval(tickClock, 30_000);

  addMemberBtn.addEventListener('click', addMember);
  cancelEditBtn.addEventListener('click', cancelEdit);
  addSlotBtn.addEventListener('click', () => addSlotRow());
  memberNameEl.addEventListener('keydown', e => { if (e.key === 'Enter') addMember(); });
  viewTzEl.addEventListener('change', () => { bestWindowIdx = 0; renderGrid(); });
  meetingDurEl.addEventListener('change', () => { bestWindowIdx = 0; renderGrid(); });
  highlightBestEl.addEventListener('change', () => { bestWindowIdx = 0; renderGrid(); });
  cycleBestBtn.addEventListener('click', cycleBestWindow);
  exportBtn.addEventListener('click', openExport);
  clearAllBtn.addEventListener('click', clearAll);
  modalClose.addEventListener('click', closeExport);
  modalCloseBtn.addEventListener('click', closeExport);
  exportModal.addEventListener('click', e => { if (e.target === exportModal) closeExport(); });
  copyExportBtn.addEventListener('click', copyExport);
}

/* ── Slot Row Logic ── */
function initSlots() {
  slotsContainer.innerHTML = '';
  addSlotRow(9, 18); // Default slot
}

function addSlotRow(start = 9, end = 18) {
  const row = document.createElement('div');
  row.className = 'slot-row';
  row.innerHTML = `
    <div class="hour-field">
      <span class="hour-label">From</span>
      <select class="form-input hour-select slot-start"></select>
    </div>
    <div class="hour-sep">→</div>
    <div class="hour-field">
      <span class="hour-label">To</span>
      <select class="form-input hour-select slot-end"></select>
    </div>
    <button class="slot-delete" title="Remove slot">✕</button>
  `;

  const sSel = row.querySelector('.slot-start');
  const eSel = row.querySelector('.slot-end');
  const del  = row.querySelector('.slot-delete');

  for (let h = 0; h < 24; h++) {
    const lbl = formatHour(h);
    const optS = new Option(lbl, h);
    if (h === start) optS.selected = true;
    sSel.add(optS);

    const optE = new Option(lbl, h);
    if (h === end) optE.selected = true;
    eSel.add(optE);
  }

  del.addEventListener('click', () => {
    if (slotsContainer.children.length > 1) {
      row.remove();
    } else {
      showToast('At least one slot is required.', 'error');
    }
  });

  slotsContainer.appendChild(row);
}

function getSlotsFromForm() {
  const rows = slotsContainer.querySelectorAll('.slot-row');
  const slots = [];
  rows.forEach(row => {
    const start = parseInt(row.querySelector('.slot-start').value);
    const end = parseInt(row.querySelector('.slot-end').value);
    if (end > start) {
      slots.push({ start, end });
    }
  });
  return slots;
}

function setSlotsInForm(slots) {
  slotsContainer.innerHTML = '';
  if (!slots || slots.length === 0) {
    addSlotRow();
    return;
  }
  slots.forEach(s => addSlotRow(s.start, s.end));
}

/* ── Member Actions ── */
function addMember() {
  const name = memberNameEl.value.trim();
  if (!name) { showToast('Please enter a name.', 'error'); memberNameEl.focus(); return; }
  const tz = tzSelectEl.value;
  const slots = getSlotsFromForm();

  if (slots.length === 0) {
    showToast('Add at least one valid time slot (End > From).', 'error');
    return;
  }

  const color = selectedColor;

  if (editingMemberId) {
    // Update existing
    const idx = members.findIndex(m => m.id === editingMemberId);
    if (idx !== -1) {
      members[idx] = { ...members[idx], name, tz, slots, color };
      showToast('Member updated! ✨', 'success');
    }
    editingMemberId = null;
    addMemberBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Member`;
    cancelEditBtn.style.display = 'none';
    initSlots(); // Clear slots only after update or explicitly
  } else {
    // Add new
    const member = { id: Date.now(), name, tz, slots, color };
    members.push(member);
    showToast(`${name} added! 🎉`, 'success');
  }

  bestWindowIdx = 0;
  memberNameEl.value = '';
  memberNameEl.focus();
  saveToStorage();
  renderMemberList();
  renderGrid();
}

function editMember(id) {
  const m = members.find(m => m.id === id);
  if (!m) return;

  editingMemberId = id;
  memberNameEl.value = m.name;
  tzSelectEl.value = m.tz;
  setSlotsInForm(m.slots);
  selectedColor = m.color;
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.title === m.color);
  });

  addMemberBtn.textContent = 'Update Member';
  cancelEditBtn.style.display = 'block';
  memberNameEl.focus();
  renderMemberList(); // Refresh to show editing state
}

function cancelEdit() {
  editingMemberId = null;
  memberNameEl.value = '';
  initSlots();
  addMemberBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Member`;
  cancelEditBtn.style.display = 'none';
  renderMemberList();
}


function pickNextColor() {
  const used = members.map(m => m.color);
  const next = SWATCHES.find(c => !used.includes(c)) || SWATCHES[members.length % SWATCHES.length];
  selectedColor = next;
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.style.background === hexToRgb(next) || sw.title === next);
  });
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

/* ── Populate selects ── */
function populateTzSelects() {
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  TIMEZONES.forEach(tz => {
    [tzSelectEl, viewTzEl].forEach(sel => {
      const opt = new Option(tz.label, tz.value);
      if (tz.value === localTz) opt.selected = true;
      sel.add(opt);
    });
  });
}

function formatHour(h) {
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12  = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:00 ${ampm}`;
}

function formatHour12Short(h) {
  if (h === 0) return '12a';
  if (h === 12) return '12p';
  return h < 12 ? `${h}a` : `${h-12}p`;
}

/* ── Color picker ── */
function buildColorPicker() {
  SWATCHES.forEach((color, i) => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch' + (i === 0 ? ' active' : '');
    sw.style.background = color;
    sw.title = color;
    sw.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      selectedColor = color;
    });
    colorPickerEl.appendChild(sw);
  });
}

/* ── Time ruler ── */
function buildTimeRuler() {
  timeRulerEl.innerHTML = '';
  const lbl = document.createElement('div');
  lbl.className = 'ruler-label'; lbl.textContent = 'Member';
  timeRulerEl.appendChild(lbl);

  for (let i = 0; i < HALF_HOURS; i++) {
    const tick = document.createElement('div');
    tick.className = 'ruler-tick';
    if (i % 2 === 0) {
      const h = i / 2;
      tick.textContent = formatHour12Short(h);
      tick.classList.add('hour-mark');
    }
    timeRulerEl.appendChild(tick);
  }
}

function removeMember(id) {
  members = members.filter(m => m.id !== id);
  if (editingMemberId === id) cancelEdit();
  bestWindowIdx = 0;
  saveToStorage();
  renderMemberList();
  renderGrid();
}

function clearAll() {
  if (members.length === 0) return;
  members = [];
  editingMemberId = null;
  bestWindowIdx = 0;
  cancelEdit();
  saveToStorage();
  renderMemberList();
  renderGrid();
  showToast('All members cleared.', 'success');
}

/* ── Render member list ── */
function renderMemberList() {
  memberCountEl.textContent = members.length;
  Array.from(membersListEl.querySelectorAll('.member-item')).forEach(el => el.remove());

  if (members.length === 0) {
    emptyStateEl.style.display = '';
    return;
  }
  emptyStateEl.style.display = 'none';

  members.forEach(m => {
    const isEditing = editingMemberId === m.id;
    const li = document.createElement('li');
    li.className = `member-item${isEditing ? ' editing' : ''}`;
    li.dataset.id = m.id;

    // Build slots text
    const slotsTxt = m.slots.map(s => `${s.start}:00–${s.end}:00`).join(', ');

    li.innerHTML = `
      <div class="member-dot" style="background:${m.color}"></div>
      <div class="member-info" style="cursor:pointer" title="Click to edit">
        <div class="member-name">${escHtml(m.name)} ${isEditing ? '<span class="badge" style="background:var(--acc-glow); color:var(--acc); font-size:0.6rem;">EDITING</span>' : ''}</div>
        <div class="member-tz">${m.tz}</div>
      </div>
      <div class="member-time" id="mtime-${m.id}"></div>
      <div class="member-actions">
        <button class="member-btn edit" title="Edit member">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="member-btn delete" title="Remove member">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `;

    li.querySelector('.member-info').addEventListener('click', () => editMember(m.id));
    li.querySelector('.edit').addEventListener('click', (e) => { e.stopPropagation(); editMember(m.id); });
    li.querySelector('.delete').addEventListener('click', (e) => { e.stopPropagation(); removeMember(m.id); });
    membersListEl.appendChild(li);
  });
  tickClock();
}

/* ── Tick: update local times ── */
function tickClock() {
  members.forEach(m => {
    const el = document.getElementById(`mtime-${m.id}`);
    if (el) el.textContent = nowIn(m.tz);
  });
}

function nowIn(tz) {
  try {
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit', minute: '2-digit', hour12: true, timeZone: tz
    }).format(new Date());
  } catch { return '—'; }
}

/* ── Render grid ── */
function renderGrid() {
  overlapGridEl.innerHTML = '';
  bestWindows = [];
  summaryBarEl.style.display = 'none';
  viewTzLabelEl.textContent = `Viewing in: ${viewTzEl.options[viewTzEl.selectedIndex]?.textContent?.replace(/\(.*?\)\s*/, '') || 'local time'}`;

  if (members.length === 0) {
    gridPlaceholderEl.style.display = '';
    overlapGridEl.appendChild(gridPlaceholderEl);
    return;
  }
  gridPlaceholderEl.style.display = 'none';

  const viewTz   = viewTzEl.value;
  const duration = parseInt(meetingDurEl.value);
  const highlight = highlightBestEl.checked;

  const viewDate = new Date();
  const memberSlotsMasks = members.map(m => {
    const mask = new Array(HALF_HOURS).fill(false);
    for (let s = 0; s < HALF_HOURS; s++) {
      const slotHour = getSlotLocalHour(s, viewTz, m.tz, viewDate);
      // Check if this slot hour falls into ANY of the member's work slots
      const isWorking = m.slots.some(ws => slotHour >= ws.start && slotHour < ws.end);
      if (isWorking) mask[s] = true;
    }
    return mask;
  });

  const overlapCount = new Array(HALF_HOURS).fill(0);
  for (let s = 0; s < HALF_HOURS; s++) {
    memberSlotsMasks.forEach(mask => { if (mask[s]) overlapCount[s]++; });
  }

  const allOverlap = members.length > 1
    ? overlapCount.map(c => c === members.length)
    : memberSlotsMasks[0] ? [...memberSlotsMasks[0]] : new Array(HALF_HOURS).fill(false);

  if (highlight && members.length >= 1) {
    const needed = duration;
    for (let s = 0; s <= HALF_HOURS - needed; s++) {
      const window = allOverlap.slice(s, s + needed);
      if (window.every(Boolean)) {
        bestWindows.push({ startSlot: s, len: needed });
      }
    }
  }

  const bestCells = new Array(HALF_HOURS).fill(false);
  if (bestWindows.length > 0) {
    const bw = bestWindows[bestWindowIdx % bestWindows.length];
    for (let i = bw.startSlot; i < bw.startSlot + duration && i < HALF_HOURS; i++) {
        bestCells[i] = true;
    }
  }

  members.forEach((m, mi) => {
    try {
      const row = document.createElement('div');
      row.className = 'grid-row';

      const lbl = document.createElement('div');
      lbl.className = 'row-label';
      const slotsDisplay = m.slots.map(s => `${s.start}-${s.end}`).join(', ');
      lbl.innerHTML = `<div class="row-dot" style="background:${m.color}"></div>
        <div><div class="row-name">${escHtml(m.name)}</div>
        <div class="row-local">${slotsDisplay} local</div></div>`;
      row.appendChild(lbl);

      for (let s = 0; s < HALF_HOURS; s++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        const isWorking = memberSlotsMasks[mi][s];
        if (isWorking) {
          if (bestCells[s] && highlight) cell.classList.add('best');
          else if (allOverlap[s] && members.length > 1) cell.classList.add('overlap');
          else cell.classList.add('working');
        }
        cell.title = `${m.name} — ${slotToLabel(s, viewTz)} ${isWorking ? '(working ✅)' : '(off 🌙)'}`;
        row.appendChild(cell);
      }
      overlapGridEl.appendChild(row);
    } catch (err) {
      console.warn('Error rendering row for member:', m.name, err);
    }
  });

  if (members.length > 1) {
    try {
      const row = document.createElement('div');
      row.className = 'grid-row overlap-row';
      const lbl = document.createElement('div');
      lbl.className = 'row-label';
      lbl.innerHTML = `<div class="row-dot" style="background:var(--green)"></div>
        <div><div class="row-name" style="color:var(--green)">All Overlap</div>
        <div class="row-local">everyone's free</div></div>`;
      row.appendChild(lbl);

      for (let s = 0; s < HALF_HOURS; s++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        if (allOverlap[s]) {
          if (bestCells[s] && highlight) cell.classList.add('best');
          else cell.classList.add('overlap');
        }
        cell.title = slotToLabel(s, viewTz) + (allOverlap[s] ? ' — Everyone available ✅' : ' — Not all available');
        row.appendChild(cell);
      }
      overlapGridEl.appendChild(row);
    } catch (err) {
       console.warn('Error rendering overlap row:', err);
    }
  }

  updateSummary(bestWindows, viewTz, duration);
}

/* Convert a 30-min slot index in the VIEW timezone to the local hour in a MEMBER's timezone */
function getSlotLocalHour(slotIdx, viewTz, memberTz, viewDate) {
  const slotMs = getSlotAbsoluteMs(slotIdx, viewTz, viewDate);
  const localStr = new Intl.DateTimeFormat('en', {
    hour: 'numeric', hour12: false, timeZone: memberTz
  }).format(new Date(slotMs));
  return parseInt(localStr);
}

function getSlotAbsoluteMs(slotIdx, viewTz, viewDate) {
  const midnight = getMidnightInTz(viewDate, viewTz);
  return midnight + slotIdx * 30 * 60 * 1000;
}

function getMidnightInTz(date, tz) {
  const parts = new Intl.DateTimeFormat('en', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: tz
  }).formatToParts(date);
  const y = parts.find(p => p.type === 'year').value;
  const mo = parts.find(p => p.type === 'month').value;
  const d  = parts.find(p => p.type === 'day').value;
  return new Date(`${y}-${mo}-${d}T00:00:00`).getTime() - getTzOffsetMs(tz, new Date(`${y}-${mo}-${d}T00:00:00`));
}

function getTzOffsetMs(tz, date) {
  const tzStr  = new Intl.DateTimeFormat('en', {
    year:'numeric',month:'2-digit',day:'2-digit',
    hour:'2-digit',minute:'2-digit',second:'2-digit',
    hour12:false, timeZone: tz
  }).format(date);
  const [datePart, timePart] = tzStr.split(', ');
  const [mo,da,yr] = datePart.split('/');
  const [hr,mn,sc] = timePart.split(':');
  const tzDate = new Date(`${yr}-${mo}-${da}T${hr}:${mn}:${sc}Z`);
  return tzDate.getTime() - date.getTime();
}

function slotToLabel(slotIdx, viewTz) {
  const viewDate = new Date();
  const slotMs   = getSlotAbsoluteMs(slotIdx, viewTz, viewDate);
  try {
    return new Intl.DateTimeFormat('en', {
      hour: '2-digit', minute: '2-digit', hour12: true, timeZone: viewTz
    }).format(new Date(slotMs));
  } catch { return `Slot ${slotIdx}`; }
}

/* ── Summary bar ── */
function updateSummary(windows, viewTz, duration) {
  if (members.length < 2) {
    summaryBarEl.style.display = 'none';
    return;
  }

  summaryBarEl.style.display = '';
  if (windows.length === 0) {
    summaryTextEl.innerHTML = `<span style="color:var(--red)">⚠ <strong>No universal meeting window found</strong> for this team. Try adjusting duration or working hours.</span>`;
    cycleBestBtn.style.display = 'none';
    summaryBarEl.style.borderColor = 'rgba(255, 94, 126, 0.3)';
    summaryBarEl.style.background = 'rgba(255, 94, 126, 0.05)';
    return;
  }

  // Restore style
  summaryBarEl.style.borderColor = 'rgba(245,158,11,0.25)';
  summaryBarEl.style.background = 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(124,111,255,0.08))';

  const bw = windows[bestWindowIdx % windows.length];
  const startLabel = slotToLabel(bw.startSlot, viewTz);
  const endSlot = Math.min(bw.startSlot + duration, HALF_HOURS - 1);
  const endLabel = slotToLabel(endSlot, viewTz);
  const durationLabel = duration === 1 ? '30 min' : duration === 2 ? '1 hour' : duration === 3 ? '1.5 hours' : '2 hours';
  summaryTextEl.innerHTML = `
    <strong>${windows.length} overlap window${windows.length > 1 ? 's' : ''} found!</strong>
    Best for a <strong>${durationLabel}</strong> meeting:
    <strong>${startLabel} → ${endLabel}</strong> (in ${viewTzEl.options[viewTzEl.selectedIndex]?.textContent?.replace(/\(.*?\)\s*/,'') || 'view TZ'}).
    Window ${(bestWindowIdx % windows.length) + 1} of ${windows.length}.
  `;
  cycleBestBtn.style.display = windows.length > 1 ? '' : 'none';
}

function cycleBestWindow() {
  bestWindowIdx++;
  renderGrid();
}

/* ── Export ── */
function openExport() {
  const viewTz = viewTzEl.value;
  const lines  = [];
  const dur    = parseInt(meetingDurEl.value);
  const durLabel = dur === 1 ? '30 min' : dur === 2 ? '1 hour' : dur === 3 ? '1.5 hrs' : '2 hrs';

  lines.push('═══════════════════════════════════════');
  lines.push('         TimeWeave — Meeting Schedule   ');
  lines.push('═══════════════════════════════════════');
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push(`Duration needed: ${durLabel}`);
  lines.push('');
  lines.push('TEAM MEMBERS:');
  members.forEach(m => {
    const now  = nowIn(m.tz);
    const slotsTxt = m.slots.map(s => `${s.start}:00–${s.end}:00`).join(', ');
    lines.push(`  • ${m.name}  |  ${m.tz}  |  Works ${slotsTxt} local  |  Now: ${now}`);
  });
  lines.push('');

  if (bestWindows.length === 0) {
    lines.push('⚠  No full-overlap windows found for this duration.');
    lines.push('   Try reducing meeting duration or adjusting working hours.');
  } else {
    lines.push(`BEST MEETING WINDOWS (${bestWindows.length} found):`);
    bestWindows.forEach((bw, i) => {
      const start = slotToLabel(bw.startSlot, viewTz);
      const end   = slotToLabel(Math.min(bw.startSlot + dur, HALF_HOURS-1), viewTz);
      lines.push(`  ${i+1}. ${start} → ${end}  (${viewTzEl.options[viewTzEl.selectedIndex]?.textContent?.replace(/\(.*?\)\s*/,'').trim() || viewTz})`);
    });
  }
  lines.push('');
  lines.push('───────────────────────────────────────');
  lines.push('Made with TimeWeave — timeweave.vercel.app');

  exportTextEl.value = lines.join('\n');
  exportModal.style.display = 'flex';
}

function closeExport() { exportModal.style.display = 'none'; }

function copyExport() {
  navigator.clipboard.writeText(exportTextEl.value).then(() => {
    showToast('Copied to clipboard! 📋', 'success');
  }).catch(() => {
    exportTextEl.select(); document.execCommand('copy');
    showToast('Copied! 📋', 'success');
  });
}

/* ── localStorage ── */
function saveToStorage() {
  try { localStorage.setItem('tw_members_v2', JSON.stringify(members)); } catch {}
}
function loadFromStorage() {
  try {
    const stored = localStorage.getItem('tw_members_v2');
    if (stored) {
      members = JSON.parse(stored);
    } else {
        // Migration from V1 (single start/end)
        const v1 = localStorage.getItem('tw_members');
        if (v1) {
            const oldMembers = JSON.parse(v1);
            members = oldMembers.map(m => ({
                id: m.id,
                name: m.name,
                tz: m.tz,
                slots: m.slots || [{ start: m.workStart, end: m.workEnd }],
                color: m.color
            }));
            saveToStorage();
        }
    }
    renderMemberList();
  } catch {}
}

/* ── Toast ── */
let toastTimer = null;
function showToast(msg, type = '') {
  toastEl.textContent = msg;
  toastEl.className = `toast show${type ? ' ' + type : ''}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.className = 'toast'; }, 2800);
}

/* ── Helpers ── */
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Boot ── */
init();
