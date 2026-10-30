# Discovery upgrade audit

## Architecture inspected before edits

The original application is dependency-free HTML/CSS and native ES modules. `src/app.js`
owns interaction/playback state, `src/ui.js` renders the event card, and `data/events.js`
was the complete source of truth. `src/copy.js` holds UI translations; event objects
hold their own EN/IT names, descriptions and uncertainty notes. `src/time.js` owns the
4540 Ma → 86400 second conversion. `src/eras.js` provides six broad colored intervals.

The “A MOMENT IN DEEP TIME” component is `article#event-card` in `index.html`.
The existing design uses an editorial serif hierarchy, paper/ink colors, fine SVG clock
geometry and open event layouts. Desktop places the clock beside the story; mobile
stacks them. Keyboard slider controls, focus outlines, polite event announcements,
reduced-motion playback, embed parameters and a generated file fallback already existed.

## Existing stops: 25, retained exactly

| ID | Age (Ma) | Semantic content mapping |
| --- | ---: | --- |
| earth | 4540 | Earth forms; hot surface, ancient minerals |
| moon | 4510 | Existing unmatched stop: giant-impact hypothesis, lunar recession |
| oceans | 4400 | Existing unmatched stop: zircon records, water versus breathable air |
| life | 3500 | Early microbial life and living stromatolites |
| photosynthesis | 2700 | Existing unmatched stop: oxygen from water, chloroplast ancestry |
| oxygen | 2400 | Great Oxidation and ocean iron chemistry |
| eukaryotes | 1800 | Mitochondrial ancestry and single-cell complexity |
| multicellular | 1600 | Existing unmatched stop: independent origins, division of labor |
| snowball | 720 | Cryogenian glaciation; not the much older Huronian glaciations |
| ediacaran | 575 | Unfamiliar body forms and soft-body preservation |
| cambrian | 538.8 | Trilobite senses/armour; geological duration |
| plants | 470 | Land before forests; later landscape engineering |
| ordovician | 443.8 | Sea-level fall and marine habitats |
| tetrapods | 370 | Existing unmatched stop: aquatic limbs, fin-to-arm inheritance |
| permian | 251.9 | Siberian volcanism and slow recovery |
| dinosaurs | 230 | Early competitors and living dinosaur descendants |
| mammals | 200 | Existing unmatched stop: coexistence and repurposed jaw bones |
| flowers | 140 | Dinosaur landscapes; cereals as flowering plants |
| kpg | 66 | Surviving birds; impact darkness and food webs |
| primates | 56 | Existing unmatched stop: shared traits and common ancestors |
| homo | 2.8 | Existing unmatched stop: older stone tools and multiple human species |
| sapiens | 0.3 | Genetic inheritance and long hunter-gatherer history |
| agriculture | 0.012 | Multiple domestications and human-shaped evolution |
| industry | 0.000266 | Fossil fuels as stored sunlight; unequal timescales |
| today | 0 | Recent glaciation, Holocene duration, moving continents |

The brief's Archean boundary, Huronian glaciations, Rodinia, first forests,
Carboniferous, Pangaea, first birds, PETM, Antarctic ice sheet and grassland stops
are not separate existing events. No markers were added to accommodate them.
Quaternary/Pleistocene/Holocene context is shown at existing late events instead.
The displayed count now comes from `events.length`; it is not a literal UI string.

## Data and editorial implementation

The existing array was split into two small chronological modules, then re-exported
through the same `data/events.js` entry point. There is no second ID-keyed fact lookup
or duplicate event timeline. Every event owns two independently renderable curiosities.
Optional detail sources override the inherited event source. Existing names, descriptions,
source URLs, uncertainty notes and exact ages are preserved.

The first detail is visible. Controls cycle deliberately, retain keyboard focus and
pause playback. Language changes preserve the selected detail; a new event resets it.
Only deliberate detail navigation announces the fact; frame-by-frame updates stay quiet.
All six comparisons use the existing constants/conversions, including the Holocene's
0.0117 Ma contextual duration; it is not a new stop. Human clocks show milliseconds.

## Scientific scope and source verification

Uncertain early dates remain flagged. Statements qualify giant-impact, early water,
Snowball extent and deglaciation interpretations. Extinction causes and recovery are
not represented as precise instantaneous events. The Homo sapiens caption keeps the
existing approximately 0.3 Ma convention. Industrial age remains anchored to 2026.

Geological ranks follow ICS terminology. Existing rounded broad boundaries (including
4000, 538.8 and 251.9 Ma) are retained for compatibility with the original clock.
Period subdivisions are an educational overview using conventional rounded values,
not a claim to reproduce every latest ICS numerical revision. At boundaries the younger
interval is displayed, with a short explanation. For precise current ages consult
https://stratigraphy.org/chart. Historical uncertainty is not removed by extra digits
in the clock: milliseconds illustrate proportion, not confidence in a fossil date.

A live NASA HTTPS check was refused by the managed egress proxy (403 CONNECT).
No attempt was made to bypass that policy. Consequently, external URL availability
and the latest chart could not be verified live. Added references are established
article paths; tests validate HTTPS syntax and each fact's source association, not
remote availability. Source links are user-triggered, so this does not block the app.

## Validation

Node tests cover all original ages/order, two facts per event, bilingual shape and length,
source association, localization structure, dynamic counts, hierarchy, computed context,
fractions, duration conversions, dial coordinates and safe transition interpolation.
Browser checks exercise every event and both facts in EN/IT, plus navigation, sources,
keyboard, drag, play/event pauses, reading pauses, reduced motion, embedding and the
standalone fallback over HTTP. Layouts: 320, 375, 390, 430, 768 and 1440 pixels in both themes.
The managed browser's file-navigation restriction remains documented in README.md.
