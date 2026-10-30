import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function standaloneSource() {
  const files = ['src/time.js', 'data/model.js', 'data/precambrian.js', 'data/phanerozoic.js', 'data/events.js', 'src/eras.js', 'src/geology.js', 'src/copy.js', 'src/perspective.js', 'src/dial.js', 'src/transitions.js', 'src/curiosities.js', 'src/ui.js', 'src/playback.js', 'src/app.js'];
  const source = files.map(file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '').replace(/^export /gm, '').trim()).join('\n');
  return `/* Generated file-URL fallback. Edit source modules, then run node scripts/standalone.js. */\n(() => { ${source.split('\n').map(line => line.trim()).join(' ')} })();\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  writeFileSync(new URL('../standalone.js', import.meta.url), standaloneSource());
  console.log('Updated standalone.js from ES module sources.');
}
