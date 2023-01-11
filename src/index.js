const express = require('express');

const Shorter = require('./controller/shorter');

const PORT = process.env.PORT || 8080;

const app = express();
app.disable("x-powered-by");

app.use(express.json());

app.get('/:id', Shorter.get);
app.post('/short', Shorter.short);

app.listen(PORT, () => {
    console.log('Server starts!');
});