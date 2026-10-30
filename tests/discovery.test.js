import test from 'node:test';
import assert from 'node:assert/strict';
import { events } from '../data/events.js';
import { copy } from '../src/copy.js';
import { geologyAt } from '../src/geology.js';
import { ageScale, ageReadout, preciseClock, perspectiveText } from '../src/perspective.js';
import { myaDurationSeconds, myaToSeconds, DAY_SECONDS } from '../src/time.js';
import { interpolatePosition } from '../src/transitions.js';
import { pointAt } from '../src/dial.js';

const originalStops = [
  ['earth', 4540], ['moon', 4510], ['oceans', 4400], ['life', 3500], ['photosynthesis', 2700],
  ['oxygen', 2400], ['eukaryotes', 1800], ['multicellular', 1600], ['snowball', 720], ['ediacaran', 575],
  ['cambrian', 538.8], ['plants', 470], ['ordovician', 443.8], ['tetrapods', 370], ['permian', 251.9],
  ['dinosaurs', 230], ['mammals', 200], ['flowers', 140], ['kpg', 66], ['primates', 56],
  ['homo', 2.8], ['sapiens', .3], ['agriculture', .012], ['industry', .000266], ['today', 0]
];

test('all original event identities, ages and ordering are preserved', () => {
  assert.deepEqual(events.map(item => [item.id, item.mya]), originalStops);
});

test('every stop has two or three concise, sourced, bilingual curiosities', () => {
  const types = ['scale', 'surprise', 'connection', 'consequence'];
  for (const item of events) {
    assert.ok(item.curiosities.length >= 2 && item.curiosities.length <= 3, item.id);
    assert.equal(new Set(item.curiosities.map(fact => fact.text.en)).size, item.curiosities.length);
    for (const detail of item.curiosities) {
      assert.ok(types.includes(detail.type));
      assert.deepEqual(Object.keys(detail.text).sort(), ['en', 'it']);
      for (const lang of ['en', 'it']) {
        assert.ok(detail.text[lang].trim().split(/\s+/).length <= 40, item.id);
        assert.ok(detail.text[lang].length > 30);
        assert.notEqual(detail.text[lang], item[`description_${lang}`]);
      }
      assert.equal(new URL(detail.source || item.source).protocol, 'https:');
    }
  }
});

test('UI translations have matching structures and counts come from the dataset', () => {
  const shape = value => Object.fromEntries(Object.entries(value).map(([key, entry]) => [key,
    entry && typeof entry === 'object' ? shape(entry) : typeof entry]));
  assert.deepEqual(shape(copy.en), shape(copy.it));
  for (const lang of ['en', 'it']) {
    assert.ok(copy[lang].journey(events.length).includes(String(events.length)));
    assert.ok(copy[lang].journey(7).includes('7'));
  }
});

test('geological hierarchy distinguishes eons, eras, periods and epochs', () => {
  assert.deepEqual(geologyAt(4540).map(level => [level.en, level.rank]), [['Hadean', 'eon']]);
  assert.deepEqual(geologyAt(3500).map(level => level.en), ['Archean', 'Paleoarchean']);
  assert.deepEqual(geologyAt(720).map(level => level.en), ['Proterozoic', 'Neoproterozoic', 'Cryogenian']);
  assert.deepEqual(geologyAt(230).map(level => level.en), ['Phanerozoic', 'Mesozoic', 'Triassic']);
  assert.deepEqual(geologyAt(66).map(level => level.en), ['Phanerozoic', 'Cenozoic', 'Paleogene']);
  assert.equal(geologyAt(.3).at(-1).en, 'Pleistocene');
  assert.equal(geologyAt(0).at(-1).en, 'Holocene');
  for (const item of events) {
    for (const level of geologyAt(item.mya)) {
      assert.ok(level.en && level.it && copy.en.ranks[level.rank]);
    }
  }
});

