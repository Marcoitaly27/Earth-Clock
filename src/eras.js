export const eras = [
  { id: 'hadean', en: 'Hadean', it: 'Adeano', start: 4540, end: 4000, color: '#b86445' },
  { id: 'archean', en: 'Archean', it: 'Archeano', start: 4000, end: 2500, color: '#bb903b' },
  { id: 'proterozoic', en: 'Proterozoic', it: 'Proterozoico', start: 2500, end: 538.8, color: '#607c68' },
  { id: 'paleozoic', en: 'Paleozoic', it: 'Paleozoico', start: 538.8, end: 251.9, color: '#537f91' },
  { id: 'mesozoic', en: 'Mesozoic', it: 'Mesozoico', start: 251.9, end: 66, color: '#87759b' },
  { id: 'cenozoic', en: 'Cenozoic', it: 'Cenozoico', start: 66, end: 0, color: '#a16c80' }
];

export function eraAt(mya) {
  return eras.find(era => mya > era.end) || eras[eras.length - 1];
}
