# Dee Luxe Hub Enterprises

A Nigerian jewellery storefront built with React and Vite, using the supplied Dee Luxe Hub brand guidelines, palette, and bag mockup. Customers can filter, search, add products to a shopping bag, and send an order request via WhatsApp.

## Run locally

Install Node.js 18 or newer, then run:

```sh
npm install
npm run dev
```

The catalogue contains 11 products. Prices and availability can change. WhatsApp checkout sends an order request; payment and final delivery details are confirmed separately. The hero uses the supplied bag mockup.

## Supabase catalogue

The storefront reads active products from Supabase when configured; otherwise it uses the preview catalogue in `src/main.jsx`.

1. Create a Supabase project and run `supabase/schema.sql` in its SQL Editor. This creates/updates the products table, enables public reads of active products, and seeds the Dee Luxe Hub catalogue.
2. Copy `.env.example` to `.env.local` and fill in the project URL and publishable (or anon) key from the Supabase project settings.
3. Restart `npm run dev` to load the environment variables.

Add and update catalogue entries in the Supabase Table Editor. Public clients can only read active products; do not put a service-role key in the frontend. Product image paths currently point to files in `public/`.