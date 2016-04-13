# Day Two
A Github Webhook server built with Koa, Babel, RethinkDB, while utilizing Flow!

Grabs incoming events and stores them in RethinkDB for...uses.

Shoutout to Github's Documentation for being really thorough and super useful.

## Spinning Up
You'll need to be running Node 4.0+!

You'll also need to be running RethinkDB. I'd love to throw this into a Docker
container another day.

You'll want to create a `.env` file that contains the following variables:

```
GITHUB_SECRET=your_github_webhook_secret
```

Then you can get going!
```
npm install
npm start
```

To test, you'll want to send the following CURL request, since you can't send actual
Github webhook payloads to localhost (obviously):

```
(CURL WEBHOOK GOES HERE)
```
