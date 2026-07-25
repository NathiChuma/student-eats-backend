# Student Eats — Backend

Express API server for the [Student Eats](https://github.com/NathiChuma/student-eats) food ordering app, backed by Firebase Admin SDK / Firestore.

**Frontend repo:** https://github.com/NathiChuma/student-eats

## Features

- Vendor data endpoints (list, fetch by ID)
- Order creation and management
- Firebase Admin SDK integration with Firestore as the data store
- Environment-based service account configuration

## Tech Stack

- **Node.js** + **Express.js**
- **firebase-admin** (Firestore)
- **dotenv** for environment configuration

## Project Structure

```
.
├── firebase.js        # Firebase Admin initialization + Firestore export
├── routes/             # Express route handlers
├── server.js           # App entry point
├── .env                # Local environment config (not committed)
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn — adjust commands below accordingly)
- A Firebase project with Firestore enabled
- A Firebase service account key (Project Settings → Service Accounts → Generate new private key)

### Installation

```bash
git clone https://github.com/NathiChuma/student-eats-backend.git
cd student-eats-backend
npm install
```

### Environment Variables

Create a `.env` file in the project root using the values from your Firebase service account JSON:

```dotenv
TYPE="service_account"
PROJECT_ID="your-project-id"
PRIVATE_KEY_ID="your-private-key-id"
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR\nKEY\nHERE\n-----END PRIVATE KEY-----\n"
CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
CLIENT_ID="your-client-id"
AUTH_URI="https://accounts.google.com/o/oauth2/auth"
TOKEN_URI="https://oauth2.googleapis.com/token"
AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-url"
UNIVERSE_DOMAIN="googleapis.com"
PORT=3000
```

> **Never commit `.env`.** It contains a private key with full admin access to your Firestore database. Make sure `.env` is listed in `.gitignore` before your first commit.

### Running Locally

```bash
npm start
```

Or, if a dev script with auto-reload is configured (e.g. via `nodemon`):

```bash
npm run dev
```

The API will be available at `http://localhost:3000` by default.

## API Endpoints

> Update this section with your actual routes and request/response shapes.

| Method | Endpoint            | Description                |
|--------|----------------------|-----------------------------|
| GET    | `/api/vendors`       | List all vendors            |
| GET    | `/api/vendors/:id`   | Get a single vendor by ID   |
| POST   | `/api/addOrder`      | Create a new order          |

## Security Notes

- The Firebase service account key grants full read/write access to Firestore — treat it as a production secret.
- If a key is ever exposed (committed to git, pasted in a chat, shared in a screenshot, etc.), revoke it immediately from the Firebase console and generate a new one.
- CORS should be locked down to the deployed frontend's origin in production rather than left open.

## Related

Frontend client: [student-eats](https://github.com/NathiChuma/student-eats)

## License

MIT © Nathi Chuma