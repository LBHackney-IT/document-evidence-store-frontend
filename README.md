# 📤 Hackney Upload frontend

This is the resident and staff-facing frontend for Hackney's new document and evidence store.

It's also known as **Hackney Upload**.

## 🧱 How it's made

It's a [Next.js](https://nextjs.org) app that works with:

- Hackney's [evidence platform API](https://github.com/LBHackney-IT/evidence-api)
- Hackney's [document platform API](https://github.com/LBHackney-IT/documents-api)
- Hackney's [Google oAuth service](https://github.com/LBHackney-IT/LBH-Google-auth)

It's built using the [Hackney Design System](https://design-system.hackney.gov.uk/).

## 🧐 What does it do?

This application has two sides: the _officer dashboard_ side, for council officers to log in and manage evidence, and the _resident_ side for residents to upload evidence.

### Officer Dashboard

_🔐 This side of the application is authenticated_

- **`/dashboard`** - The homepage for officers, which displays evidence requests that require attention from officers
  - **`/dashboard/requests`** - View the evidence requests which are waiting for resident action
  - **`/dashboard/requests/new`** - Send a new evidence request to a resident
  - **`/dashboard/resident/:id`** - View all evidence requests for particular resident
  - **`/dashboard/resident/:id/documents/:id`** - View the details of a particular document, and approve/reject it.

### Resident Flow

- **`/resident/:id`** - The start page of the resident upload flow for a specific evidence request
  - **`/resident/:id/upload`** - Upload documents
  - **`/resident/:id/confirmation`** - Upload confimation

## 💻 Running it locally

You need `node` and `npm` installed.

First, clone the repo

```bash
npm i
npm run dev-mock # boots the Next.js server and the mocks server
```

It'll be on [http://localhost:3000](http://localhost:3000).

### Logging in

First, you need a @hackney.gov.uk Google account in the right groups to log in. Speak to Hackney IT if you don't have these.

Next, you need to tell your computer to run the app from a hackney.gov.uk domain. Let's use `localdev.hackney.gov.uk`.

Add this line to your hosts file (Windows: `C:\Windows\System32\drivers\etc\hosts`, Mac: `/etc/hosts`):

```
127.0.0.1	localdev.hackney.gov.uk
```

When you next launch the app, it should be on `http://localdev.hackney.gov.uk:3000`.

If you have the right [environment config](#-configuration), login should now work.

## 🧪 Testing it

It uses Jest, `react-testing-library` and cypress for tests. Run them with:

```
npm run test:unit
npm run test:e2e:dev # requires server to be running
```

### Mock Server

The app comes with a [mock server](http://mocks-server.org) for mock requests to external APIs. It runs automcatically when you run the dev server.

Follow [guides](https://www.mocks-server.org/docs/guides-defining-fixtures/) on how to add new fixtures and behaviours.

It also comes with a [CLI](https://www.mocks-server.org/docs/plugins-inquirer-cli) to swap between behaviours during development, and a [Cypress integration](https://www.mocks-server.org/docs/integrations-cypress) to do within test suites.

## 🌎 Putting it on the internet

It's suitable for Heroku, Vercel, AWS, or any other Node.js hosting.

Pushes to the main branch will be automatically built and deployed to our staging environment.

Check the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🧬 Configuration

You can use a `.env` file to supply environment config locally. Create a fresh one with `cp .env.sample .env`.

| Variable                                  | Description                                                         | Example                             |
| ----------------------------------------- | ------------------------------------------------------------------- | ----------------------------------- |
| APP_URL                                   |                                                                     | http://localdev.hackney.gov.uk:3000 |
| HACKNEY_JWT_SECRET                        |                                                                     |                                     |
| HACKNEY_COOKIE_NAME                       |                                                                     | hackneyToken                        |
| NODE_ENV                                  |                                                                     | dev                                 |
| FEEDBACK_FORM_URL                         | The URL to a form where users can submit feedback about the service | https://example.com                 |
| EVIDENCE_API_BASE_URL                     |                                                                     | https://example.com/api/v1/         |
| EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET     |                                                                     |                                     |
| EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET  |                                                                     |                                     |
| EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_POST |                                                                     |                                     |
| EVIDENCE_API_TOKEN_RESIDENTS_GET          |                                                                     |                                     |

## Context and history

See the [Architectural Decision Log](/docs/adr).

## Gateways

Following [Hackney's API Playbook](https://github.com/LBHackney-IT/API-Playbook-v2-beta) we have a `Gateways` directory which:

> Holds the class responsible for establishing connection with the data source and retrieving/inserting/updating data queries to perform the given action against the data source

At the time of writing we have two Gateways which are for specific use cases:

- **`internal-api.ts`**

  - This acts as a means of routing client side requests, for example form submissions, to a proxy endpoint on the Next.js server.
  - Taking an example: we make `POST/api/evidence/evidence_requests` which Next.js routes to `pages/api/evidence/[..path].ts`
  - `[...path].ts` uses the Next.js [catch all routes](https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes) functionality.
  - This then forwards the request onto the EvidenceAPI using `evidenceApiGateway.request()`
  - In our example this is sent to `EVIDENCE_API_BASE_URL/api/v1/evidence_requests` and we attach the `Authorization` headers found in the `evidence-api.ts`'s `TokenDictionary`

- **`evidence-api.ts`**
  - This acts as a means of sending server side requests to the EvidenceAPI.
  - As discussed in [Architectural Decision Record 2](/docs/adr/0002-switch-from-client-side-api-requests-to-server-side.md) we use `getServerSideProps`

# License

[MIT](./LICENSE)
