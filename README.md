# Hanbok Girls

A responsive English/Korean/Chinese Hanbok rental booking demo for a Seoul venue.

## Run locally

```sh
npm install
npm run dev
```

Use the language switch in the header to preview English, Korean, or Chinese. The customer flow covers date, session duration, start time, group size, a fixed-price sample package, contact details, country of origin, preferred service language, and a mock full-payment or 20% deposit checkout. After mock checkout, guests enter measurements, optionally choose a sample color palette, and customize a layered Jeogori/Chima outfit with package-eligible hairstyle and accessories.

## Catalog and photos

Sample packages, Hanbok and hairstyle choices, wardrobe layers, prices, session lengths, and the three-customer concurrent capacity are defined in `src/booking.ts`. Replace these demo entries with the venue's real packages, catalog, sizing, inventory, and pricing.

Wardrobe options currently use color placeholders. Add real item photography to `public/images/` and connect it to the catalog when the venue supplies the images. The layered preview is an illustrative demo, not a product photograph.

## Demo limitations

- Reservations and customer details are stored in the current browser's local storage. They are not shared across devices and do not provide production-grade capacity or inventory locking.
- Package prices and wardrobe sizes are examples. Package totals are fixed before customization and do not change with outfit selections.
- Checkout is simulated; no payment is collected. Country, service-language, and SMS-consent fields are demo data only.
- Personal-color choices are manual sample suggestions. No photo is captured or analyzed, and no AI service is connected.
- The confirmation QR contains only the booking code. No email, SMS, live check-in, or staff dashboard is connected.
- Choose a backend, payment gateway, SMS and email providers, venue address, real catalog/inventory, and data-retention/privacy rules before accepting customer reservations.

## Checks

```sh
npm test
npm run lint
npm run build
```
