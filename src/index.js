const express = require('express');

const Shorter = require('./controller/shorter');

const PORT = process.env.PORT || 8080;

app = express();

app.use(express.json());

app.get('/:id', Shorter.get);
app.post('/short', Shorter.short);

app.listen(PORT, () => {
    console.log('Server starts!');
});