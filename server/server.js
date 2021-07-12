const express = require('express');
const formData = require('express-form-data');
const databaseRoutes = require('./databaseRoutes');
const apiRoutes = require('./apiRoutes');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(formData.parse());
app.use('/local', databaseRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${port}`);
});
