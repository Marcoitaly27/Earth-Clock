# Decisions

- **A fixed 4540 Ma day.** Midnight is formation; 24:00 is today. The mapping is linear,
  not logarithmic. Fixed scale and fixed event ages make the educational model reproducible.
- **Precision inside, whole seconds outside.** Inverses keep fractional seconds. Display rounds
  the total before splitting it, so `23:59:59.9` correctly displays `24:00:00`.
  Agriculture and industry consequently share the displayed second but remain separate events.
- **ES modules and local files.** Browsers generally block module fetches from `file://`.
  HTTP uses native modules; direct opening loads a committed, generated classic-script fallback.
  No runtime compilation, eval, dependencies, or user build step is required. A parity test
  prevents source drift. The tiny maintenance script assumes explicit semicolons and single-line
  imports; keep source free of line comments because its whitespace compaction joins lines.
- **SVG dial, HTML controls.** SVG handles geometry; native buttons and range input provide
  keyboard semantics without reimplementing a slider. The range is the keyboard interface to
  the hand. Live announcements happen at events, not every animation frame.
- **Event clusters.** Marker angle always represents the actual age. Nearby events are staggered
  radially. The native event menu and card navigation provide precise access on small screens.
- **Era colors.** We show three eons and three eras as six broad geological intervals, using
  conventional rounded boundaries. Exact boundary ages use the younger interval.
- **Sources and uncertainty.** Linked reference articles are starting points, not claims of
  original research. Disputed origins carry bilingual uncertainty notes. A fossil milestone
  need not date the actual evolutionary origin. Approximate dates stay explicitly approximate.
- **Human perspective.** “Humans” means Homo sapiens at 0.3 Ma: approximately 5.71 seconds
  before midnight. The genus Homo is separately represented at 2.8 Ma.
- **Playback.** A full day takes 90 seconds of travel, plus event pauses. Crossings use exact
  event ages so several human milestones inside one displayed second are not skipped.
  Reduced-motion playback advances discretely, pausing on intervening events. Hidden tabs pause.
- **Privacy and embedding.** No analytics, storage, network assets, or parent-window messaging.
  A normal iframe isolates styles. Theme and language can be set explicitly; iframe height is
  controlled by the host. Source links open a new tab with `noopener noreferrer`.
- **Validation limits.** Chromium interaction tests cover HTTP modules and the same standalone
  fallback loaded over HTTP. Managed browser policy blocks `file://` navigation, so an actual
  direct-file browser navigation could not be validated here. The page is designed for it.
- **Visual direction.** An editorial scientific atlas: warm paper, ink-green type, rust accents,
  a custom SVG globe engraving, fine instrument ticks, and open event layouts. Serif headings
  contrast with monospaced measurements. All artwork is local SVG/CSS; the paper texture is
  a tiny inline SVG tile. `styles/details.css` contains the visual treatment separately from
  the base layout and clock controls. Hover feedback is subtle and honors reduced motion.
