var express = require('express');
var app = express();
var path = require('path');
var db = require('mongodb');
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile')
app.use(bodyParser());

var MongoClient = db.MongoClient;
var url = 'mongodb://localhost:27017/puzzle';
var bestListScore = { userScores:[
	{username: 'Galina1', steps: 10, time: '16s', level: 'easy'},
	{username: 'Galina2', steps: 22, time: '26s', level: 'easy'}
]
};

console.log('restarted with new app.js');

app.use(express.static(__dirname + "/public"));

// MongoClient.connect(url, function (err, db) {
//   if (err) {
//     console.log('Unable to connect to the mongoDB server. Error: ', err);
//   } else {
//     console.log('Connection established to ', url);

//     // Get the documents collection
//     var collection = db.collection('scores');

//     var scoreUser1 = {name: 'Galina1', score: 10, time: '16s', level: 'easy'};

//     var scoreUser2 = {name: 'Galina2', score: 22, time: '26s', level: 'easy'};

//     collection.insert(scoreUser1, scoreUser2, function (err, res){
//     	if (err) {
//     		console.log(err);
//     	} else {
//     		console.log('Inserted scoreUser1');
//     	} 
//     	db.close();
//     });

//    //Close connection
   
//   }
// });

// app.get('/scores', function (req, res){
// 	scores.findAll(function) (err, scr) {
// 		res.render('users_scores')
// 	}
// });

app.get('/scores', function (req, res){
	res.json(bestListScore);
});

app.put('/scores', function (req, res){
	bestListScore.userScores.push(req.body);
	res.json(bestListScore);
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname +'/public/main.html'));
});

app.listen(3000, function () {
  console.log('puzzle listening on port 3000!');
});