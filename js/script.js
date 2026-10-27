// --- ESTADO BASE DE LA APLICACIÓN ---
const labsData = [
  {
    id: 'L-1',
    building: 'Edificio B',
    name: 'Laboratorio L-1',
    status: 'Disponible',
    totalPcs: 15,
    specs: '15 Equipos Core i5, 8GB RAM, SO Windows 10',
    software: ['MySQL / Oracle', 'VS Code / NetBeans', 'Cisco Packet Tracer / DOSBox'],
    osList: ['Windows 10'],
    pcs: Array.from({ length: 15 }, (_, i) => {
      const num = i + 1;
      const pcId = `PC-${num < 10 ? '0' + num : num}`;
      let status = 'available';
      if ([3, 7, 12].includes(num)) status = 'occupied';
      if ([5].includes(num)) status = 'maintenance';
      return { id: pcId, status, os: ['Windows 10'], software: ['MySQL / Oracle', 'VS Code / NetBeans'] };
    })
  },
  {
    id: 'L-2',
    building: 'Edificio C',
    name: 'Laboratorio L-2',
    status: 'Disponible',
    totalPcs: 26,
    specs: '26 Equipos Ryzen 7, 32GB RAM, SO Dual (Ubuntu/Win11)',
    software: ['Java / Android Studio', 'Godot Engine / Python', 'VS Code / NetBeans'],
    osList: ['Linux (Ubuntu)', 'Windows 11'],
    pcs: Array.from({ length: 26 }, (_, i) => {
      const num = i + 1;
      const pcId = `PC-${num < 10 ? '0' + num : num}`;
      let status = 'available';
      if ([2, 4, 8, 15, 20].includes(num)) status = 'occupied';
      if ([10, 22].includes(num)) status = 'maintenance';
      return { id: pcId, status, os: ['Linux (Ubuntu)', 'Windows 11'], software: ['Java / Android Studio', 'Godot Engine / Python'] };
    })
  },
  {
    id: 'L-3',
    building: 'Edificio C',
    name: 'Laboratorio L-3',
    status: 'Disponible',
    totalPcs: 30,
    specs: '30 Equipos Core i7, 16GB RAM, SO Dual (Ubuntu/Win11)',
    software: ['Java / Android Studio', 'VS Code / NetBeans', 'Cisco Packet Tracer / DOSBox'],
    osList: ['Linux (Ubuntu)', 'Windows 11'],
    pcs: Array.from({ length: 30 }, (_, i) => {
      const num = i + 1;
      const pcId = `PC-${num < 10 ? '0' + num : num}`;
      let status = 'occupied'; 
      if ([18, 19, 20, 28, 29].includes(num)) status = 'available';
      if (num === 14) status = 'occupied'; 
      if ([15, 16, 22].includes(num)) status = 'maintenance';
      return { id: pcId, status, os: ['Linux (Ubuntu)', 'Windows 11'], software: ['Java / Android Studio', 'VS Code / NetBeans'] };
    })
  },
  {
    id: 'L-4',
    building: 'Edificio C',
    name: 'Laboratorio L-4',
    status: 'Disponible',
    totalPcs: 15,
    specs: '15 Equipos Core i7, 16GB RAM, SO Linux (Ubuntu)',
    software: ['Java / Android Studio', 'MySQL / Oracle', 'Cisco Packet Tracer / DOSBox'],
    osList: ['Linux (Ubuntu)'],
    pcs: Array.from({ length: 15 }, (_, i) => {
      const num = i + 1;
      const pcId = `PC-${num < 10 ? '0' + num : num}`;
      let status = 'available';
      if ([1, 2, 6, 11].includes(num)) status = 'occupied';
      if ([4].includes(num)) status = 'maintenance';
      return { id: pcId, status, os: ['Linux (Ubuntu)'], software: ['Java / Android Studio', 'MySQL / Oracle'] };
    })
  }
];

