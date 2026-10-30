import test from 'node:test';
import assert from 'node:assert/strict';
import { events } from '../data/events.js';
import { EARTH_MYA, DAY_SECONDS, myaToClock, myaToSeconds, clockToMya, secondsToMya, formatClock, parseClock, angleToSeconds } from '../src/time.js';

const near = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≈ ${expected}`);

test('endpoints and exact midpoint', () => {
  assert.deepEqual(myaToClock(EARTH_MYA), { hours: 0, minutes: 0, seconds: 0 });
  assert.deepEqual(myaToClock(0), { hours: 24, minutes: 0, seconds: 0 });
  assert.deepEqual(myaToClock(2270), { hours: 12, minutes: 0, seconds: 0 });
  assert.equal(clockToMya(0), 4540);
  assert.equal(clockToMya(24), 0);
  assert.equal(secondsToMya(0), 4540);
  assert.equal(secondsToMya(DAY_SECONDS), 0);
});

test('known event times on the 4540-million-year scale', () => {
  const known = [
    [4540, '00:00:00'], [4510, '00:09:31'], [3500, '05:29:52'],
    [2400, '11:18:46'], [538.8, '21:09:06'], [251.9, '22:40:06'],
    [66, '23:39:04'], [0.3, '23:59:54'], [0, '24:00:00']
  ];
  for (const [age, time] of known) assert.equal(formatClock(myaToClock(age)), time);
});

test('all event ages round trip without discarding fractional seconds', () => {
  for (const item of events) {
    const { hours, minutes, seconds } = myaToClock(item.mya);
    near(clockToMya(hours, minutes, seconds), item.mya);
    near(secondsToMya(myaToSeconds(item.mya)), item.mya);
  }
});

test('sampled times round trip and preserve chronological order', () => {
  let previous = -1;
  for (let i = 0; i <= 1000; i++) {
    const seconds = i * DAY_SECONDS / 1000;
    const age = secondsToMya(seconds);
    const clock = myaToClock(age);
    near(myaToSeconds(age), seconds, 1e-8);
    near(clockToMya(clock.hours, clock.minutes, clock.seconds), age);
    assert.ok(myaToSeconds(age) > previous);
    previous = myaToSeconds(age);
  }
});

test('formatting carries rounded seconds into minutes and hours', () => {
  assert.equal(formatClock(3, 9, 7.1), '03:09:07');
  assert.equal(formatClock(1, 59, 59.9), '02:00:00');
  assert.equal(formatClock(23, 59, 59.9), '24:00:00');
  assert.equal(formatClock(24), '24:00:00');
});

test('rejects invalid ages and clock components', () => {
  for (const age of [-1, 4541, NaN, Infinity, '300', null, undefined]) assert.throws(() => myaToClock(age), RangeError);
  for (const args of [[24, 1], [24, 0, .1], [-1], [25], [12, 60], [1, -1], [1, 1, 60], [1.5], [1, .5], [NaN], ['1']]) {
    assert.throws(() => clockToMya(...args), RangeError);
    assert.throws(() => formatClock(...args), RangeError);
  }
  for (const seconds of [-1, 86401, NaN, Infinity]) assert.throws(() => secondsToMya(seconds), RangeError);
});

test('URL clock parsing validates the full time', () => {
  near(parseClock('12:30'), 45000);
  near(parseClock('01:02:03'), 3723);
  assert.equal(parseClock('00:00'), 0);
  assert.equal(parseClock('24:00'), 86400);
  for (const value of ['24:01', '12:60', '2:00', '12:00junk', '25:00', '', null]) assert.equal(parseClock(value), null);
});

test('pointer angles use midnight at top and retain the today endpoint', () => {
  near(angleToSeconds(0, -1), 0);
  near(angleToSeconds(1, 0), 21600);
  near(angleToSeconds(0, 1), 43200);
  near(angleToSeconds(-1, 0), 64800);
  near(angleToSeconds(0, -1, 86399), 86400);
  assert.throws(() => angleToSeconds(NaN, 0), RangeError);
});
