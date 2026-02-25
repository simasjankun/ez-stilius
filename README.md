# EŽ Stilius — E-commerce Store

A modern e-commerce store for handmade knitted, crocheted, and sewn products. Built as a headless commerce solution with a custom Next.js frontend.

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **next-intl** (i18n: Lithuanian, English)
- **Medusa.js** (backend — planned)
- **Stripe** (payments — planned)

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Network Access

```bash
npm run dev -- --hostname 0.0.0.0
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── app/[locale]/       # App Router pages with locale routing
├── components/
│   ├── layout/         # Header, navigation, mobile menu
│   └── ui/             # Shared UI components
├── constants/          # Contact info, site configuration
├── i18n/               # next-intl routing and request config
├── messages/           # Translation files (lt.json, en.json)
└── types/              # TypeScript type definitions
```

## Internationalization

Supported locales: `lt` (default), `en`

URL structure: `/lt/...`, `/en/...`

Translation files are located in `src/messages/`. All user-facing text is served through `next-intl` translation functions.
