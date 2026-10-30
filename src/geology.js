import { eraAt } from './eras.js';

const interval = (start, en, it, rank) => ({ start, en, it, rank });
const periods = [
  interval(538.8, 'Cambrian', 'Cambriano', 'period'),
  interval(485.4, 'Ordovician', 'Ordoviciano', 'period'),
  interval(443.8, 'Silurian', 'Siluriano', 'period'),
  interval(419.2, 'Devonian', 'Devoniano', 'period'),
  interval(358.9, 'Carboniferous', 'Carbonifero', 'period'),
  interval(298.9, 'Permian', 'Permiano', 'period'),
  interval(251.9, 'Triassic', 'Triassico', 'period'),
  interval(201.4, 'Jurassic', 'Giurassico', 'period'),
  interval(145, 'Cretaceous', 'Cretaceo', 'period'),
  interval(66, 'Paleogene', 'Paleogene', 'period'),
  interval(23.03, 'Neogene', 'Neogene', 'period'),
  interval(2.58, 'Quaternary', 'Quaternario', 'period')
];
const archeanEras = [
  interval(4000, 'Eoarchean', 'Eoarcheano', 'era'),
  interval(3600, 'Paleoarchean', 'Paleoarcheano', 'era'),
  interval(3200, 'Mesoarchean', 'Mesoarcheano', 'era'),
  interval(2800, 'Neoarchean', 'Neoarcheano', 'era')
];
const proterozoicEras = [
  interval(2500, 'Paleoproterozoic', 'Paleoproterozoico', 'era'),
  interval(1600, 'Mesoproterozoic', 'Mesoproterozoico', 'era'),
  interval(1000, 'Neoproterozoic', 'Neoproterozoico', 'era')
];
const proterozoicPeriods = [
  interval(2500, 'Siderian', 'Sideriano', 'period'),
  interval(2300, 'Rhyacian', 'Riaciano', 'period'),
  interval(2050, 'Orosirian', 'Orosiriano', 'period'),
  interval(1800, 'Statherian', 'Stateriano', 'period'),
  interval(1600, 'Calymmian', 'Calimmiano', 'period'),
  interval(1400, 'Ectasian', 'Ectasiano', 'period'),
  interval(1200, 'Stenian', 'Steniano', 'period'),
  interval(1000, 'Tonian', 'Toniano', 'period'),
  interval(720, 'Cryogenian', 'Criogeniano', 'period'),
  interval(635, 'Ediacaran', 'Ediacarano', 'period')
];
const containing = (items, mya) => items.findLast(item => mya <= item.start);

export function geologyAt(mya) {
  const broad = eraAt(mya);
  if (broad.id === 'hadean') return [{ ...broad, rank: 'eon' }];
  if (broad.id === 'archean') return [{ ...broad, rank: 'eon' }, containing(archeanEras, mya)];
  if (broad.id === 'proterozoic') {
    return [{ ...broad, rank: 'eon' }, containing(proterozoicEras, mya), containing(proterozoicPeriods, mya)];
  }
  const hierarchy = [interval(538.8, 'Phanerozoic', 'Fanerozoico', 'eon'), { ...broad, rank: 'era' }, containing(periods, mya)];
  if (mya <= 2.58) hierarchy.push(mya <= 0.0117
    ? interval(0.0117, 'Holocene', 'Olocene', 'epoch')
    : interval(2.58, 'Pleistocene', 'Pleistocene', 'epoch'));
  return hierarchy;
}
