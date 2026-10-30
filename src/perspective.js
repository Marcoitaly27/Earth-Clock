import { DAY_SECONDS, myaToSeconds, myaDurationSeconds, myaToClock, formatClock } from './time.js';
import { copy } from './copy.js';

export function ageScale(mya) {
  myaToSeconds(mya);
  if (mya >= 1) return { value: mya, unit: 'Ma' };
  if (mya >= 0.001) return { value: mya * 1000, unit: 'ka' };
  return { value: mya * 1000000, unit: 'yr' };
}

export function ageReadout(mya, lang) {
  const age = ageScale(mya);
  const value = new Intl.NumberFormat(lang, { maximumSignificantDigits: 6 }).format(age.value);
  return { value, label: copy[lang].ageLabels[age.unit], unit: copy[lang].ageUnits[age.unit] };
}

export function preciseClock(mya) {
  if (mya <= 0 || mya >= 1) return formatClock(myaToClock(mya));
  const milliseconds = Math.round(myaToSeconds(mya) * 1000);
  const whole = Math.floor(milliseconds / 1000);
  const clock = formatClock(Math.floor(whole / 3600), Math.floor(whole % 3600 / 60), whole % 60);
  return `${clock}.${String(milliseconds % 1000).padStart(3, '0')}`;
}

export function perspectiveText(item, lang) {
  const spec = item.perspective;
  if (!spec) return '';
  const c = copy[lang];
  const number = (value, digits) => new Intl.NumberFormat(lang, { maximumFractionDigits: digits }).format(value);
  if (spec.kind === 'elapsed') return c.elapsed(number(myaToSeconds(item.mya) / DAY_SECONDS * 100, 1));
  const seconds = myaDurationSeconds(spec.mya ?? item.mya);
  if (spec.kind === 'holocene') return c.holocene(number(seconds, 2));
  const value = seconds >= 60 ? seconds / 60 : seconds;
  return c.remaining(number(value, value < .01 ? 3 : value < 1 ? 3 : seconds >= 60 ? 0 : 2), seconds >= 60 ? c.minuteUnit : c.secondUnit);
}
