var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile')
app.use(bodyParser());

var mongojs = require('mongojs');
var db = mongojs('puzzle', ['scores']);

app.use(express.static(__dirname + "/public"));

app.post('/scores', function (req, res){
	db.scores.insert(JSON.parse(req.body.score), function (err, doc){
		res.json(doc);
	});
});

app.get('/scores/:sort/:order', function (req, res){
	var sort = {};
	sort[req.params.sort] = 1;
	if (req.params.order == "false") {
		sort[req.params.sort] = -1;
	}
	db.scores.find().sort(sort, function (err, docs) {
		if (err)
       		res.send(err); 
       res.json(docs);
	});
	
});

app.get('/scores', function (req, res){
	db.scores.find().sort({steps: 1}, function (err, docs) {
		if (err)
        	res.send(err); 
        res.json(docs);
	});
});


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname +'/public/main.html'));
});

app.listen(3000, function () {
  console.log('puzzle listening on port 3000!');
});