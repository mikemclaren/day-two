// @flow
import r from 'rethinkdb';

let connection;

// On spin up, this helper will try to set up databases as needed.
async function setUpIfNecessary() {
  connection = await r.connect({ host: 'localhost', port: 28015 });
  try {
    await r.dbCreate('githubwebhooks').run(connection);
    console.log('Created githubwebhooks DB.');
  } catch(ex) {
    console.log('githubwebhooks DB already created');
  }
}

setUpIfNecessary();

export { r, connection };
