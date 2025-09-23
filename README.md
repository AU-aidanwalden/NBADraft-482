# Catch&Shoot (NBADraft-482)

## Running

To run the site, ensure that:

- Node.js is installed
- A MySQL database using the schema file in `backend/nbadraft_schema.sql` is running and accessible

Then, open a terminal and navigate to the `backend` directory.
Run `npm i` to install dependencies

Then, create a `.env` file with the following variables defined:

- `JWT_SECRET` the secret key used for signing JWT tokens
- `DATABASE_URL` the url (beginning with mysql://) for accessing the MySQL database
- `NODE_ENV` one of `production` or `development`

Once this is all set up, run:

- `npm run build`
- `npm run run`

And you will be running the backend. The frontend should be accessible at the URL the server is running on.
