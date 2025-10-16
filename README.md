# Catch&Shoot (NBADraft-482)

## Development Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AU-aidanwalden/NBADraft-482.git
cd NBADraft-482
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MySQL Database

#### Start MySQL Server

Make sure your MySQL server is running.

#### Create the Database

Connect to MySQL as root:

```bash
mysql -u root -p
```

Create the `nbadraft` database:

```sql
CREATE DATABASE nbadraft;
EXIT;
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root. Then, add the following environment variables:

```env
# MySQL connection string for Drizzle ORM
DATABASE_URL="mysql://root:your_password@localhost:3306/nbadraft"

# Signing secret for Better Auth (generate a random string)
BETTER_AUTH_SECRET="your-secure-random-secret-here"
```

Replace `your_password` with your MySQL root password. For `BETTER_AUTH_SECRET`, generate a random string (at least 32 characters).

### 5. Set Up Database Schema with Drizzle ORM

The database schema is defined in `src/lib/db/schema.ts` for use with drizzle.

#### Push Schema to Database

To create/update your database tables based on the schema:

```bash
npx drizzle-kit push
```

### 6. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

#### Create a production build:

```bash
npm run build
npm start
```

## Styling

We are using Tailwind CSS with [DaisyUI](https://daisyui.com/docs/intro/) and [Heroicons](https://heroicons.com/). DaisyUI components and Heroicons will be used across all pages for consistency. Global styles live in `src/app/globals.css`, and additional shared UI pieces live in `src/components/`.
