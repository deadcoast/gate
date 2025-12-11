# Repository Guidelines

## Project Structure & Module Organization

- `client/src/extension.ts`: VS Code client entrypoint that registers Gate commands, webviews, and hooks into the language server; compiled output lands in `out/client.js`.
- `server/src/*`: Language server features for diagnostics, hovers, trace compilation, lattice previews, and evolution reports; keep request handlers thin and push logic into focused helpers.
- `syntaxes/gate.tmLanguage.json` and `gate-language-configuration.json`: Grammar, scopes, and editor behavior; update alongside any syntax changes.
- `docs/`: Language/design references and module notes; consult before altering grammar or semantics.
- `media/`: Webview assets used by panels (e.g., ELATTICE); generated JS goes to `out/` and should not be hand-edited.
- Root `tsconfig.json` wires client/server project references; shared `out/` directory is produced by TypeScript builds.

## Build, Test, and Development Commands

- `npm install`: Install TypeScript and VS Code LSP dependencies.
- `npm run compile`: Build client and server via `tsc -b`, emitting JS to `out/`.
- `npm run watch`: Incremental rebuild while editing.
- VS Code debug loop: open the repo, start `npm run watch`, then press `F5` (Launch Extension) to spin up an Extension Development Host. Use the Command Palette to trigger `Gate: Compile to Trace`, `Gate: Render ELATTICE`, etc., against a `.gate` file.

## Coding Style & Naming Conventions

- TypeScript strict mode, ES2020, CommonJS. Keep 2-space indentation, semicolons, single quotes, and arrow functions consistent with existing files.
- camelCase for functions/variables; PascalCase for types/classes; filenames follow the feature (`gateHover.ts`, `gateTraceEngine.ts`).
- Prefer small, pure utilities inside `server/src` and keep client-side glue in `client/src`. Avoid editing generated files under `out/`.
- JSON grammar/config updates should stay minimal and well-scoped; avoid trailing commas to match current style.

## Testing Guidelines

- No automated test harness yet; validate changes by running the extension (F5) and exercising compilation, hover, diagnostics, and lattice previews on representative `.gate` documents.
- If adding tests, co-locate `.spec.ts` files near modules or under `server/src/__tests__`, and add an `npm test` script to wire the runner. Keep fixtures in `server/src/assets` or a new `fixtures/` folder.

## Commit & Pull Request Guidelines

- Use concise, imperative commit subjects; Conventional Commit prefixes are welcome (e.g., `feat: add lattice webview`).
- PRs should include a short summary, user-facing impact, manual test notes (commands run and `.gate` scenarios tried), and screenshots/GIFs for webviews or ceremonial UI changes.
- Link related issues and call out any grammar or doc updates needed in `docs/` when behavior shifts.
