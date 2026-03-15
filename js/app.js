// ── DATA ──
const MILESTONES = [
  { d: 1,   l: '1d'   },
  { d: 3,   l: '3d'   },
  { d: 7,   l: '1sem' },
  { d: 14,  l: '2sem' },
  { d: 30,  l: '1mes' },
  { d: 60,  l: '2mes' },
  { d: 90,  l: '90d'  },
  { d: 180, l: '6mes' }
];

const QUOTES = [
  { t: "El autocontrol es la puerta por la que entran todas las demás virtudes.", a: "Lao-Tzu" },
  { t: "La disciplina es el puente entre metas y logros.", a: "Jim Rohn" },
  { t: "Sufre el dolor de la disciplina o sufre el dolor del arrepentimiento.", a: "Jim Rohn" },
  { t: "La fortaleza no viene de victorias. Viene de la lucha. Cuando decides no rendirte, eso es fortaleza.", a: "Arnold Schwarzenegger" },
  { t: "Cada vez que resistes, te vuelves más fuerte de lo que eras antes.", a: "Epicteto" },
  { t: "El primer y más grande triunfo es conquistarse a uno mismo.", a: "Platón" },
  { t: "No hay enemigo más grande que la mente sin disciplina.", a: "Buda" },
  { t: "Cuida tus pensamientos, pues se vuelven palabras. Cuida tus hábitos, pues se vuelven carácter.", a: "Lao-Tzu" },
  { t: "La energía que no se gasta en el placer se convierte en poder.", a: "Friedrich Nietzsche" },
  { t: "El hombre que se domina a sí mismo es más poderoso que el que conquista ejércitos.", a: "Proverbio budista" }
];

const TIPS = [
  "Haz 30 flexiones AHORA. El ejercicio físico intenso corta el ciclo del impulso en segundos.",
  "Sal de donde estás. Cambia de habitación, sal a la calle. El entorno físico controla el estado mental.",
  "Bebe un vaso grande de agua helada. Activa el sistema nervioso parasimpático inmediatamente.",
  "Pon un temporizador de 15 minutos. Solo tienes que aguantar esos 15 minutos. Puedes hacerlo.",
  "Date una ducha fría de 60 segundos. Transforma la energía sexual en energía física real.",
  "Llama a alguien. Cualquier conversación interrumpe el patrón. La conexión humana es el antídoto.",
  "Haz una serie de 20 sentadillas seguidas de respiración de caja: 4s inhala, 4s aguanta, 4s exhala.",
  "Escribe en papel: ¿Por qué empecé esto? ¿Cómo me sentiré mañana si aguanto vs si cedo?",
  "Recuerda: el impulso dura entre 3 y 10 minutos máximo. Es una ola — solo debes dejar que pase.",
  "Piensa en tu versión futura. Ese hombre que serás en 90 días te está mirando. No lo traiciones."
];

const BENEFITS = [
  { d: 1,  title: "Primeras 24h",          desc: "La dopamina se estabiliza. El cerebro empieza a resetear." },
  { d: 3,  title: "Mayor claridad mental", desc: "Reducción de niebla mental. Más foco y energía." },
  { d: 7,  title: "Testosterona +46%",     desc: "Estudio Jiankang Shen: pico de testosterona al 7° día." },
  { d: 14, title: "Confianza visible",     desc: "Contacto visual más seguro. Voz más firme. Presencia real." },
  { d: 21, title: "Nuevos hábitos",        desc: "Los patrones cerebrales empiezan a remodelarse activamente." },
  { d: 30, title: "Energía transformada",  desc: "La energía sexual se convierte en energía creativa y productiva." },
  { d: 60, title: "Atracción magnética",   desc: "Cambios hormonales profundos. Las personas lo notan." },
  { d: 90, title: "Reinicio completo",     desc: "El cerebro ha completado su remodelación. Eres otro hombre." }
];

// ── STATE ──
let state = loadState();
let tipIndex = Math.floor(Math.random() * TIPS.length);

function loadState() {
  try {
    const s = localStorage.getItem('forge_v2');
    if (s) return JSON.parse(s);
  } catch (e) {}
  return null;
}

function saveState() {
  try { localStorage.setItem('forge_v2', JSON.stringify(state)); } catch (e) {}
}

// ── TIME HELPERS ──
function getDays() {
  return Math.floor((Date.now() - state.start) / 86400000);
}

