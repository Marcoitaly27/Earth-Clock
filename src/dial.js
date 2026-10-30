import { myaToSeconds, DAY_SECONDS } from './time.js';
import { preciseClock } from './perspective.js';
import { eras } from './eras.js';

export function pointAt(seconds, radius = 190) {
  const angle = seconds / DAY_SECONDS * Math.PI * 2;
  return { x: 250 + Math.sin(angle) * radius, y: 250 - Math.cos(angle) * radius };
}

export function arcPath(start, end, radius) {
  const a = pointAt(start, radius);
  const b = pointAt(end, radius);
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${end - start > DAY_SECONDS / 2 ? 1 : 0} 1 ${b.x} ${b.y}`;
}

export function dialMarkup() {
  const rings = eras.map(era => `<path d="${arcPath(myaToSeconds(era.start), myaToSeconds(era.end), 184)}" stroke="${era.color}" class="era-arc"/>`).join('');
  const ticks = Array.from({ length: 96 }, (_, i) => {
    const a = pointAt(i * 900, i % 4 ? 202 : 199);
    const b = pointAt(i * 900, 207);
    return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="tick"/>`;
  }).join('');
  const numbers = Array.from({ length: 12 }, (_, i) => {
    const p = pointAt(i * 7200, 230);
    return `<text x="${p.x}" y="${p.y}" class="dial-number">${String(i * 2).padStart(2, '0')}</text>`;
  }).join('');
  const globe = `<g class="globe-engraving"><circle cx="250" cy="250" r="142"/><ellipse cx="250" cy="250" rx="77" ry="142"/><ellipse cx="250" cy="250" rx="123" ry="142"/><ellipse cx="250" cy="250" rx="142" ry="56"/><ellipse cx="250" cy="250" rx="142" ry="104"/><path d="M108 250h284M250 108v284"/><circle cx="250" cy="250" r="98" class="readout-mask"/></g>`;
  return `<svg viewBox="0 0 500 500" aria-hidden="true"><circle cx="250" cy="250" r="196" class="outer-ring"/><circle cx="250" cy="250" r="166" class="inner-ring"/><circle id="day-progress" cx="250" cy="250" r="166" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-90 250 250)"/>${globe}${rings}${ticks}${numbers}<g id="hand"><line x1="250" y1="155" x2="250" y2="63"/><circle cx="250" cy="63" r="5"/></g></svg>`;
}

export function placeMarkers(items, lang) {
  let cluster = 0;
  return items.map((item, index) => {
    const seconds = myaToSeconds(item.mya);
    const previous = index ? myaToSeconds(items[index - 1].mya) : -Infinity;
    cluster = seconds - previous < 1500 ? cluster + 1 : 0;
    const radius = 184 - (cluster % 7) * 15;
    const p = pointAt(seconds, radius);
    const label = `${item[`name_${lang}`]} · ${preciseClock(item.mya)}`;
    return `<button type="button" class="marker ${item.category}" style="left:${p.x / 5}%;top:${p.y / 5}%" data-event="${item.id}" aria-label="${label}" title="${label}" aria-pressed="false"></button>`;
  }).join('');
}
