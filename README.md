# Student Eats Backend (TypeScript)

Express + Firebase Admin (Firestore) API server for the Student Eats app. This is a TypeScript rewrite of the original JavaScript backend — same routes, same request/response shapes the frontend already expects, just typed and with a few real bugs fixed along the way (see below).

## Setup

```bash
npm install
cp .env.example .env
# fill in .env with your Firebase service account values
npm run dev
```

- `npm run dev` — runs the server with `tsx watch` (auto-restarts on file changes)
- `npm run build` — compiles `src/` to `dist/`
- `npm start` — runs the compiled server from `dist/server.js` (run `build` first)
- `npm run typecheck` — typechecks without emitting

The server listens on `PORT` (default `3000`) and only accepts CORS requests from `CLIENT_ORIGIN` (default `http://localhost:8080`, i.e. the Vite dev server for `student-eats`).

## Environment variables

See `.env.example`. Only three Firebase values are actually required — `PROJECT_ID`, `PRIVATE_KEY`, `CLIENT_EMAIL` — copied from the service account JSON you get from **Firebase Console → Project Settings → Service Accounts → Generate new private key**. (The rest of that downloaded JSON — `auth_uri`, `client_id`, etc. — isn't used by the Admin SDK for this kind of credential, so it's not needed here.)

## Routes

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Basic liveness check |
| POST | `/auth/signup` | Student sign up |
| POST | `/auth/signin` | Student sign in |
| POST | `/vendors/signup` | Vendor sign up |
| POST | `/vendors/signin` | Vendor sign in |
| GET | `/vendors/getAllVendors` | List all vendors (public) |
| GET | `/vendors/getVendorStats/:vendorId` | Order stats for a vendor's dashboard |
| GET | `/vendors/:id` | Vendor detail, including menu items + add-ons |
| POST | `/orders/addOrder` | Create an order |
| GET | `/orders/getUserOrders/:email` | A student's order history |
| GET | `/orders/:id` | A single order by id |

See `test.rest` for working example requests (use the REST Client extension in VS Code, or copy into your HTTP client of choice).

## Structure

```
src/
  types.ts                    - shared interfaces (Vendor, Order, MenuItem, etc.)
  firebase.ts                 - Firebase Admin / Firestore initialization
  server.ts                   - Express app entry point
  routes/
    authRoutes/                - student signup/signin
    vendorRoutes/               - vendor signup/signin, listing, detail, stats
    orderRoutes/                - create/read orders
```

## What changed vs. the original JS backend

This is a straight behavioral port — the API surface is unchanged — except for the following, which were real bugs in the original code, not style preferences:

1. **Password hashes were being leaked in API responses.** `GET /vendors/getAllVendors` and `GET /vendors/:id` were spreading the raw Firestore vendor document into the response, which included the bcrypt `passwordHash`. Anyone browsing the site's vendor list or a vendor's page could pull every vendor's password hash straight out of the network tab. `POST /vendors/signup`'s response did the same for the vendor it had just created. All three now strip `passwordHash` before responding.
2. **Mixed module systems.** The original `firebase.js` used ESM `import`/`export` syntax while everything else used CommonJS `require`— it happened to work because of Node's newer synchronous ESM interop, but it was fragile and would break on older Node versions. Everything now compiles to a single consistent module system via `tsc`.
3. **Defensive access to `vendor.bankAccount`.** The original sign-in handler accessed `vendor.bankAccount.accountName` directly, which would throw if a vendor document was ever missing that field. Now uses optional chaining with fallbacks.
4. **Inconsistent `createdAt` types.** Students were stored with a Firestore `Date` object, vendors with an ISO string. Both now consistently store an ISO string, matching how order timestamps are compared elsewhere in the app (`getVendorStats`).
5. **Configurable port and CORS origin.** Both now come from `PORT` / `CLIENT_ORIGIN` env vars instead of being hardcoded, so this can actually be deployed somewhere other than `localhost`.
6. Added a `GET /health` endpoint, useful for uptime checks / deployment platforms that expect one.

## Known gaps (not in scope for this rewrite, carried over from the original)

These were flagged in the project handover doc and still apply — this rewrite ports the existing behavior faithfully, it doesn't add missing features:

- No routes yet for vendors to manage their own menu items or add-ons (create/update/delete) — the frontend's vendor menu page still uses local mock state.
- No route yet to fetch a vendor's own order list or update an order's status — the frontend's vendor orders page still uses local mock state.
- No server-side Paystack transaction verification before an order is trusted as paid.
- No real auth/session tokens — signup/signin just return the student/vendor record on success, and the frontend stores it in `localStorage`. There's no session expiry or protected-route middleware here to enforce it.
