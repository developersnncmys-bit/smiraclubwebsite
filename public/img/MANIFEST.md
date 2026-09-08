# The fifteen images the home screen needs

Drop a real photo into `public/img/` using the **exact filename** below and it
replaces the placeholder — no code change needed. `.jpg`, `.png` and `.webp`
all work; the site prefers a photo and falls back to the `.svg` placeholder
only when no photo is there.

Run `npm run img:check` at any time to see which slots are still placeholders.

## Hero carousel — the three slides behind "UP TO 40% OFF"

| Filename | What the Figma shows | Best size |
|---|---|---|
| `hero-benefits.*` | The lit hotel and pool at dusk — slide 1 | 2400 × 1000 |
| `hero-freestay.*` | A hotel room with a city view — slide 2 | 2400 × 1000 |
| `hero-villas.*` | A villa with a private pool — slide 3 | 2400 × 1000 |

Wide and short. The headline sits over the left third, so keep that side
uncluttered or the white text gets hard to read.

## Member Benefits — the four cards

| Filename | What the Figma shows | Best size |
|---|---|---|
| `benefit-stay.*` | "Complimentary **Hotel Stay** · Only Pay For Food" — the room with the window | 900 × 1200 |
| `benefit-off.*` | "Up To **40% OFF** · On Luxury Hotels" — the curved resort at sunset | 900 × 1200 |
| `benefit-experiences.*` | "Best Travel **Experiences** · Curated For Members" — the woman on the garden path | 900 × 1200 |
| `benefit-special.*` | "Offers For **Specials Days** · Curated For Members" — the candlelit dinner canopy | 900 × 1200 |

Portrait. A dark gradient covers the bottom third for the caption.

## Grab Offers — the four banner cards

| Filename | What the Figma shows | Best size |
|---|---|---|
| `offer-weekend.*` | "WEEKEND GETAWAY · Perfect Escapes for your weekend" — the poolside pavilion | 1000 × 700 |
| `offer-seasonal.*` | "SEASONAL · Amazing Deals this season" | 1000 × 700 |
| `offer-salon.*` | Salon & Spa | 1000 × 700 |
| `offer-dining.*` | Restaurant offers | 1000 × 700 |

Only the right half of each card shows; the left half is the coloured panel
carrying the text.

## Watch & Explore — the four stories

| Filename | What the Figma shows | Best size |
|---|---|---|
| `story-bali.*` | "Uncover the hidden gems of the Bali" — the lake temple | 800 × 1000 |
| `story-dandeli.*` | "Dandeli Adventures Trip" — the white-water raft (has a play button) | 800 × 1000 |
| `story-srilanka.*` | "Must see wonders of Sri Lanka" — the train on the viaduct (has a play button) | 800 × 1000 |
| `story-kerala.*` | "A Charming Port City in Kerala" — the backwaters houseboat | 800 × 1000 |

Portrait.

## Also still to come from Figma

The sixteen **All Services** tiles (Free Stay, Hotel Booking, India package,
International Trip, Group Departure, Island Trip, Villa & Homestays, Camping
Booking, Travel Support, Restaurant Offers, Games Zone, Saloon & Spa,
Waterpark & Themepark, Adventure, Entertainment, Health) are custom
illustrations in the design. The site currently draws them with Lucide icons.
Export them as SVG into `public/img/services/` named after their key —
`free-stay.svg`, `hotel.svg`, `india.svg` and so on — and say the word, and
I will switch the tiles over.

The **Smira Club logo** is drawn in code for now. Export the real mark as
`public/img/logo.svg` and I will swap it in.

## Profile — the Become a Partner thumbnail

| Filename | What the Figma shows | Best size |
|---|---|---|
| `partner-property.*` | The palm-lined pool beside "Become a Partner" | 920 × 720 |

It renders small and wide (about 92 × 72), so keep the subject centred.

## AI Search — the prompt thumbnails and the two recommendations

| Filename | What the Figma shows | Best size |
|---|---|---|
| `ai-goa-resorts.*` | "Find best resorts in Goa for a weekend" — the thatched pool villa | 800 × 800 |
| `ai-lonavala-family.*` | "Suggest Family Activities in Lonavala" — the festoon lights at dusk | 800 × 800 |
| `ai-parasailing.*` | "Parasailing Adventure" — the orange canopy over the sea | 1000 × 700 |
| `ai-spa.*` | "Spa & Saloon Experience" — the head massage by the pool | 1000 × 700 |

The first two are square thumbnails beside the prompt text; the last two head
the recommendation cards at 4:3.
