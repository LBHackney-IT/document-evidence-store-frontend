# 📤 Hackney Upload frontend

This is the resident and staff-facing frontend for Hackney's new document and evidence store.

It's also known as **Hackney Upload**.

## 🧱 How it's made

It's a [Next.js](https://nextjs.org) app that works with:

- Hackney's [document platform API](https://github.com/LBHackney-IT/documents-api)
- Hackney's [Google oAuth service](https://github.com/LBHackney-IT/LBH-Google-auth)

It's built using the [React port](https://github.com/LBHackney-IT/lbh-frontend-react) of Hackney Frontend.

## 💻 Running it locally

You need `node` and `npm` installed.

First, clone the repo

```bash
npm i
npm run dev
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
npm run test:e2e:dev
```

## 🌎 Putting it on the internet

It's suitable for Heroku, Vercel, AWS, or any other Node.js hosting.

Pushes to the main branch will be automatically built and deployed to our staging environment.

Check the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🧬 Configuration

You can use a `.env` file to supply environment config locally. Create a fresh one with `cp .env.sample .env`.

| Variable                                  | Description                                                         | Example                             |
| ----------------------------------------- | ------------------------------------------------------------------- | ----------------------------------- |
| NEXT_PUBLIC_APP_URL                       |                                                                     | http://localdev.hackney.gov.uk:3000 |
| HACKNEY_JWT_SECRET                        |                                                                     |                                     |
| NEXT_PUBLIC_HACKNEY_COOKIE_NAME           |                                                                     | hackneyToken                        |
| NEXT_PUBLIC_REACT_APP_ENV                 |                                                                     | dev                                 |
| FEEDBACK_FORM_URL                         | The URL to a form where users can submit feedback about the service | https://example.com                 |
| EVIDENCE_API_BASE_URL                     |                                                                     | https://example.com/api/v1/         |
| EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET     |                                                                     |                                     |
| EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET  |                                                                     |                                     |
| EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_POST |                                                                     |                                     |
