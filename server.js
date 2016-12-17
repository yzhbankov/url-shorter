/**
 * Created by Iaroslav Zhbankov on 17.12.2016.
 */
var express = require('express');
var app = express();
var shortid = require('shortid');
var validUrl = require('valid-url');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://yzhbankov:password1360@ds135798.mlab.com:35798/heroku_4np3mkvf';

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public');
});

app.get(/\/new\/.+/, function (req, res) {
    var short_url = shortid.generate();
    var original_url = req.path.replace(/\/new\//, "");
    if (validUrl.isUri(original_url)) {
        MongoClient.connect(url, function (err, db) {
            db.collection('shorturl').insertOne({
                "original_url": original_url,
                "short_url": short_url
            }, function (err, result) {
                if (!err) {
                    console.log("inserted successfuly");
                }
            });
            db.close();
        });
        res.send({
            "original_url": original_url,
            "short_url": "https://url-short-microservice.herokuapp.com/" + short_url
        })
    } else {
        res.send("invalid url format");
    }
});

app.get('/:id', function (req, res) {
    console.log(req.params.id);
    MongoClient.connect(url, function (err, db) {
        db.collection('shorturl').findOne({
            "short_url": req.params.id
        }, function (err, result) {
            if (!result) {
                res.send({'error': "not found such url in the database"});
            } else {
                res.redirect(result.original_url);
            }
        });
        db.close();
    });

});

app.listen(process.env.PORT || 3000, function () {
    console.log('Ready. Listening port 3000');
});
