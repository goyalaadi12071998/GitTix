const express = require('express');

const app = express();

const port = process.env.PORT || 8080;

app.get('*', (req, res) => {
    res.status(404).send({message: 'Page not exists'});
})

app.listen(port, () => {
    console.log('listening on port ' + port);
});