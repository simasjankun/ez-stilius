# EŽ Stilius

> Rankų darbo gaminiai su meile — an e-commerce storefront for Lithuanian handmade goods artisan Eglė Žemgulienė.

Headless commerce frontend built with Next.js 15, designed to feel warm, artisanal, and elegant. Categories, products, and translations are powered by a live Medusa v2 backend.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| i18n | next-intl — `lt` (default), `en` |
| Backend | Medusa v2 |
| Fonts | Playfair Display + DM Sans |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Features

- **Dynamic navigation** — Mega menu (desktop) and accordion menu (mobile) with categories and subcategories fetched live from Medusa API
- **Full i18n** — Lithuanian and English, including Medusa category translations (`lt-LT` / `en`)
- **Server components** — Header, Footer, and CategoriesSection fetch data server-side with 5-minute cache
- **Shop** — filtering by category, color, and sort order with URL params; load more pagination
- **Subcategory routing** — `/shop/[category]/[subcategory]` with API validation
- **Contact form** — via Resend API with graceful fallback when unconfigured
- **Cart drawer** — slide-in cart with React Context, ready for Medusa checkout integration
- **Search overlay** — desktop panel + mobile full-screen
- **Responsive** — mobile-first, with safe-area insets for notched iPhones

---

## Project Structure

```
src/
├── app/
│   ├── globals.css                  # Tailwind theme, palette, keyframes
│   ├── api/contact/route.ts         # Contact form API (Resend)
│   └── [locale]/
│       ├── layout.tsx               # Root layout — fonts, i18n, CartProvider
│       ├── page.tsx                 # Homepage
│       ├── shop/
│       │   ├── page.tsx             # All products
│       │   └── [category]/
│       │       ├── page.tsx         # Category page
│       │       └── [subcategory]/
│       │           └── page.tsx     # Subcategory page
│       ├── shop/product/[slug]/
│       │   └── page.tsx             # Product detail page
│       ├── about/page.tsx
│       ├── contacts/page.tsx
│       ├── privacy/page.tsx
│       └── terms/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header/
│   │   │   ├── HeaderServer.tsx     # Async server component — fetches categories
│   │   │   ├── Header.tsx           # Client shell — scroll behavior
│   │   │   ├── Navigation.tsx       # Desktop nav
│   │   │   ├── MegaMenu.tsx         # Full-width dropdown with category columns
│   │   │   ├── MobileMenu.tsx       # Accordion mobile menu
│   │   │   ├── TopBar.tsx           # Contact bar (desktop only)
│   │   │   ├── SearchOverlay.tsx    # Search panel
│   │   │   └── CartDrawer.tsx       # Slide-out cart
│   │   └── Footer/Footer.tsx        # Server component — categories from API
│   ├── sections/                    # Page sections (Hero, Categories, etc.)
│   ├── shop/                        # ProductGrid, FilterBar, MobileFilterDrawer
│   ├── product/                     # Gallery, Info, Selectors, Accordion
│   ├── contacts/                    # ContactInfo, ContactForm
│   └── ui/                          # ProductCard, Dropdowns, Breadcrumb, FadeIn
├── lib/
│   ├── medusa.ts                    # medusaFetch() helper
│   └── categories.ts               # getCategories() + MedusaCategory type
├── constants/
│   ├── contact.ts                   # Phone, email, address, social, hours
│   ├── colors.ts                    # Available product colors with hex values
│   └── placeholderProducts.ts       # 16 placeholder products (pre-Medusa catalog)
├── context/CartContext.tsx          # Cart state
├── i18n/routing.ts                  # next-intl routing — exports Link, useRouter
├── messages/
│   ├── lt.json
│   └── en.json
└── middleware.ts                    # Locale detection and redirect
```

---

## Getting Started

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.ezstilius.lt
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key
RESEND_API_KEY=your_resend_key   # optional — contact form
```

```bash
npm run dev -- -H 0.0.0.0
```

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `cream` | `#FAF8F5` | Background |
| `charcoal` | `#2D2A26` | Primary text |
| `olive` | `#8B8424` | Accent, CTAs |
| `sand` | `#E8E0D4` | Borders, dividers |
| `warm-gray` | `#8A8478` | Secondary text |

---

## i18n

Default locale is `lt` (no prefix in URL). English is at `/en/...`.

Category names and descriptions are served in the correct language via Medusa's Translation Module — pass `locale=lt-LT` or `locale=en` as a query parameter.

---

## Medusa Integration

Categories are fetched server-side on every request (revalidated every 5 minutes). The frontend reads:

- `/store/product-categories` — navigation, filters, category pages
- CORS is configured via `STORE_CORS` environment variable on the Medusa server
