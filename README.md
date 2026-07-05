# Max Value

Max Value is a mobile-first price comparison app for finding the lowest price per unit across product options. It is built as a client-side React app with a Liquid Glass-style interface, Thai and English localization, local browser history, share support, and light/dark theme persistence.

The app is useful for quick shopping comparisons such as choosing between different package sizes, bundle prices, or brands where the visible shelf price does not tell the full value story.

## What the app does

- Compares two or more product options by `price / size`.
- Shows the best value first, based on the lowest unit price.
- Highlights ties when multiple options have the same unit price.
- Shows how much cheaper the best option is compared with the most expensive option.
- Lets users add or remove options while keeping at least two comparison rows.
- Saves comparisons to browser history.
- Loads saved comparisons back into the form.
- Shares the winning result through the Web Share API, with a clipboard fallback.
- Supports Thai and English UI text.
- Persists theme and language preferences in `localStorage`.

## Tech stack

- React 19
- TypeScript 5.8
- Vite 6
- Tailwind CSS 4 through `@tailwindcss/vite`
- i18next and react-i18next for localization
- lucide-react for icons
- motion for UI transitions
- canvas-confetti for the footer easter egg

The project is a static frontend application. There is no backend service in the current source.

## Requirements

- Node.js
- npm

The GitHub Pages workflow uses Node 24. For local development, Codex recommends using the same major Node version when possible so local builds match CI more closely.

## Getting started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

The dev server is configured to listen on:

```text
http://localhost:3000
```

The Vite command also binds to `0.0.0.0`, which makes the dev server reachable from other devices on the same network when your machine and firewall allow it.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts Vite on port 3000 with host `0.0.0.0`. |
| `npm run build` | Builds the production bundle into `dist/`. |
| `npm run preview` | Serves the production build locally with Vite preview. |
| `npm run lint` | Runs TypeScript checking with `tsc --noEmit`. This is not an ESLint setup. |
| `npm run clean` | Removes `dist` and `server.js`. |

There is no `npm test` script configured at the moment.

## Configuration

The current application source does not require a Gemini API key or any other API key to run. The old generated README mentioned `GEMINI_API_KEY`, but the visible app code does not call Gemini.

Runtime-related settings in the current source:

| Setting | Where it is used | Purpose |
| --- | --- | --- |
| `DISABLE_HMR=true` | `vite.config.ts` | Disables Vite HMR and file watching. This is intended for AI Studio or agent-editing contexts where file watching can cause flicker or extra CPU use. |
| `base: './'` | `vite.config.ts` | Builds relative asset paths, which helps static hosting such as GitHub Pages. |

No `.env` file is required for normal local development.

## How comparison works

Each option has:

- `price`
- `size`
- optional row identity generated in the browser

The app treats an option as valid only when both price and size parse as positive numbers. For each valid option, it calculates:

```text
unit price = price / size
```

Results are sorted from lowest unit price to highest unit price. The lowest value is marked as best. When more than one option has the same lowest unit price, the result is displayed as an equal best value.

Savings are calculated for the best option against the most expensive unit price:

```text
savings percent = ((max unit price - min unit price) / max unit price) * 100
```

The UI formats currency and numbers with the `th-TH` locale and Thai baht currency formatting.

## Browser storage

Max Value stores data only in the browser:

| Key | Purpose |
| --- | --- |
| `maxValueHistory` | Saved comparison history. |
| `language` | Selected language, either Thai or English. |
| `theme` | Selected light or dark theme. |

History is capped at 50 saved comparisons. Clearing browser site data will remove saved history and preferences.

## Localization

Translation files live in:

```text
src/locales/en.json
src/locales/th.json
```

Thai is the default language. English is the fallback language.

## Project structure

```text
.
├── index.html
├── metadata.json
├── package.json
├── vite.config.ts
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── i18n.ts
│   ├── types.ts
│   ├── utils.ts
│   ├── components
│   │   ├── HistoryModal.tsx
│   │   ├── ItemInput.tsx
│   │   └── ResultCard.tsx
│   └── locales
│       ├── en.json
│       └── th.json
└── .github
    └── workflows
        └── deploy.yml
```

Key files:

- `src/App.tsx` owns app state, comparison calculation, history persistence, sharing, language switching, and theme toggling.
- `src/components/ItemInput.tsx` renders each price and size input row.
- `src/components/ResultCard.tsx` renders the best value result and the other ranked options.
- `src/components/HistoryModal.tsx` renders saved comparisons and supports loading, deleting, and clearing history.
- `src/i18n.ts` initializes i18next with Thai and English resources.
- `src/utils.ts` contains ID generation, Thai baht formatting, number formatting, and safe vibration support.
- `src/index.css` imports Tailwind, configures the Inter font, and defines the glass UI utility classes.
- `vite.config.ts` configures React, Tailwind, relative build paths, path aliasing, and optional HMR disabling.

## Deployment

The repository includes a GitHub Pages workflow at `.github/workflows/deploy.yml`.

The workflow:

- runs on pushes to `main` or `master`;
- can be run manually with `workflow_dispatch`;
- uses Node 24;
- installs npm dependencies;
- runs `npm run build`;
- uploads `dist/`;
- deploys the uploaded artifact to GitHub Pages.

For a manual static deployment, build the app and publish the `dist/` directory:

```bash
npm run build
```

## Development notes

- The app is fully client-side, so saved history is device/browser-specific.
- The Web Share API is used only when the browser supports it; otherwise the result text is copied to the clipboard.
- Vibration feedback is optional and safely ignored on browsers that do not support `navigator.vibrate`.
- `metadata.json` still includes AI Studio capability metadata, but the current source does not depend on a Gemini API call.
- The current GitHub Pages workflow removes `package-lock.json` before installing dependencies. That works, but `npm ci` with the lockfile would be more reproducible if deterministic deploys matter.