function getHrsMin() {
  const total = Math.floor((Date.now() - state.start) / 60000);
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${h}h ${m}m`;
}

// ── RENDER ──
function render() {
  const d = getDays();

  if (d > state.best) { state.best = d; saveState(); }

  // Hero
  document.getElementById('days-num').textContent = d;
  document.getElementById('hrs-mins').textContent = getHrsMin();
  document.getElementById('streak-pill').textContent = getBadge(d);

  // Progress bar
  const nextMs = MILESTONES.find(m => m.d > d);
  const prevMs = [...MILESTONES].reverse().find(m => m.d <= d);
  const base   = prevMs ? prevMs.d : 0;
  const target = nextMs ? nextMs.d : MILESTONES[MILESTONES.length - 1].d;
  const pct    = nextMs ? Math.min(100, Math.round(((d - base) / (target - base)) * 100)) : 100;
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('prog-from').textContent = 'Día ' + base;
  document.getElementById('prog-to').textContent   = nextMs ? ('Día ' + nextMs.d + ' →') : '¡Completado!';

  // Milestones grid
  const grid = document.getElementById('ms-grid');
  grid.innerHTML = '';
  MILESTONES.forEach(m => {
    const done    = d >= m.d;
    const current = !done && MILESTONES.filter(x => x.d > d)[0] === m;
    const el = document.createElement('div');
    el.className = 'ms-item' + (done ? ' done' : current ? ' current' : '');
    el.innerHTML = `
      <div class="ms-num">${m.d}</div>
      <div class="ms-lbl">${m.l}</div>
      <div class="ms-check">${done ? '✓' : current ? '◎' : ''}</div>
    `;
    grid.appendChild(el);
  });

  // Quote of the day
  const q = QUOTES[d % QUOTES.length];
  document.getElementById('quote-text').textContent   = '"' + q.t + '"';
  document.getElementById('quote-author').textContent = '— ' + q.a;

  // Stats page
  document.getElementById('stat-days').textContent    = d;
  document.getElementById('stat-best').textContent    = state.best;
  document.getElementById('stat-entries').textContent = state.entries.length;
  document.getElementById('stat-ms').textContent      = MILESTONES.filter(m => d >= m.d).length;

  // Benefits timeline
  const tl = document.getElementById('benefits-timeline');
  tl.innerHTML = '';
  BENEFITS.forEach(b => {
    const done = d >= b.d;
    const el   = document.createElement('div');
    el.className = 'tl-item' + (done ? ' done' : '');
    el.innerHTML = `
      <div class="tl-dot"></div>
      <div class="tl-days">Día ${b.d}</div>
      <div class="tl-title">${b.title}</div>
      <div class="tl-desc">${b.desc}</div>
    `;
    tl.appendChild(el);
  });

  renderEntries();
}

function getBadge(d) {
  if (d >= 180) return "Maestro del autocontrol 🏆";
  if (d >= 90)  return "90 días — leyenda 🌟";
  if (d >= 60)  return "2 meses de poder 💎";
  if (d >= 30)  return "1 mes completado 🔥";
  if (d >= 14)  return "2 semanas fuerte ⚡";
  if (d >= 7)   return "1 semana — ¡sigue! ✅";
  if (d >= 3)   return "3 días — en racha 💪";
  if (d >= 1)   return "Primer día completado";
  return "Empieza hoy — tú puedes";
}

// ── JOURNAL ──
function saveEntry() {
  const input = document.getElementById('journal-input');
  const text  = input.value.trim();
  if (!text) return;
  const now = new Date();
  state.entries.push({
    text,
    date: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    day: getDays()
  });
  if (state.entries.length > 50) state.entries = state.entries.slice(-50);
  saveState();
  input.value = '';
  renderEntries();
  document.getElementById('stat-entries').textContent = state.entries.length;
}

function renderEntries() {
  const list = document.getElementById('entries-list');
  if (!state.entries.length) {
    list.innerHTML = '<div class="empty-state">Sin entradas aún.<br>Escribe cómo te sientes hoy.</div>';
    return;
  }
  list.innerHTML = [...state.entries].reverse().map(e => `
    <div class="entry">
      <div class="entry-date">${e.date}</div>
      <div class="entry-text">${e.text}</div>
      <div class="entry-day">Día ${e.day} de racha</div>
    </div>
  `).join('');
}

// ── RESET ──
function showConfirmReset() {
  document.getElementById('confirm-reset').style.display = 'block';
}
function cancelReset() {
  document.getElementById('confirm-reset').style.display = 'none';
}
function doReset() {
  state.resets = (state.resets || 0) + 1;
  state.start  = null;
  saveState();
  document.getElementById('confirm-reset').style.display = 'none';
  document.getElementById('welcome-screen').classList.add('show');
}

// ── EMERGENCY ──
function openEmergency() {
  tipIndex = Math.floor(Math.random() * TIPS.length);
  document.getElementById('tip-text').textContent = TIPS[tipIndex];
  document.getElementById('emergency-modal').classList.add('open');
}
function closeEmergency() {
  document.getElementById('emergency-modal').classList.remove('open');
}
function nextTip() {
  tipIndex = (tipIndex + 1) % TIPS.length;
  document.getElementById('tip-text').textContent = TIPS[tipIndex];
}

// ── NAVIGATION ──
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  btn.classList.add('active');
}

// ── WELCOME / START ──
function startStreak() {
  if (!state) {
    state = { start: Date.now(), best: 0, entries: [], resets: 0 };
  } else {
    state.start = Date.now();
  }
  saveState();
  document.getElementById('welcome-screen').classList.remove('show');
  render();
}

// ── INIT ──
if (!state || !state.start) {
  if (!state) state = { start: null, best: 0, entries: [], resets: 0 };
  document.getElementById('welcome-screen').classList.add('show');
} else {
  render();
}

setInterval(() => { if (state && state.start) render(); }, 30000);