let currentActiveReservation = {
  active: true,
  folio: '#RES-2026-8891',
  user: 'Cruz Ruiz Eumir Antonio',
  matricula: '23251061',
  labId: 'L-3',
  labName: 'L-3 (Edificio C)',
  pcId: 'PC-14',
  os: 'SO Linux (Ubuntu)',
  date: '28/Oct/2026',
  timeSlot: '10:00 AM - 11:00 AM'
};

let selectedLab = labsData.find(l => l.id === 'L-3');
let selectedPc = 'PC-14';
let selectedTimeSlot = '10:00 - 11:00';
let qrCodeInstance = null;

// --- NAVEGACIÓN ENTRE VISTAS ---
function navigateTo(viewName) {
  document.getElementById('view-search').classList.add('hidden');
  document.getElementById('view-calendar').classList.add('hidden');
  document.getElementById('view-reservations').classList.add('hidden');

  document.getElementById('nav-search').className = "px-3 py-2 rounded-md text-gray-600 hover:text-ittla-green hover:bg-gray-50 transition-colors";
  document.getElementById('nav-reservations').className = "px-3 py-2 rounded-md text-gray-600 hover:text-ittla-green hover:bg-gray-50 transition-colors";

  if (viewName === 'search') {
    document.getElementById('view-search').classList.remove('hidden');
    document.getElementById('nav-search').className = "px-3 py-2 rounded-md transition-colors text-ittla-green bg-ittla-lightgreen font-semibold";
    renderLabsGrid();
  } else if (viewName === 'calendar') {
    document.getElementById('view-calendar').classList.remove('hidden');
    document.getElementById('nav-search').className = "px-3 py-2 rounded-md transition-colors text-ittla-green bg-ittla-lightgreen font-semibold";
    renderCalendarView();
  } else if (viewName === 'reservations') {
    document.getElementById('view-reservations').classList.remove('hidden');
    document.getElementById('nav-reservations').className = "px-3 py-2 rounded-md transition-colors text-ittla-green bg-ittla-lightgreen font-semibold";
    renderReservationsView();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- FILTROS Y BÚSQUEDA ---
function getActiveFilters() {
  const selectedOs = [];
  if (document.getElementById('os-linux').checked) selectedOs.push('Linux (Ubuntu)');
  if (document.getElementById('os-win10').checked) selectedOs.push('Windows 10');
  if (document.getElementById('os-win11').checked) selectedOs.push('Windows 11');

  const selectedSw = [];
  if (document.getElementById('sw-java').checked) selectedSw.push('Java / Android Studio');
  if (document.getElementById('sw-db').checked) selectedSw.push('MySQL / Oracle');
  if (document.getElementById('sw-ide').checked) selectedSw.push('VS Code / NetBeans');
  if (document.getElementById('sw-net').checked) selectedSw.push('Cisco Packet Tracer / DOSBox');
  if (document.getElementById('sw-game').checked) selectedSw.push('Godot Engine / Python');

  return {
    building: document.getElementById('filter-building').value,
    date: document.getElementById('filter-date').value,
    time: document.getElementById('filter-time').value,
    os: selectedOs,
    sw: selectedSw
  };
}

function applySearchFilters() {
  renderLabsGrid();
  showToast("Filtros aplicados correctamente", "✓");
}

function resetFilters() {
  document.getElementById('filter-building').value = 'ALL';
  document.getElementById('filter-date').value = '2026-10-28';
  document.getElementById('filter-time').value = '08:00 - 10:00';
  document.getElementById('os-linux').checked = true;
  document.getElementById('os-win10').checked = false;
  document.getElementById('os-win11').checked = false;
  document.getElementById('sw-java').checked = true;
  document.getElementById('sw-db').checked = false;
  document.getElementById('sw-ide').checked = false;
  document.getElementById('sw-net').checked = false;
  document.getElementById('sw-game').checked = false;
  renderLabsGrid();
  showToast("Filtros restablecidos", "ℹ");
}

// --- RENDERIZADO CATÁLOGO DE LABORATORIOS ---
function renderLabsGrid() {
  const filters = getActiveFilters();
  const container = document.getElementById('labs-grid');
  container.innerHTML = '';

  let filteredLabs = labsData.filter(lab => {
    if (filters.building !== 'ALL' && lab.id !== filters.building) return false;
    return true;
  });

  document.getElementById('lab-count-badge').textContent = `${filteredLabs.length} Laboratorios`;

  filteredLabs.forEach(lab => {
    const card = document.createElement('div');
    card.className = "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between space-y-4";
    
    card.innerHTML = `
      <div>
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="font-bold text-gray-800 text-lg">${lab.name}</h3>
            <span class="text-xs font-medium text-gray-500">(${lab.building})</span>
          </div>
          <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300">
            ✓ ${lab.status}
          </span>
        </div>

        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2 my-3 text-xs">
          <p class="font-semibold text-gray-700">${lab.specs}</p>
          <div class="flex flex-wrap gap-1 pt-1">
            ${lab.software.map(sw => `<span class="bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium">${sw}</span>`).join('')}
          </div>
        </div>
      </div>

      <button onclick="selectLabToBook('${lab.id}')" class="w-full bg-white hover:bg-ittla-lightgreen text-ittla-green border-2 border-ittla-green font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center space-x-2">
        <span>Ver Calendario y Reservar</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
    `;
    container.appendChild(card);
  });
}

function selectLabToBook(labId) {
  selectedLab = labsData.find(l => l.id === labId);
  selectedPc = null;
  navigateTo('calendar');
}

// --- RENDERIZADO PLANO DE AULA Y SELECCIÓN DE PC ---
function renderCalendarView() {
  if (!selectedLab) return;

  document.getElementById('selected-lab-title').textContent = `${selectedLab.name} - Selección de Equipo y Hora`;
  document.getElementById('selected-lab-subtitle').textContent = `${selectedLab.building} | ${selectedLab.specs}`;
  document.getElementById('pc-count-label').textContent = selectedLab.totalPcs;

  const filters = getActiveFilters();
  document.getElementById('applied-search-summary').textContent = 
    `[${selectedLab.building}, ${selectedLab.name}] [${filters.date}] [${filters.time}] [${filters.os.join(', ')} | ${filters.sw.join(', ')}]`;

  const gridContainer = document.getElementById('pc-grid-container');
  gridContainer.innerHTML = '';

  let hasIncompatiblePcs = false;

  selectedLab.pcs.forEach(pc => {
    const pcBtn = document.createElement('button');
    let isCompatible = true;

    if (filters.os.length > 0) {
      const matchOs = filters.os.some(osReq => pc.os.includes(osReq));
      if (!matchOs) isCompatible = false;
    }

    let bgStyle = "";
    let statusLabel = "";
    let isClickable = false;

    if (pc.status === 'maintenance') {
      bgStyle = "bg-gray-100 border-gray-400 text-gray-500 cursor-not-allowed";
      statusLabel = "🔧 RN-11";
    } else if (pc.status === 'occupied') {
      bgStyle = "bg-red-50 border-red-300 text-red-600 cursor-not-allowed opacity-80";
      statusLabel = "✕ Ocupado";
    } else if (!isCompatible) {
      bgStyle = "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed";
      statusLabel = "🚫 Incompatible";
      hasIncompatiblePcs = true;
    } else {
      isClickable = true;
      if (selectedPc === pc.id) {
        bgStyle = "bg-ittla-green text-white border-ittla-darkgreen ring-4 ring-ittla-green/30 scale-105";
        statusLabel = "★ Seleccionado";
      } else {
        bgStyle = "bg-emerald-50 hover:bg-emerald-100 border-emerald-400 text-emerald-800";
        statusLabel = "✓ Libre";
      }
    }

    pcBtn.className = `p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${bgStyle}`;
    pcBtn.disabled = !isClickable;

    pcBtn.innerHTML = `
      <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      <span class="font-bold text-xs">${pc.id}</span>
      <span class="text-[9px] font-semibold mt-0.5">${statusLabel}</span>
    `;

    if (isClickable) {
      pcBtn.onclick = () => selectPc(pc.id);
    }

    gridContainer.appendChild(pcBtn);
  });

  if (hasIncompatiblePcs) {
    document.getElementById('filter-warning-box').classList.remove('hidden');
  } else {
    document.getElementById('filter-warning-box').classList.add('hidden');
  }

  renderTimeline();
  updateConfirmationButtonState();
}

function selectPc(pcId) {
  selectedPc = pcId;
  renderCalendarView();
}

function renderTimeline() {
  const timeSlots = [
    { slot: '07:00 - 08:00', available: true },
    { slot: '08:00 - 09:00', available: true },
    { slot: '09:00 - 10:00', available: true },
    { slot: '10:00 - 11:00', available: false, reason: 'NO DISPONIBLE (RN-08, RN-09)' },
    { slot: '11:00 - 12:00', available: true },
    { slot: '12:00 - 13:00', available: true },
    { slot: '13:00 - 14:00', available: true }
  ];

  const container = document.getElementById('timeline-container');
  container.innerHTML = '';

  timeSlots.forEach(item => {
    const btn = document.createElement('button');
    if (!item.available) {
      btn.className = "w-full p-2.5 rounded-lg border border-gray-300 bg-gray-200 text-gray-500 font-medium text-xs text-left cursor-not-allowed opacity-75 flex justify-between items-center";
      btn.disabled = true;
      btn.innerHTML = `<span>[ ${item.slot} ]</span> <span class="text-[10px] bg-gray-300 px-1.5 py-0.5 rounded font-bold">${item.reason}</span>`;
    } else {
      const isSelected = selectedTimeSlot === item.slot;
      btn.className = `w-full p-2.5 rounded-lg border text-xs font-semibold text-left transition-colors flex justify-between items-center ${
        isSelected 
          ? 'border-ittla-green bg-ittla-lightgreen text-ittla-green ring-2 ring-ittla-green/20' 
          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
      }`;
      btn.onclick = () => {
        selectedTimeSlot = item.slot;
        renderTimeline();
        updateConfirmationButtonState();
      };
      btn.innerHTML = `<span>[ ${item.slot} ]</span> ${isSelected ? '<span class="text-xs">✓ Seleccionado</span>' : ''}`;
    }
    container.appendChild(btn);
  });
}

function updateConfirmationButtonState() {
  const btn = document.getElementById('btn-to-confirmation');
  if (selectedPc && selectedTimeSlot) {
    btn.disabled = false;
    btn.classList.remove('opacity-50', 'cursor-not-allowed');
  } else {
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
  }
}

// --- MODAL DE CONFIRMACIÓN ---
function openConfirmationModal() {
  if (!selectedPc || !selectedTimeSlot) return;

  const filters = getActiveFilters();
  const osText = filters.os.length > 0 ? filters.os.join(' / ') : 'Linux (Ubuntu)';

  document.getElementById('modal-lab').textContent = `${selectedLab.name} (${selectedLab.building})`;
  document.getElementById('modal-pc').textContent = `${selectedPc} (SO ${osText})`;
  document.getElementById('modal-datetime').textContent = `${filters.date} - ${selectedTimeSlot}`;

  document.getElementById('modal-confirmation').classList.remove('hidden');
}

function closeConfirmationModal() {
  document.getElementById('modal-confirmation').classList.add('hidden');
}

function processReservationConfirm() {
  closeConfirmationModal();

  const filters = getActiveFilters();
  const osText = filters.os.length > 0 ? filters.os.join(' / ') : 'Linux (Ubuntu)';

  currentActiveReservation = {
    active: true,
    folio: `#RES-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    user: 'Cruz Ruiz Eumir Antonio',
    matricula: '23251061',
    labId: selectedLab.id,
    labName: `${selectedLab.name} (${selectedLab.building})`,
    pcId: selectedPc,
    os: `SO ${osText}`,
    date: filters.date,
    timeSlot: selectedTimeSlot
  };

  const pcObj = selectedLab.pcs.find(p => p.id === selectedPc);
  if (pcObj) pcObj.status = 'occupied';

  showToast("¡Reservación confirmada exitosamente!", "✓");
  navigateTo('reservations');
}

// --- PASE DIGITAL & CANCELACIONES ---
function renderReservationsView() {
  const activeCard = document.getElementById('active-reservation-card');
  const noActiveCard = document.getElementById('no-active-reservation');

  if (currentActiveReservation && currentActiveReservation.active) {
    activeCard.classList.remove('hidden');
    noActiveCard.classList.add('hidden');

    document.getElementById('pass-folio').textContent = currentActiveReservation.folio;
    document.getElementById('pass-user').textContent = currentActiveReservation.user;
    document.getElementById('pass-lab').textContent = currentActiveReservation.labName;
    document.getElementById('pass-pc').textContent = `${currentActiveReservation.pcId} (${currentActiveReservation.os})`;
    document.getElementById('pass-datetime').textContent = `${currentActiveReservation.date}, ${currentActiveReservation.timeSlot}`;

    generateRealQRCode(
      `${currentActiveReservation.folio}|${currentActiveReservation.user}|${currentActiveReservation.labName}|${currentActiveReservation.pcId}|${currentActiveReservation.os}`
    );
  } else {
    activeCard.classList.add('hidden');
    noActiveCard.classList.remove('hidden');
  }
}

function generateRealQRCode(textData) {
  const qrContainer = document.getElementById('qrcode-container');
  qrContainer.innerHTML = '';
  qrCodeInstance = new QRCode(qrContainer, {
    text: textData,
    width: 110,
    height: 110,
    colorDark: "#006837",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

function openCancelModal() {
  if (!currentActiveReservation) return;
  document.getElementById('cancel-pc-name').textContent = currentActiveReservation.pcId;
  document.getElementById('cancel-folio-name').textContent = currentActiveReservation.folio;
  document.getElementById('modal-cancel-confirm').classList.remove('hidden');
}

function closeCancelModal() {
  document.getElementById('modal-cancel-confirm').classList.add('hidden');
}

function executeReservationCancellation() {
  closeCancelModal();

  if (currentActiveReservation) {
    const labObj = labsData.find(l => l.id === currentActiveReservation.labId);
    if (labObj) {
      const pcObj = labObj.pcs.find(p => p.id === currentActiveReservation.pcId);
      if (pcObj) pcObj.status = 'available';
    }

    const historyBody = document.getElementById('history-table-body');
    const newRow = document.createElement('tr');
    newRow.className = "hover:bg-gray-50 transition-colors bg-red-50/30";
    newRow.innerHTML = `
      <td class="py-3 px-4 font-medium">${currentActiveReservation.date}</td>
      <td class="py-3 px-4">${currentActiveReservation.labName}</td>
      <td class="py-3 px-4 font-mono">${currentActiveReservation.pcId}</td>
      <td class="py-3 px-4">
        <span class="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-semibold">[ Cancelada ]</span>
      </td>
    `;
    historyBody.insertBefore(newRow, historyBody.firstChild);

    currentActiveReservation.active = false;
    renderReservationsView();
    showToast("Reservación cancelada. El equipo ha sido liberado.", "ℹ");
  }
}

// --- TOAST NOTIFICATION ---
function showToast(message, icon = "✓") {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = message;
  document.getElementById('toast-icon').textContent = icon;

  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3500);
}

// INICIALIZACIÓN
window.addEventListener('DOMContentLoaded', () => {
  renderLabsGrid();
});