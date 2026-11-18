# Hanbok Girls

A responsive English/Korean Hanbok rental booking demo for a Seoul venue.

## Run locally

```sh
npm install
npm run dev
```

Use the language switch in the header to preview Korean. The reservation flow lets guests choose a date, session duration, start time, group size, Hanbok, hairstyle, makeup, shoes and shoe size, bag, contact details, and a full-payment or 20% deposit option.

## Catalog and photos

Sample Hanbok and hairstyle choices, prices, session lengths, and the three-customer concurrent capacity are defined in `src/booking.ts`. Replace these demo entries with the venue's real catalog and pricing.

Each Hanbok option supports an optional `imageUrl` (for example, `/images/hanbok/spring-garden.jpg`). Put future photos in `public/images/` and set their paths in the catalog. The home-page collage and other service areas currently show deliberate photo placeholders.

## Demo limitations

- Reservations are stored in the current browser's local storage. They are not shared across devices and do not provide production-grade inventory locking.
- Confirmation amounts are examples only. No payment is collected.
- The QR contains a staff-preview link and can retrieve details only in the same browser that holds the demo booking.
- No SMS is sent. A production integration should schedule the 30-minute and 10-minute session-end reminders using an SMS provider.
- Choose a payment gateway, SMS provider, venue address, real catalog, and production backend before accepting customer reservations.

## Checks

```sh
npm test
npm run lint
npm run build
```
