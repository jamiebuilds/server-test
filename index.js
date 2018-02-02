// @flow
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

function wrap(fn) {
  return (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.get('/foo', wrap(async (req, res) => {
  res.status(200).json({ id: 1 });
}));

app.get('/bar', wrap(async (req, res) => {
  let resp = await axios.get('http://example.com/bar.json');
  res.status(200).json({ id: resp.data.id });
}));

app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    res.status(500).send({ error: err.message, stack: err.stack });
  } else {
    next();
  }
});

module.exports = app;
