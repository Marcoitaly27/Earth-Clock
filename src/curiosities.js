import { copy } from './copy.js';

export function createCuriosities(get, transitions) {
  let currentItem;
  let currentLang;
  let detailIndex = 0;
  function render(item, lang) {
    if (currentItem?.id !== item.id) detailIndex = 0;
    currentItem = item;
    currentLang = lang;
    const c = copy[lang];
    const detail = item.curiosities[detailIndex];
    get('curiosity-text').textContent = detail.text[lang];
    get('curiosity-count').textContent = `${detailIndex + 1} / ${item.curiosities.length}`;
    get('curiosity-source').href = detail.source || item.source;
    get('curiosity-source').textContent = c.noteSource;
    get('curiosity-prev').setAttribute('aria-label', c.prevDetail);
    get('curiosity-next').setAttribute('aria-label', c.nextDetail);
    transitions.reveal([get('curiosity-text')], 70);
  }
  function step(direction) {
    detailIndex = (detailIndex + direction + currentItem.curiosities.length) % currentItem.curiosities.length;
    render(currentItem, currentLang);
    get('announcement').textContent = `${copy[currentLang].curiosity}, ${detailIndex + 1}/${currentItem.curiosities.length}. ${currentItem.curiosities[detailIndex].text[currentLang]}`;
  }
  get('curiosity-prev').addEventListener('click', () => step(-1));
  get('curiosity-next').addEventListener('click', () => step(1));
  return { render };
}
