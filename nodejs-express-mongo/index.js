const express = require('express');
const routes = require('./routes');
const { init } = require('./db');

const app = express();

app.use(express.json());

app.use(routes);

init()
  .then(() => {
    app.listen(3000, () => {
      console.log(`app listening at port 300`);
    });
  })
  .catch((e) => {
    console.log(`Could not start application : ${e?.message}`);
    process.exit(1);
  });
