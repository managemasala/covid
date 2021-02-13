const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
});

io.on('connection', function (socket) {
  socket.on('message1', function (data) {
    var url =
      'https://api.covid19api.com/live/country/' + data + '/status/confirmed';
    request(url, function (error, response, body) {
      var json = JSON.parse(body);

      for (var i = 0; i < json.length; i++) {
        if (json[i].Date === '2020-04-28T00:00:00Z') {
          var conformed = json[i].Confirmed;
          var deaths = json[i].Deaths;
          var recover = json[i].Recovered;
          socket.emit('message', {
            conform: conformed,
            death: deaths,
            recovery: recover,
          });
        }
      }
    });
  });
});

//
// io.on('connection', function(socket) {
//   app.get("/", function(req, res) {
//     res.render("index");
//   });
//
//   app.post("/", function(req, res) {
//
//     var url = "https://api.covid19api.com/live/country/" + req.body.country + "/status/confirmed";
//     request(url, function(error, response, body) {
//       if(error) {
//         console.log(error);
//       } else {
//           var json = JSON.parse(body);
//           var conformed = json[15].Confirmed;
//           var deaths = json[15].Deaths;
//          var recover = json[15].Recovered;
//
//
//          socket.emit('message', {
//            conform: conformed,
//            death: deaths,
//            recovery: recover
//          });
//       }
//     });
//   });
// });
//

http.listen(3000, function () {
  console.log('server is running on port 3000.');
});
