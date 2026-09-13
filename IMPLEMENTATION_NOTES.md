# Aurevyn production enhancement pass

This pass keeps the existing React/Vite storefront and extends it instead of replacing it.

## Frontend

- React.lazy + route-based code splitting in `src/App.jsx`.
- Cinematic preloader with falling fashion imagery and animated percentage.
- Framer Motion page transitions and interactions.
- Central GSAP/ScrollTrigger utilities in `src/animations`.
- Locomotive Scroll v5 integration with GSAP ticker synchronization.
- Home scroll-controlled canvas image sequence in `src/components/HomeCanvas`.
- Optional cinematic background video via `VITE_AUREVYN_VIDEO_URL`.
- Search overlay + live backend search suggestions.
- Global reduced-motion support.
- Magnetic buttons, animated desktop cursor, cursor image interaction and marquee.
- AVIF/WebP responsive source selection for the hero image.
- Lazy image loading/async decoding for non-critical images.
- `VITE_API_URL` environment-based API routing.

## Backend

- Auth/profile/password/address/preferences/activity/deletion-request APIs.
- Role middleware for admin-only operations.
- Rich Product model: brand, subcategory, images, videos, specs, fabric, variants, SKUs, variant stock/pricing, tags, featured/new/best-seller flags and related products.
- Product search, suggestions, filters, sorting and cursor pagination.
- MongoDB indexes for common product/order/user workloads.
- Persistent guest/authenticated cart with merge endpoint.
- Coupon system with validation and usage counts.
- Order pricing is recalculated server-side from current product/variant data instead of trusting browser totals.
- Stock is checked and decremented from live inventory during order creation.
- Public API response caching with Redis when `REDIS_URL` is configured, otherwise a small in-memory fallback.
- HTTP compression middleware (gzip/Brotli negotiation supported by the middleware).
- API rate limiting and common Express hardening.
- Admin bootstrap script: `npm run seed:admin`.

## Setup additions

1. Backend: run `npm install` so the new `compression` and optional `ioredis` dependencies are installed.
2. Copy `Backend/.env.example` to `.env` and fill the Mongo/JWT values.
3. Frontend: copy `Frontend/.env.example` to `.env`.
4. For the optional video section, set `VITE_AUREVYN_VIDEO_URL` to a video URL you are licensed to use.
5. To create an admin account, set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME`, then run `npm run seed:admin` from `Backend`.

## Verification performed

- All backend JavaScript files pass Node syntax checks.
- All frontend JS/JSX files parse successfully using the installed TypeScript parser.
- Relative frontend imports were checked and no missing local imports were found.

## Not hard-coded as fake capabilities

A CDN provider, production Redis instance, payment gateway, product review service, and licensed fashion MP4 are intentionally environment/configuration based rather than fake credentials or placeholder secrets. The app can still run without Redis and without the optional video source.
