// @flow
require('babel-polyfill');
require('dotenv').config();

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import convert from 'koa-convert';
import Router from 'koa-router';

import fs from 'fs';
import path from 'path';

import xHubSignatureChecksOut from './middleware/xHubSignatureChecksOut';

let supportedEvents = {};

fs.readdir('./events', (err, list) => {
  list.forEach((file: string) => {
    let p: string = './events' + '/' + file;
    fs.stat(p, (err, stat: Object) => {
      if(stat && stat.isDirectory()) {
        return;
      }

      supportedEvents[file.replace('.js', '')] = require(path.resolve('./events', file));
    });
  });
});

const app = new Koa();
const router = new Router();

app.use(bodyParser());

app.use(async (ctx: Object, next: function) : Promise => {
  try {
    await next();
  } catch(err) {
    if(err.status === 401) {
      ctx.body = { message: 'Unauthorized access.' };
      ctx.status = 401;
    } else {
      ctx.body = { message: err.message };
      ctx.status = err.status || 500;
    }
  }

  return;
});

app.get('/', async (ctx, next) => {
  ctx.body = {
    message: 'Welcome! This is day-two, a Github Webhook server.'
  };
  ctx.status = 200;
  await next();
});

app.post('/', xHubSignatureChecksOut, async (ctx, next) => {
  const body = ctx.request.body;
  const eventType = ctx.request.headers['X-Github-Event'];

  if(supportedEvents.hasOwnProperty(eventType)) {
    await supportedEvents[eventType](body);
    ctx.body = {
      message: 'Done! good stuff.'
    };
    ctx.status = 200;
  } else {
    await supportedEvents.default(body, eventType);
    ctx.body = {
      message: 'Unsupported, but this was expected! Default action taken.'
    };
    ctx.status = 200;
  }
});

app.use(router.routes());

app.listen(3101);
console.log('Webhook Server up and running! On port 3101!');
