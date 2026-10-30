import { events } from '../data/events.js';
import { DAY_SECONDS, myaToSeconds, parseClock, angleToSeconds } from './time.js';
import { createUI } from './ui.js';
import { crossedEvent } from './playback.js';

const params = new URLSearchParams(location.search);
const requestedLang = params.get('lang');
const state = {
  lang: ['it', 'en'].includes(requestedLang) ? requestedLang : (navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en'),
  seconds: parseClock(params.get('t')) ?? 0,
  index: 0,
  playing: false
};
const theme = params.get('theme');
if (['dark', 'light'].includes(theme)) document.documentElement.dataset.theme = theme;
if (params.get('embed') === '1') document.body.classList.add('embed');
state.index = Math.max(0, events.findLastIndex(item => myaToSeconds(item.mya) <= state.seconds + 1e-8));
const ui = createUI();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let frameId = 0;
let lastFrame = 0;
let holdUntil = 0;
let nextStep = 0;
let dragging = false;

function stop() {
  state.playing = false;
  cancelAnimationFrame(frameId);
  ui.renderPlay(state);
}

function moveTo(seconds, announce = false) {
  state.seconds = Math.min(DAY_SECONDS, Math.max(0, seconds));
  const index = Math.max(0, events.findLastIndex(item => myaToSeconds(item.mya) <= state.seconds + 1e-8));
  if (state.index !== index) {
    state.index = index;
    ui.renderEvent(state, announce);
  }
  ui.renderPosition(state);
}

function chooseEvent(index) {
  if (index < 0 || index >= events.length) return;
  stop();
  state.index = index;
  state.seconds = myaToSeconds(events[index].mya);
  ui.renderPosition(state, true);
  ui.renderEvent(state, true);
}

function animate(timestamp) {
  if (!state.playing) return;
  const elapsed = Math.min(250, timestamp - lastFrame);
  lastFrame = timestamp;
  if (timestamp >= holdUntil && (!reducedMotion.matches || timestamp >= nextStep)) {
    const target = Math.min(DAY_SECONDS, state.seconds + (reducedMotion.matches ? 3600 : elapsed * DAY_SECONDS / 90000));
    const hit = crossedEvent(events, state.seconds, target);
    if (hit >= 0) {
      state.index = hit;
      state.seconds = myaToSeconds(events[hit].mya);
      ui.renderEvent(state, true);
      holdUntil = timestamp + 1800;
    } else {
      state.seconds = target;
    }
    nextStep = timestamp + 1800;
    ui.renderPosition(state);
    if (state.seconds >= DAY_SECONDS) { stop(); return; }
  }
  frameId = requestAnimationFrame(animate);
}

ui.get('play').addEventListener('click', () => {
  if (state.playing) { stop(); return; }
  if (state.seconds >= DAY_SECONDS) moveTo(0);
  state.playing = true;
  lastFrame = performance.now();
  holdUntil = lastFrame;
  nextStep = lastFrame;
  ui.renderPlay(state);
  frameId = requestAnimationFrame(animate);
});
ui.get('now').addEventListener('click', () => {
  chooseEvent(events.findIndex(item => item.id === 'sapiens'));
  ui.get('human-perspective').hidden = false;
  ui.get('announcement').textContent = ui.get('human-scale').textContent;
});
ui.get('close-human').addEventListener('click', () => {
  ui.get('human-perspective').hidden = true;
  ui.get('now').focus();
});
ui.get('markers').addEventListener('click', event => {
  const marker = event.target.closest('[data-event]');
  if (marker) chooseEvent(events.findIndex(item => item.id === marker.dataset.event));
});
ui.get('curiosities').addEventListener('click', event => { if (event.target.closest('button')) stop(); });
ui.get('event-select').addEventListener('change', event => chooseEvent(events.findIndex(item => item.id === event.target.value)));
ui.get('prev').addEventListener('click', () => chooseEvent(state.index - 1));
ui.get('next').addEventListener('click', () => chooseEvent(state.index + 1));
for (const lang of ['en', 'it']) {
  ui.get(`lang-${lang}`).addEventListener('click', () => {
    stop();
    state.lang = lang;
    ui.renderLanguage(state);
  });
}
ui.get('timeline').addEventListener('input', event => {
  stop();
  moveTo(Number(event.target.value), true);
});
ui.get('timeline').addEventListener('keydown', event => {
  const directions = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };
  if (event.key in directions || ['Home', 'End'].includes(event.key)) {
    event.preventDefault();
    stop();
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? DAY_SECONDS : state.seconds + directions[event.key] * (event.shiftKey ? 3600 : 60);
    moveTo(target, true);
  }
});
function dragAt(event) {
  const rect = ui.get('dial').getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  if (Math.hypot(x, y) > rect.width * .12) moveTo(angleToSeconds(x, y, state.seconds));
}
ui.get('dial').addEventListener('pointerdown', event => {
  if (event.target.closest('button') || !event.isPrimary || event.button !== 0) return;
  stop();
  dragging = true;
  ui.get('dial').setPointerCapture(event.pointerId);
  dragAt(event);
});
ui.get('dial').addEventListener('pointermove', event => { if (dragging) dragAt(event); });
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  ui.get('dial').addEventListener(type, () => { dragging = false; });
}
function motionChanged() {
  stop();
  ui.renderPosition(state);
  ui.renderEvent(state);
  ui.get('motion-note').hidden = !reducedMotion.matches;
}
reducedMotion.addEventListener('change', motionChanged);
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
ui.renderLanguage(state);
motionChanged();
