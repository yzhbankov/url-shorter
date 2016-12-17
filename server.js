/**
 * Created by Iaroslav Zhbankov on 17.12.2016.
 */
var express = require('express');
var app = express();

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public');
});

app.get('/new/:url?', function (req, res) {

    res.send(req.params.url);
});

app.listen(8080, function () {
    console.log('Ready. Listening port 8080');
});