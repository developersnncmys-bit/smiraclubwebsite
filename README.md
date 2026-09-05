# Smira Club — website

The customer-facing app, built from the Figma prototype. Next.js 16 (App
Router), React 19 and Tailwind. One codebase, two shapes: the phone screens
exactly as designed, and a proper desktop layout on top.

## Running it

```bash
cd smirawebsite
npm install
npm run dev          # http://localhost:3000
```

`cp .env.example .env.local` if you want to point it at the API. Without it
the site runs on its own content, which is how it ships.

## Mobile and desktop

The client's Figma is a phone. A phone layout stretched to 1440px is not a web
app, so the breakpoints do real work rather than just reflowing:

| | Phone (< 1024px) | Desktop (≥ 1024px) |
|---|---|---|
| Navigation | bottom tab bar — Home, Wishlist, AI Search, Profile, More | top header with links, search, account button |
| Header | city · logo · bell, as drawn | logo, nav, city, search, notifications, account |
| Hero | full-bleed, 290px | rounded panel inside the shell, 400px |
| Search | tabs above, fields stacked | one card, fields on a single line, overlapping the hero |
| All Services | 8 tiles, "View more" reveals the rest | all 16, eight across |
| Benefits / stories | 2 across | 4 across |
| Offers / recent | horizontal rails | grids |
| Footer | none — the links live under More | four columns |

Between 768 and 1024 there is a drawer, so tablets are not stranded with a
phone's bottom bar and no navigation.

## What is on the home screen

Everything the prototype scrolls through, in order: the membership hero
carousel with its `1/3` counter, the four search tabs and their form, All
Services, Recent Searches, Member Benefits, "Explore Membership Plans", the
crowned Claim Your Gift banner, Grab Offers with its four tabs, Watch &
Explore, and the "Your next adventure starts with Smira Club" sign-off.

## Layout

```
src/
  app/
    layout.js          header, main, footer, bottom bar
    page.js            the home screen
    membership/        plans, built out
    free-stay/ hotels/ packages/ villas/ offers/ …
  components/
    layout/            Header, BottomNav, Footer, CityPicker
    home/              one file per section of the home screen
    ui/                Logo, Icon, Section, PageHead, ComingSoon
  lib/
    content.js         every word and image the home screen uses
    api.js             a client for the Smira API — ready, not wired
    format.js          money, dates, class names
```

`lib/content.js` is deliberately the only place the copy lives, so swapping
any of it for the API later is a one-file job.

## What is real and what is not

**Real:** the home screen, the membership plans page, the header and both
navigations, the city picker, the search form (it builds a query and routes to
`/search`), every carousel and tab, and the 404.

**Shells:** free-stay, hotels, packages, villas, offers, wishlist, search,
profile, more, stories and notifications exist so every link in the design
goes somewhere, and say plainly that their screen is still to be designed.

**Not wired:** `lib/api.js` can talk to the backend in `smirabackend`, but
nothing calls it. The site and the API were built separately, and connecting
them is its own piece of work.

**Images** are Unsplash placeholders chosen to match the Figma. Swap the URLs
in `lib/content.js` for the real photography. The service tiles use Lucide
icons in place of the custom illustrations in the design — those need
exporting from Figma as SVGs.

## Checks

```bash
npm run build        # 16 routes, all static, home is ~121 kB first load
npm audit            # 0 vulnerabilities
```
