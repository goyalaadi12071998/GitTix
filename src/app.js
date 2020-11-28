const express = require('express');

const app = express();

app.get('*', (req, res) => {
    res.status(404).send({message: 'Page not exists'});
})

module.exports = app;