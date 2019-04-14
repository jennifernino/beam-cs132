const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')

// schema set up
const chat = require('./schemas.js');
const Schema = mongoose.Schema;
const chat_schema = new Schema(chat[0], chat[1]);
const data = mongoose.model('data', chat_schema);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const url = "mongodb+srv://cs132_user:cs132@cluster0-qymmk." +
  "mongodb.net/Assignment3";

mongoose.connect(url, { useNewUrlParser: true }, function (error, resolve) {
  if (error) {
    let err = 'ERROR: Unable to connect to ' + url;
    console.log(err.red);
  } else {
    let res = 'SUCCESS: Connected to ' + url;
    console.log(res.green);
  }
});

/*
 * Gets all the current chatrooms
 */
app.get('/', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');

});

app.get('/:user_id', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  let id = request.params.user_id;

});

app.get('/signup', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');

});

app.get('/forgotpassword', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');

});

app.get('*', function(request, response){
    console.log('- request received:', request.method.red, request.url.underline);
    console.log('404 - Not Found'.red)
    response.status(404).type('html');

});


app.listen(8080);
console.log('App is listening on port 8080'.grey);