test('duration conversions preserve the shared scale even inside the final second', () => {
  assert.equal(myaDurationSeconds(0), 0);
  assert.equal(myaDurationSeconds(4540), DAY_SECONDS);
  assert.ok(Math.abs(myaDurationSeconds(.3) - 5.709251101321586) < 1e-12);
  assert.ok(Math.abs(myaDurationSeconds(.0117) - .22266079295154187) < 1e-12);
  assert.ok(Math.abs(myaDurationSeconds(.000266) - .005062202643171806) < 1e-12);
  for (const item of events) assert.ok(Math.abs(myaDurationSeconds(item.mya) + myaToSeconds(item.mya) - DAY_SECONDS) < 1e-8);
  for (const invalid of [-1, 4541, NaN, Infinity]) assert.throws(() => myaDurationSeconds(invalid), RangeError);
});

test('human-scale ages switch units without changing underlying dates', () => {
  assert.deepEqual(ageScale(1), { value: 1, unit: 'Ma' });
  assert.deepEqual(ageScale(.3), { value: 300, unit: 'ka' });
  assert.deepEqual(ageScale(.001), { value: 1, unit: 'ka' });
  assert.deepEqual(ageScale(.000266), { value: 266, unit: 'yr' });
  assert.equal(ageReadout(538.8, 'it').value, '538,8');
  assert.equal(ageReadout(0, 'en').label, 'years ago');
  assert.equal(ageReadout(.012, 'it').value, '12');
  for (const invalid of [-1, 4541, NaN, Infinity]) assert.throws(() => ageScale(invalid), RangeError);
});

test('fractional clock times distinguish the final human events from midnight', () => {
  assert.equal(preciseClock(4540), '00:00:00');
  assert.equal(preciseClock(.3), '23:59:54.291');
  assert.equal(preciseClock(.012), '23:59:59.772');
  assert.equal(preciseClock(.000266), '23:59:59.995');
  assert.equal(preciseClock(0), '24:00:00');
});

test('selective comparisons are calculated and localized rather than stored clock times', () => {
  const at = id => events.find(item => item.id === id);
  assert.match(perspectiveText(at('cambrian'), 'en'), /88\.1%/);
  assert.match(perspectiveText(at('kpg'), 'en'), /21 minutes/);
  assert.match(perspectiveText(at('sapiens'), 'it'), /5,71 secondi/);
  assert.match(perspectiveText(at('agriculture'), 'en'), /0\.228 seconds/);
  assert.match(perspectiveText(at('industry'), 'en'), /0\.005 seconds/);
  assert.match(perspectiveText(at('today'), 'it'), /0,22 secondi/);
  assert.equal(perspectiveText(at('earth'), 'en'), '');
  assert.notEqual(perspectiveText({ mya: 100, perspective: { kind: 'remaining' } }, 'en'), perspectiveText(at('kpg'), 'en'));
});

test('dial point geometry follows exact age conversion', () => {
  for (const [seconds, x, y] of [[0, 250, 60], [21600, 440, 250], [43200, 250, 440], [64800, 60, 250], [86400, 250, 60]]) {
    const point = pointAt(seconds);
    assert.ok(Math.abs(point.x - x) < 1e-10 && Math.abs(point.y - y) < 1e-10);
  }
  for (const item of events) {
    const point = pointAt(myaToSeconds(item.mya));
    assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
  }
});

test('transition frames cannot overshoot the clock endpoints, including early frame timestamps', () => {
  for (const [from, to] of [[0, DAY_SECONDS], [DAY_SECONDS, 0], [100, 200]]) {
    assert.equal(interpolatePosition(from, to, -5), from);
    assert.equal(interpolatePosition(from, to, 0), from);
    assert.equal(interpolatePosition(from, to, 260), to);
    assert.equal(interpolatePosition(from, to, 500), to);
    for (const elapsed of [-1, 1, 50, 150, 259, 300]) {
      const value = interpolatePosition(from, to, elapsed);
      assert.ok(value >= Math.min(from, to) && value <= Math.max(from, to));
    }
  }
});
