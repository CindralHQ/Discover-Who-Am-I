# WooCommerce Product Test Page

The `/woocommerce-test` route renders a diagnostic view that fetches products directly from your WordPress + WooCommerce
store using the official REST API.

## Environment variables

Add the following to `.env.local`:

```
WC_STORE_URL=https://discoverwhoami.com/
WC_CONSUMER_KEY=ck_15c7bcdab20f242dcce207149028240a8b06cd45
WC_CONSUMER_SECRET=cs_81b9f63f2929327d9115ec9dec2b4e12bb0751d5
```

Steps:

1. In the WooCommerce dashboard open `Advanced → REST API` and create a new key with **Read** permissions.
2. Copy the consumer key/secret into the variables above.
3. Use the public HTTPS URL of the WordPress install for `WC_STORE_URL`.

Once saved, restart `next dev` so the server components can pick up the new env values. Visit `http://localhost:3000/woocommerce-test`
to confirm the API connection and inspect any errors returned from WooCommerce.
