import { myaToSeconds } from './time.js';

export function crossedEvent(items, from, to) {
  return items.findIndex(item => {
    const moment = myaToSeconds(item.mya);
    return moment > from + 1e-8 && moment <= to + 1e-8;
  });
}
