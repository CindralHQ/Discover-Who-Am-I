# WooCommerce Product Test Page

The `/woocommerce-test` route renders a diagnostic view that fetches products directly from your WooCommerce storefront
using the official REST API.

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
3. Use the public HTTPS URL of the storefront for `WC_STORE_URL`.

Once saved, restart `next dev` so the server components can pick up the new env values. Visit `http://localhost:3000/woocommerce-test`
to confirm the API connection and inspect any errors returned from WooCommerce.

## Course API Test Page

The `/course-api-test` route signs into the LMS REST API and lists the first few courses returned by `/wp-json/learnpress/v1/courses`.

### Environment variables

```
LP_SITE_URL=https://your-course-domain.com
# Optional fallback service credentials (used when no one is signed in)
LP_API_USERNAME=api-user
LP_API_PASSWORD=application-password-or-app-password
```

### Signing in

1. Open `http://localhost:3000/course-login`.
2. Enter the LMS username and password that should be used to fetch course data. The safest option is to create a dedicated instructor/API user and generate an application password for that profile.
3. The login endpoint exchanges those credentials for a short-lived JWT via `/wp-json/learnpress/v1/token` and stores it in an HTTP-only cookie.
4. Visit `http://localhost:3000/course-api-test` to verify connectivity, or go straight to `http://localhost:3000/my-courses` to open your enrolled courses. Click “Log out” to clear the cookie.

Notes:

- The LMS does **not** provide plugin-specific keys—the token endpoint is the authentication mechanism.
- The optional `LP_API_USERNAME`/`LP_API_PASSWORD` env vars are only needed if you want the test page to fall back to a global service account when no one is signed in.

### My Courses page

Once signed in, `http://localhost:3000/my-courses` lists the courses tied to the logged-in profile and provides quick actions:

- `Open course` links to `/my-courses/<courseId>` where the outline and lesson content are rendered directly via the course API (each lesson can be opened via the `?lesson=<id>` querystring without leaving this site).
- Each lesson view also surfaces a Testimonials & Reviews card so learners can share reflections that are forwarded to the backend review endpoint.

Use `/my-courses` as the entry point you expose to end users (e.g., by linking to it from the header navigation).
