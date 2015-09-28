var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var mkdirp = require('mkdirp');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var storageFolder = process.env.OPENSHIFT_DATA_DIR || './storage';

mkdirp(storageFolder);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var router = express.Router();

var getFilePath = function (key) {
    return storageFolder + '/' + encodeURIComponent(key);
};

router.get('/storage/:key', function (req, res) {
    var filePath = getFilePath(req.params.key);
    if (fs.existsSync(filePath)) {
        var content = fs.readFileSync(filePath, 'utf8');
        res.json({success: true, content: content});
    } else
        res.json({success: false});
}).post('/storage/:key', function (req, res) {
    var filePath = getFilePath(req.params.key);
    fs.writeFileSync(filePath, req.body.content);
    res.json({success: true});
});

app.use('/api', router);


app.listen(port, ipaddress);
console.log('Magic happens on port ' + port);

