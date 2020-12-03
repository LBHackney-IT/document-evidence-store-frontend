This is the resident and staff-facing frontend for Hackney's new document and evidence store.

It's also known as **Hackney Upload**.

## 🧱 How it's made

It's a [Next.js](https://nextjs.org) app that works with:

- Hackney's [document platform API](https://github.com/LBHackney-IT/documents-api)
- Hackney's Google login... (???)

It's built using the [React port](https://github.com/LBHackney-IT/lbh-frontend-react) of Hackney Frontend.

## 💻 Running it locally

You need `node` and `npm` installed.

First, clone the repo

```bash
npm i
npm run dev
```

It'll be on [http://localhost:3000](http://localhost:3000).

## 🧪 Testing it

It uses Jest, `react-testing-library` and cypress for tests.

Run Jest rests with:

```
npm run test:unit
```

## 🌎 Putting it on the internet

It's suitable for Heroku, Vercel, AWS, or any other Node.js hosting.

Pushes to the main branch will be automatically built and deployed to our staging environment.

Check the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🧬 Configuration

You can use a `.env` file to supply environment config locally.

| Variable          | Description                                                         | Example             |
| ----------------- | ------------------------------------------------------------------- | ------------------- |
| BASE_URL          |                                                                     |                     |
| FEEDBACK_FORM_URL | The URL to a form where users can submit feedback about the service | https://example.com |
