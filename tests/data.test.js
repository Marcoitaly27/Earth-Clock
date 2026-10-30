import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { events } from '../data/events.js';
import { eraAt, eras } from '../src/eras.js';
import { myaToSeconds } from '../src/time.js';
import { crossedEvent } from '../src/playback.js';
import { standaloneSource } from '../scripts/standalone.js';

test('dataset has unique ordered events, bilingual text, sources and uncertainty notes', () => {
  assert.equal(events.length, 25);
  assert.equal(new Set(events.map(item => item.id)).size, events.length);
  events.forEach((item, i) => {
    for (const key of ['name_it', 'name_en', 'description_it', 'description_en']) assert.ok(item[key]?.length > 0);
    assert.ok(['geology', 'life', 'extinction', 'humans'].includes(item.category));
    assert.equal(new URL(item.source).protocol, 'https:');
    assert.ok(item.mya >= 0 && item.mya <= 4540);
    if (i) assert.ok(events[i - 1].mya >= item.mya);
    if (item.uncertain) assert.ok(item.note_it && item.note_en);
  });
});

test('geological boundaries select the younger interval', () => {
  assert.equal(eraAt(4540).id, 'hadean');
  assert.equal(eraAt(0).id, 'cenozoic');
  for (let i = 1; i < eras.length; i++) {
    assert.equal(eraAt(eras[i].start).id, eras[i].id);
    assert.equal(eras[i - 1].end, eras[i].start);
  }
});

test('playback stops on the first crossed event, including closely spaced human events', () => {
  const start = myaToSeconds(0.3);
  const agriculture = events.findIndex(item => item.id === 'agriculture');
  assert.equal(crossedEvent(events, start, 86400), agriculture);
  const industry = events.findIndex(item => item.id === 'industry');
  assert.equal(crossedEvent(events, myaToSeconds(events[agriculture].mya), 86400), industry);
  assert.equal(crossedEvent(events, 86400, 86400), -1);
  assert.equal(crossedEvent(events, 0, 1), -1);
});

test('committed standalone fallback matches source and parses without a build', () => {
  const source = readFileSync(new URL('../standalone.js', import.meta.url), 'utf8');
  assert.equal(source, standaloneSource());
  assert.doesNotThrow(() => new vm.Script(source));
});
