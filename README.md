# EŽ Stilius — E-commerce Store

A premium e-commerce store for handmade knitted, crocheted, and sewn products. Built as a headless commerce solution with a custom Next.js frontend, designed to feel warm, artisanal, and elegant — like walking into a cozy handmade boutique.

## Tech Stack

- **Next.js 15** (App Router, `src/` directory)
- **TypeScript** (strict mode)
- **Tailwind CSS 4** (custom theme with handcrafted color palette)
- **next-intl** (full i18n: Lithuanian, English)
- **Lucide React** (elegant, thin-line icons)
- **Google Fonts** — Playfair Display (serif) + DM Sans (sans-serif)
- **Medusa.js** (backend — planned)
- **Stripe** (payments — planned)

## Features

### Header & Navigation
- **TopBar** with contact info (phone, locale-aware email) and language switcher
- **Desktop navigation** with logo, nav links, search icon, and cart icon
- **Mega Menu** — full-width dropdown on "Shop" hover with category cards, images, hover zoom effect, and gradient overlays
- **Sticky behavior** — TopBar hides on scroll, main nav becomes sticky with backdrop blur and shadow

### Mobile Menu
- Premium editorial-style full-screen overlay with slide-in animation
- Serif typography (Playfair Display), generous spacing, no divider lines
- **Shop sub-menu** with horizontal slide transition between panels (not accordion)
- Staggered fade-in animation on nav links
- Contact info and language switcher (LT / EN with dot separator) pinned to bottom
- `env(safe-area-inset-bottom)` for notched iPhones
- Body scroll lock when open

### Search Overlay
- Desktop: centered panel drops down from header with backdrop blur
- Mobile: full-screen overlay
- Large elegant input with auto-focus and olive focus border
- Popular search tags as rounded pills
- "Coming soon" state with sparkle icon when typing
- Close via Escape key, backdrop click, or X button

### Cart Drawer
- Slide-from-right drawer with backdrop blur
- Empty state with large icon, warm copy, and CTA to shop
- Full cart UI structure ready for Medusa integration (item cards, quantity controls, sticky footer with total and checkout)
- React Context (`CartContext`) for state management
- Cart badge in header hides when count is 0

### Pages & Heroes
- **HomeHero** — full-viewport hero with warm gradient, radial olive glow, subtle textile pattern overlay, staggered fade-in animations, and olive CTA button
- **PageHero** — compact reusable hero with breadcrumbs, title, and optional subtitle
- All page routes: Home, Shop, Shop/[category], About, Contacts
- Dynamic category pages with `generateStaticParams`

### Design System
- Custom color palette: cream, olive, charcoal, sand, warm-gray
- Serif + sans-serif font pairing
- Consistent animations (`heroFadeUp` keyframes)
- Semantic HTML throughout (`<header>`, `<nav>`, `<main>`, `<section>`)

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
├── app/
│   ├── globals.css                 # Tailwind theme, colors, fonts, keyframes
│   └── [locale]/
│       ├── layout.tsx              # Root layout with fonts, i18n, CartProvider
│       ├── page.tsx                # Home page with HomeHero
│       ├── shop/
│       │   ├── page.tsx            # Shop listing with PageHero
│       │   └── [category]/
│       │       └── page.tsx        # Dynamic category page
│       ├── about/
│       │   └── page.tsx            # About page
│       └── contacts/
│           └── page.tsx            # Contacts page
├── components/
│   ├── layout/
│   │   ├── Header/
│   │   │   ├── Header.tsx          # Main header with sticky scroll behavior
│   │   │   ├── TopBar.tsx          # Contact bar (hidden on mobile)
│   │   │   ├── Navigation.tsx      # Desktop nav with mega menu
│   │   │   ├── MegaMenu.tsx        # Full-width category dropdown
│   │   │   ├── MobileMenu.tsx      # Premium full-screen mobile menu
│   │   │   ├── LanguageSwitcher.tsx # LT | EN toggle
│   │   │   ├── SearchOverlay.tsx   # Search panel with popular tags
│   │   │   └── CartDrawer.tsx      # Slide-out cart drawer
│   │   └── index.ts
│   ├── sections/
│   │   ├── HomeHero.tsx            # Homepage hero section
│   │   └── PageHero.tsx            # Reusable inner page hero
│   └── ui/
│       └── Breadcrumb.tsx          # Accessible breadcrumb navigation
├── constants/
│   ├── contact.ts                  # Phone, emails, address, social links
│   └── categories.ts              # Category slugs and translation key mapping
├── context/
│   └── CartContext.tsx             # Cart state management (React Context)
├── i18n/
│   ├── request.ts                  # next-intl server config
│   └── routing.ts                  # Locale routing and navigation helpers
├── messages/
│   ├── lt.json                     # Lithuanian translations
│   └── en.json                     # English translations
├── middleware.ts                    # Locale redirect middleware
└── types/
    └── index.ts                    # Shared TypeScript types
```

## Internationalization

Supported locales: `lt` (default), `en`

URL structure: `/lt/...`, `/en/...`

All user-facing text is served through `next-intl` translation functions — zero hardcoded strings. Translation files are located in `src/messages/`.

## Categories

| Slug | LT | EN |
|------|----|----|
| `clothing` | Drabužiai | Clothing |
| `sewing-supplies` | Priedai rankdarbiams | Craft supplies |
| `accessories` | Aksesuarai | Accessories |
| `interior-gifts` | Interjero detalės / Dovanų idėjos | Interior details / Gift ideas |
