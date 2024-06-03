var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var multer = require("multer");

// Set up storage configuration for multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.post('/file_upload', upload.single('file'), function (req, res) {
    console.log(req.file.originalname);
    console.log(req.file.path);
    console.log(req.file.mimetype);

    var file = __dirname + "/" + req.file.originalname;

    fs.readFile(req.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                response = {
                    message: "File uploaded successfully",
                    filename: req.file.originalname
                };
            }
            console.log(response);
            res.end(JSON.stringify(response));
        });
    });
});

app.delete('/del_user', function (req, res) {
    console.log("Got a DELETE request");
    res.send("Hello DELETE");
});

app.get('/index.htm', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});
