const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));

app.get(
  '/example',
  (req, res, next) => {
    res.set('Set-Cookie', 'wecwrwec');

    const err = new Error();
    err.status = 400;

    next(err);
  },
  (req, res, next) => {
    console.log('second middleware');
    return res.send({ hello: 'hello world' });
  }
);

app.post('/example', (req, res, next) => {
  console.log(req.body);
  res.send(req.body);
});

app.post('/singIn', (req, res, next) => {
  console.log(ewq.body);

  return res.send('request was succesfully handled');
});

app.use((err, req, res, next) => {
  delete err.stack;

  next(err);
});

app.listen(3001, () => {
  console.log('Started listening on port', 3001);
});
