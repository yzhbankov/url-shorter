/**
 * Created by Iaroslav Zhbankov on 17.12.2016.
 */
var express = require('express');
var app = express();
var shortid = require('shortid');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/url-shorter';

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public');
});

app.get('/new/:url?', function (req, res) {
    var shorter_id = shortid.generate();
    MongoClient.connect(url, function (err, db) {
        console.log("Connected correctly to server");

        db.collection('shorturl').insertOne({"natural_url": req.params.url, "short_url": shorter_id}, function (err, result) {
            if (!err) {
                console.log("inserted successfuly");
            }
        });
        db.close();
    });
    res.send({
        "original_url": req.params.url,
        "short_url": shorter_id
    });
});
app.get('/get/:id', function (req, res) {
    console.log(req.params.id);
    MongoClient.connect(url, function (err, db) {
        db.collection('shorturl').findOne({
            "short_url": req.params.id
        }, function (err, result) {
            res.send(result);
        });
        db.close();
    });

});

app.listen(8080, function () {
    console.log('Ready. Listening port 8080');
});