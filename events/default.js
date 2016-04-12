// @flow
import { r, connection } from '../helpers/rethinkdb';

export async function default(body, eventType) : Promise {
  // This is cheating and super hacky. I'm going to create the table for the
  // event if it doesn't already exist.
  try {
    await r.db('githubwebhooks').tableCreate(eventType).run(connection);
  } catch {}

  await r.db('githubwebhooks').table(eventType).insert(body).run(connection);
  return;
}
