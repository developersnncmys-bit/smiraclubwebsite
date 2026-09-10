# The All Services illustrations

Drop a file in here named after the service **key** and that tile stops
drawing its Lucide icon and shows your artwork instead. Nothing else to
change. A key with no file keeps its icon, so the grid never looks
half-finished while the set is still being exported.

`.svg` is preferred, then `.webp`, `.png`, `.avif`, `.jpg`.

| Filename | Tile | What the artwork shows |
|---|---|---|
| `free-stay.*` | Free Stay | the house with the bed inside |
| `hotel.*` | Hotel Booking | the HOTEL building |
| `india.*` | India package | the Taj Mahal with the suitcase and plane |
| `international.*` | International Trip | the globe, passport and landmarks |
| `group.*` | Group Departure | the four travellers with the flag |
| `island.*` | Island Trip | the beach daybed under the palms |
| `villa.*` | Villa & Homestays | the villa with the pool |
| `camping.*` | Camping Booking | the tent with the CAMP signpost |
| `support.*` | Travel Support | the agent with the headset |
| `restaurant.*` | Restaurant Offers | the RESTAURANT OFFERS storefront |
| `games.*` | Games Zone | the PLAY arcade cabinet and pad |
| `salon.*` | Saloon & Spa | the salon chair and mirrors |
| `waterpark.*` | Waterpark & Themepark | the slides and the coaster |
| `adventure.*` | Adventure | **still to come** |
| `entertainment.*` | Entertainment | **still to come** |
| `health.*` | Health | **still to come** |

## Export them with a transparent background

The tiles are a light blue rounded square about 56-64px. Artwork sits on that
tile, so anything exported with a black background paints a black square in
the grid. Export transparent (SVG or PNG-24), square, with the subject
centred and a little breathing room.

## What is in here now

Thirteen tiles are on their artwork. **Adventure, Entertainment and Health**
have no file yet and are still drawing their Lucide icon — drop
`adventure.png`, `entertainment.png` and `health.png` in and they switch over
on the next build.

`_unassigned/` holds four illustrations that do not match any service in the
current list — a plane inside a checkmark, a plain house, a train and bus,
and a plain aeroplane. They are kept rather than deleted; rename one to a
service key to use it, or say where it belongs.
