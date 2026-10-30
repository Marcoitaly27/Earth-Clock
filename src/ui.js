import { events } from '../data/events.js';
import { copy } from './copy.js';
import { eras, eraAt } from './eras.js';
import { dialMarkup, placeMarkers } from './dial.js';
import { myaToClock, formatClock, secondsToMya, DAY_SECONDS, myaToSeconds } from './time.js';

export function createUI() {
  const get = id => document.getElementById(id);
  get('dial-art').innerHTML = dialMarkup();
  function ageText(age, lang) {
    return new Intl.NumberFormat(lang, { maximumSignificantDigits: 6 }).format(age);
  }
  function renderPosition(state) {
    const age = secondsToMya(state.seconds);
    const era = eraAt(age);
    const time = formatClock(myaToClock(age));
    get('clock-time').textContent = time;
    get('age').textContent = ageText(age, state.lang);
    get('era-name').textContent = era[state.lang];
    document.documentElement.style.setProperty('--era', era.color);
    get('day-progress').style.strokeDashoffset = 1 - state.seconds / DAY_SECONDS;
    get('timeline').style.setProperty('--elapsed', `${state.seconds / DAY_SECONDS * 100}%`);
    get('hand').style.transform = `rotate(${state.seconds / DAY_SECONDS * 360}deg)`;
    get('timeline').value = state.seconds;
    get('timeline').setAttribute('aria-valuetext', `${time}, ${ageText(age, state.lang)} ${copy[state.lang].before}, ${era[state.lang]}`);
    get('era-key').querySelectorAll('span').forEach(node => node.classList.toggle('active', node.dataset.era === era.id));
  }
  function renderEvent(state, announce = false) {
    const item = events[state.index];
    const c = copy[state.lang];
    get('event-name').textContent = item[`name_${state.lang}`];
    get('event-time').textContent = formatClock(myaToClock(item.mya));
    get('event-age').textContent = `${ageText(item.mya, state.lang)} Ma`;
    get('event-description').textContent = item[`description_${state.lang}`];
    get('category').textContent = c.category[item.category];
    get('event-card').dataset.chapter = String(state.index + 1).padStart(2, '0');
    get('event-source').href = item.source;
    get('uncertainty').hidden = !item.uncertain;
    get('uncertainty-note').textContent = item[`note_${state.lang}`] || '';
    get('uncertainty').open = false;
    get('event-select').value = item.id;
    get('event-index').textContent = `${state.index + 1} / ${events.length}`;
    get('prev').disabled = state.index === 0;
    get('next').disabled = state.index === events.length - 1;
    document.querySelectorAll('[data-event]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.event === item.id)));
    if (announce) get('announcement').textContent = `${item[`name_${state.lang}`]}, ${formatClock(myaToClock(item.mya))}`;
  }
  function renderLanguage(state) {
    const c = copy[state.lang];
    document.documentElement.lang = state.lang;
    document.title = `earth-clock — ${c.project}`;
    document.querySelectorAll('[data-copy]').forEach(node => { node.textContent = c[node.dataset.copy]; });
    const titleParts = c.title.split('\n');
    const emphasis = document.createElement('em');
    emphasis.textContent = titleParts[1];
    document.querySelector('h1').replaceChildren(document.createTextNode(titleParts[0]), document.createElement('br'), emphasis);
    get('lang-en').setAttribute('aria-pressed', String(state.lang === 'en'));
    get('lang-it').setAttribute('aria-pressed', String(state.lang === 'it'));
    get('timeline').setAttribute('aria-label', c.slider);
    get('event-select').setAttribute('aria-label', c.select);
    get('prev').setAttribute('aria-label', c.prev);
    get('next').setAttribute('aria-label', c.next);
    get('close-human').setAttribute('aria-label', c.close);
    get('markers').innerHTML = placeMarkers(events, state.lang);
    get('event-select').replaceChildren(...events.map(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = `${formatClock(myaToClock(item.mya))} · ${item[`name_${state.lang}`]}`;
      return option;
    }));
    get('legend').innerHTML = Object.entries(c.category).map(([id, name]) => `<span class="${id}">${name}</span>`).join('');
    get('era-key').setAttribute('aria-label', c.eraLabel);
    get('era-key').innerHTML = eras.map(era => `<span data-era="${era.id}" style="--interval:${era.color}" title="${era[state.lang]}" role="img" aria-label="${era[state.lang]}">${era[state.lang]}</span>`).join('');
    const humanSeconds = DAY_SECONDS - myaToSeconds(events.find(item => item.id === 'sapiens').mya);
    get('human-scale').textContent = c.humans(new Intl.NumberFormat(state.lang, { maximumFractionDigits: 2 }).format(humanSeconds));
    get('motion-note').textContent = c.reduced;
    renderPosition(state);
    renderEvent(state);
    renderPlay(state);
  }
  function renderPlay(state) {
    get('play').innerHTML = `<span class="play-symbol ${state.playing ? 'is-paused' : ''}" aria-hidden="true"></span> ${copy[state.lang][state.playing ? 'pause' : 'play']}`;
    get('play').setAttribute('aria-pressed', String(state.playing));
  }
  return { get, renderPosition, renderEvent, renderLanguage, renderPlay };
}
