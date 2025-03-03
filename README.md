# 📤 Hackney Upload frontend

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/LBHackney-IT/document-evidence-store-frontend/tree/main.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/LBHackney-IT/document-evidence-store-frontend/tree/main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_document-evidence-store-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_document-evidence-store-frontend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_document-evidence-store-frontend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_document-evidence-store-frontend)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_document-evidence-store-frontend&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_document-evidence-store-frontend)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_document-evidence-store-frontend&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_document-evidence-store-frontend)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_document-evidence-store-frontend&metric=bugs)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_document-evidence-store-frontend)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_document-evidence-store-frontend&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_document-evidence-store-frontend)

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
  - **`/resident/:id/upload`** - Upload documents (see [File Uploads](#file-uploads) for more information on accepted file types)
  - **`/resident/:id/confirmation`** - Upload confimation

## 💻 Setup

1. Install [Docker][docker-download].
2. Install [`nvm`](https://formulae.brew.sh/formula/nvm), [`node` v20](https://github.com/nvm-sh/nvm) and `npm` (included in `node`).
3. Clone this repository.
4. Open it in your IDE.

## 💻 Development

In order to run the frontend locally, you will first need access to the environment variables stored in 1Password. Please contact another developer on the Document Evidence Service Team to gain access.

TO NOTE: To make local calls to an API, you will also need to clone the two API repos [documents-api](https://github.com/LBHackney-IT/documents-api) and [evidence-api](https://github.com/LBHackney-IT/evidence-api). Follow the instructions in their READMEs to get them running (along with their database).

Once you have the environment variables and the APIs and database container running, navigate via the terminal to the root of document-evidence-store-frontend and run `touch .env`. This will create an `.env` file where you can store the environment variables (following the pattern example in `.env.sample`). This file should not be tracked by git, as it has been added to the `.gitignore`, so please do check that this is the case.

Install the packages and start the frontend by running:

```bash
nvm use
npm i
npm run build
npm run dev
```

It'll be on [http://localhost:3000](http://localhost:3000). Follow the instructions below to change the DNS hosts file and log in successfully.

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

The application uses Jest, `react-testing-library` and Cypress for tests.

### Unit

You can run the unit tests by running:

```sh
npm run test:unit
```

### Integration

In order to run the integration tests, you need to:

1. Navigate to the `.env` file and comment out (by adding a `#`) the DOCUMENTS_API_BASE_URL and EVIDENCE_API_BASE_URL. Uncomment the one specified for intergration tests.
2. Make sure that documents-api and evidence-api are not running.
3. In the terminal, run `npm run dev-mock`. This will run the application and the Mocks Server networking layer.
4. Open up a new terminal and run `npm run test:e2e:dev` (or `npm run test:e2e:ci` to run in terminal and not UI)

A new Cypress UI will open. You will need to click on 'Run x integration tests'. The tests will take a little longer than the unit tests. Close the window when they're all finished.

> Once you have finished testing, exit the `dev-mock` server and revert your changes to `.env`.

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

## File Uploads

For security reasons, the MIME types that a resident can upload must be whitelisted on both client side and server side. This means that a resident cannot upload a file that does not meet the approved whitelist. For example, a resident cannot upload a file with an extension of `.svg` because the MIME type `image/svg+xml` has not been added to the whitelist. Please see the previous pen-test reports for more information. The following MIME types are blacklisted:

- `image/svg+xml` (could contain scripts)
- `application/octet-stream` (unknown binary-type files)

### Adding a new accepted MIME type

There are two places where a new MIME type needs to be whitelisted; the client (frontend) and the server (evidence-api). To update how the server accepts MIME types, please see the README on [Evidence API](https://github.com/LBHackney-IT/evidence-api). You need to update both sides, otherwise files sent from the client to server may be rejected (return a `400 Bad Request`)

To update the accepted MIME types on the frontend, navigate to [UploaderPanel.tsx](src/components/UploaderPanel.tsx) and add the MIME types to the `acceptedMimeTypes` function. A list of authoritative MIME types can be found on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) and [IANA](https://www.iana.org/assignments/media-types/media-types.xhtml).

You will also need to update the relevant information for the user on the UI. Navigate to [FileFormatsDetails.tsx](src/components/FileFormatsDetails.tsx) and add/remove the file extensions listed in the correct element.

### Current accepted MIME types

| MIME type                                                               | File extension |
| ----------------------------------------------------------------------- | -------------- |
| application/msword                                                      | .doc           |
| application/pdf                                                         | .pdf           |
| application/vnd.apple.numbers                                           | .numbers       |
| application/vnd.apple.pages                                             | .pages         |
| application/vnd.ms-excel                                                | .xls           |
| application/vnd.openxmlformats-officedocument.spreadsheetml.sheet       | .xlsx          |
| application/vnd.openxmlformats-officedocument.wordprocessingml.document | .docx          |
| image/bmp                                                               | .bmp           |
| image/gif                                                               | .gif           |
| image/heic                                                              | .heic          |
| image/jpeg                                                              | .jpeg or .jpg  |
| image/png                                                               | .png           |
| text/plain                                                              | .txt           |

# License

[MIT](./LICENSE)
