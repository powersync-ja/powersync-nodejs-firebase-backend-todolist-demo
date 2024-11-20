# PowerSync Node.js + Firebase Backend: Demo

## Overview

This repo contains a demo Node.js server application which has HTTP endpoints to authorize a [PowerSync](https://www.powersync.com/) enabled application to sync data between a client device and a PostgresSQL database. In addition, it has endpoints that allow a PowerSync client to authenticate.

The endpoints are as follows:

1. GET `/api/auth/token`

   - PowerSync uses this endpoint to retrieve a JWT access token which is used for authentication.

2. GET `/api/auth/keys`

   - PowerSync uses this endpoint to validate the JWT returned from the endpoint above.

3. PUT `/api/data`

   - PowerSync uses this endpoint to sync upsert events that occurred on the client application.

4. PATCH `/api/data`

   - PowerSync uses this endpoint to sync update events that occurred on the client application.

5. DELETE `/api/data`

   - PowerSync uses this endpoint to sync delete events that occurred on the client application.

The repo also has an integration with [Firebase](https://firebase.google.com/docs/auth) to validate a token provided in the header of the `/api/auth/token` endpoint.

## Packages

- [node-postgres](https://github.com/brianc/node-postgres) is used to interact with the Postgres database when a PowerSync enabled client performs requests to the `/api/data` endpoint.
- [jose](https://github.com/panva/jose) is used to sign the JWT which PowerSync uses for authorization.
- [firebase-admin](https://github.com/firebase/firebase-admin-node) is used to connect to Firebase and the `verifyIdToken` function is used to validate the client application request before the app generates a JWT used by PowerSync to sync data.

## Requirements

This app needs a PostgresSQL instance that's hosted. For a free version for testing/demo purposes, visit [Supabase](https://supabase.com/).

## Running the app

1. Clone the repository

2. Follow the steps outlined in [PowerSync Custom Authentication Example](https://github.com/journeyapps/powersync-jwks-example) → [Generate a key-pair](https://github.com/journeyapps/powersync-jwks-example#1-generate-a-key-pair) to get the key pair you need for this app. This is an easy way to get started with this demo app. You can use your own public/private keys as well.

3. Create a new `.env` file in the root project directory and add the variables as defined in the `.env` file:

```shell
cp .env.template .env
```

4. Make sure to place a copy of your Firebase Admin SDK `serviceAccountKey.json` in the root of the project.

   4.1. You can get this file from the firebase console by heading over to your project settings > Service accounts > Firebase Admin SDK > Generate new private key

   4.2. Download the json file and save it in the project root as `serviceAccountKey.json`.

   4.3. Set the `GOOGLE_APPLICATION_CREDENTIALS` to point to the file on your machine e.g

   ```
   GOOGLE_APPLICATION_CREDENTIALS= /path/to/powersync-nodejs-firebase-backend-todolist-demo/serviceAccountKey.json
   ```

5. Install dependencies:

**This demo requires [node](https://nodejs.org/en/download/package-manager) to be installed on your system. Alternatively you can install it using [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating).**

```shell
yarn
or
npm install
```

## Start App

1. Run the following to start the application

```shell
npm run start
or
yarn start
```

This will start the app on `http://127.0.0.1:PORT`, where PORT is what you specify in your `.env` file.

2. Test if the app is working by opening `http://127.0.0.1:PORT` in the browser

3. You should get a JSON object that looks like this as the response

```json
{ "message": "powersync-nodejs-backend-todolist-demo" }
```

## Testing the app with PowerSync

This process is only designed for demo/testing purposes, and is not intended for production use. You won't be using ngrok to host your application and database.

1. Download and install [ngrok](https://ngrok.com/)

2. Run the ngrok command to create a HTTPS tunnel to your local application

```shell
ngrok http <YOUR PORT>
```

This should create the tunnel and a new HTTPS URL should be available e.g.

```shell
ngrok by @inconshreveable                                                                                                                  (Ctrl+C to quit)

Session Status                online
Account                       Michael Barnes (Plan: Free)
Update                        update available (version 2.3.41, Ctrl-U to update)
Version                       2.3.40
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://your_id.ngrok-free.app -> http://localhost:8000
Forwarding                    https://your_id.ngrok-free.app -> http://localhost:8000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              1957    0       0.04    0.03    0.01    89.93
```

3. Open the [PowerSync Dashboard](https://powersync.journeyapps.com/) and paste the `Forwarding` URL starting with HTTPS into the Client Auth tab of your PowerSync instance e.g.

```
JWKS URI
https://your_id.ngrok-free.app/api/auth/keys/
```

> Pay special attention to the URL, it should include the `/api/auth/keys/` path as this is used by the PowerSync server to validate tokens.
