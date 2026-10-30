export const EARTH_MYA = 4540;
export const DAY_SECONDS = 86400;

export function myaToSeconds(mya) {
  if (!Number.isFinite(mya) || mya < 0 || mya > EARTH_MYA) {
    throw new RangeError('Age must be between 0 and 4540 million years.');
  }
  return (1 - mya / EARTH_MYA) * DAY_SECONDS;
}

export function myaToClock(mya) {
  const total = myaToSeconds(mya);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total - hours * 3600) / 60);
  const seconds = total - hours * 3600 - minutes * 60;
  return { hours, minutes, seconds };
}

export function clockToMya(hours, minutes = 0, seconds = 0) {
  if (![hours, minutes, seconds].every(Number.isFinite) ||
      !Number.isInteger(hours) || !Number.isInteger(minutes) ||
      hours < 0 || hours > 24 || minutes < 0 || minutes >= 60 ||
      seconds < 0 || seconds >= 60 || (hours === 24 && (minutes || seconds))) {
    throw new RangeError('Expected a valid 24-hour clock time, including 24:00:00.');
  }
  return EARTH_MYA * (1 - (hours * 3600 + minutes * 60 + seconds) / DAY_SECONDS);
}

export function secondsToMya(total) {
  if (!Number.isFinite(total) || total < 0 || total > DAY_SECONDS) {
    throw new RangeError('Seconds must be between 0 and 86400.');
  }
  return EARTH_MYA * (1 - total / DAY_SECONDS);
}

export function formatClock(hours, minutes = 0, seconds = 0) {
  if (typeof hours === 'object' && hours !== null) {
    ({ hours, minutes, seconds } = hours);
  }
  clockToMya(hours, minutes, seconds);
  const rounded = Math.round(hours * 3600 + minutes * 60 + seconds);
  return [Math.floor(rounded / 3600), Math.floor(rounded % 3600 / 60), rounded % 60]
    .map(value => String(value).padStart(2, '0')).join(':');
}

export function parseClock(value) {
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value || '');
  if (!match) return null;
  const [, h, m, s = '0'] = match;
  try {
    return myaToSeconds(clockToMya(Number(h), Number(m), Number(s)));
  } catch {
    return null;
  }
}

export function angleToSeconds(x, y, previous = 0) {
  if (![x, y, previous].every(Number.isFinite)) throw new RangeError('Invalid position.');
  const turn = ((Math.atan2(x, -y) / (Math.PI * 2)) + 1) % 1;
  const total = turn * DAY_SECONDS;
  return total < 0.000001 && previous > DAY_SECONDS / 2 ? DAY_SECONDS : total;
}

export function myaDurationSeconds(mya) {
  myaToSeconds(mya);
  return mya / EARTH_MYA * DAY_SECONDS;
}
