/**
 * Created by Iaroslav Zhbankov on 17.12.2016.
 */
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('hello world');
});

app.listen(8080, function () {
    console.log('Ready. Listening port 8080');
});