const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
  response.send();
});

app.get('/list.txt', function (request, response) {
  response.sendFile(__dirname + '/list.txt');
});
app.listen(3000);
