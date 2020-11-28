const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const cors = require('cors');

const app = express();

app.set(bodyParser.urlencoded({ extended: true }));

app.use(morgan());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Listening');
})

app.all('*', (req, res) => {
    res.status(404).send({message: 'Page not exists'});
});

module.exports = app;