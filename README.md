# Catch&Shoot (NBADraft-482)

## Development

### Install dependencies (one-time setup):

```bash
npm install
```

Create`.env.local` and provide values for:

- `DATABASE_URL` – MySQL connection string shared with Drizzle ORM.
- `BETTER_AUTH_SECRET` – signing secret for Better Auth once it is configured.

### Run the dev server at `http://localhost:3000`:

```bash
npm run dev
```

### Create a production build and serve it:

```bash
npm run build
npm start
```

### Lint the codebase:

```bash
npm run lint
```

## Styling

We are using Tailwind CSS with [DaisyUI](https://daisyui.com/docs/intro/)and [Heroicons](https://heroicons.com/). DaisyUI components and Heroicons will be used across all pages for consisency. Global styles live in `src/app/globals.css`, and additional shared UI pieces live in `src/components/`.
