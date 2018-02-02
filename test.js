// @flow
const test = require('ava');
const nock = require('nock');
const request = require('supertest');
const app = require('./');

let delay = ms => new Promise(resolve => setTimeout(resolve, ms));

test('incoming request', async t => {
  let res = await request(app).get('/foo');
  t.is(res.status, 200);
  t.is(res.body.id, 1);
  t.regex(res.header['content-type'], /json/);
});

test('outgoing request', async t => {
  let resp = nock('http://example.com').get('/bar.json')
  let req = request(app).get('/bar');
  await delay(1000);
  resp.reply(200, { id: 42 });
  let res = await req;
  t.is(res.status, 200);
  t.is(res.body.id, 42);
});
