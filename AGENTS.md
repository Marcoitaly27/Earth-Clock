# Project rules

- Keep this project dependency-free: HTML, CSS, and vanilla JavaScript only.
- Keep files small, normally under 200 lines.
- Make every function pure where possible; keep DOM and animation effects at the UI boundary.
- Write tests for all time conversions, including boundaries and round trips.
- Explain non-obvious decisions and trade-offs in docs/decisions.md.
- Keep code, comments, and documentation in English; provide Italian and English UI strings.
- If source modules change, refresh the committed file-URL fallback with `node scripts/standalone.js`.
- Use this checkout directly; do not create a worktree unless explicitly requested.
