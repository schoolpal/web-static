const express = require('express');
const path = require('path');
const app = express();
const port = (process.argv.findIndex(isDinner) < 0) ? 3000 : 3001;

app.use(express.static('html/dist'));

app.all('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'html/index.html'));
});

function isDinner(elem) {
    return elem === 'dinner3000';
};


app.listen(port);