# Hanbok Girls

A responsive English/Korean/Chinese Hanbok rental booking experience for a Seoul venue.

## Run locally

```sh
npm install
npm run dev
```

Use the language switch in the header to view English, Korean, or Chinese. The customer flow covers date, session duration, start time, group size, Hanbok tier, optional per-guest makeup, contact details, country of origin, preferred service language, and a separate payment step for a full-payment or 20% deposit selection. Rental durations are 2 hours, 4 hours, or Full Day. Full-day bookings can start every 30 minutes from 9:00 AM until 3:30 PM and return by 7:00 PM.

Hanbok tier rates are per guest:

| Tier | 2 hours | 4 hours | Full Day |
| --- | ---: | ---: | ---: |
| Special | ₩20,000 | ₩30,000 | ₩60,000 |
| Premium | ₩30,000 | ₩40,000 | ₩70,000 |
| Luxury | ₩40,000 | ₩50,000 | ₩80,000 |

Full-day rates are flat for every start time. Optional makeup is charged in addition to the Hanbok tier: Men's makeup ₩70,000 or Women's makeup ₩100,000 per guest. Optional shoe rental remains ₩15,000 per guest.

After the payment step, guests enter measurements and can upload a clear face photo for an on-device preview. A short questionnaire supplies curated color suggestions that reorder the wardrobe. The photo itself is not analyzed or saved with the booking. Guests can then customize a layered Jeogori/Chima outfit with optional hairstyles and accessories.

## Catalog and photos

Hanbok tiers and rates, makeup prices, hairstyle choices, wardrobe layers, session lengths, and the three-customer concurrent capacity are defined in `src/booking.ts`. Replace these entries with the venue's real catalog, sizing, inventory, and pricing.

Wardrobe options currently use color placeholders. Add real item photography to `public/images/` and connect it to the catalog when the venue supplies the images. The layered preview is an illustrative demo, not a product photograph.

## Demo limitations

- Reservations and customer details are stored in the current browser's local storage. They are not shared across devices and do not provide production-grade capacity or inventory locking.
- Hanbok prices, makeup and shoe rates, and wardrobe sizes are sample data. Makeup and shoes are included in the total only when selected; hairstyle, accessory, and outfit customization after payment does not change the total.
- The payment page runs a simulated completion step and records the selected amount in the local booking. It does not collect card details or process funds. Country, service-language, and reminder-preference fields are local data only.
- Uploaded photos are previewed locally and discarded when the customization page closes. Questionnaire answers determine curated palette suggestions; no photo analysis or AI service is connected.
- The confirmation QR contains only the booking code. No email, SMS, live check-in, or staff dashboard is connected.
- Choose a backend, payment gateway, SMS and email providers, venue address, real catalog/inventory, and data-retention/privacy rules before accepting customer reservations.

## Checks

```sh
npm test
npm run lint
npm run build
```
