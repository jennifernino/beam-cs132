"use strict";

var express = require('express');

var colors = require('colors');

var mongoose = require('mongoose');

var cors = require('cors');

var bodyParser = require('body-parser');

var App = require('./client/src/App');

var Html = require('./client/Html');

var renderToString = require('react-dom/server');

express.use(express["static"](path.join(__dirname, "public")));
/*
 * Database credentials
 */

var username = "beam_manager";
var password = "1320csci";
var url = "mongodb+srv://" + username + ":" + password + "@cluster0-auldt.mongodb.net/cs132beam";
/*
 * Schemas!
 */

var schemas = require('./schemas.js');

var usersSchema = new mongoose.Schema(schemas[0], schemas[1]);
var lessonsSchema = new mongoose.Schema(schemas[2], schemas[3]);
var Users = mongoose.model('Users', usersSchema); // INDEX NEEDED FOR FULL TEXT QUERIES

var Lessons = mongoose.model('Lessons', lessonsSchema.index({
  '$**': 'text'
}));
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());
mongoose.connect(url, {
  useNewUrlParser: true
}, function (error, resolve) {
  if (error) {
    var _err = 'ERROR: Unable to connect to ' + url;

    console.log(_err.red);
  } else {
    var res = 'SUCCESS: Connected to ' + url;
    console.log(res.green);
  }
});
var sessions = new Map(); // session to USER_ID

var names = new Map(); // session to NAME

sessions.set("abc123", "1"); // fake user REMOVE once login is made

names.set("abc123", "Jennifer"); // ^^^

/*
 * Generates a random character sequence to use as session ID
 */

function genID() {
  var chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  var result = '';

  for (var i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}
/*
 * Adds session to map
 * TODO: Figure out how to remove once done
 */


function session(name, user_id) {
  var sesh = genID();

  while (sessions.has(sesh)) {
    sesh = genID();
  }

  sessions.set(sesh, user_id);
  return sesh;
} // const { users, lessons } = require('./pre_info.js');
// Users.insertMany(users, {}, (error, data) => {
//   if (error) {
//     console.log(error.red);
//   } else {
//     let message = "Users Added to database!"
//     console.log(message.green);
//   }
// })
// Lessons.insertMany(lessons, {}, (error, data) => {
//   if (error) {
//     console.log(error.red);
//   } else {
//     let message = "Lesson Added to database!"
//     console.log(message.green);
//   }
// });
// Query to check/get password


app.post('/', function (request, response) {
  console.log('- request received:', request.method.cyan, request.url.underline); //response.status(200).type('html');

  response.send('hi');
  var email = response.body.email;
  User.find({
    email: email
  }, {
    password: true
  }, function (error, data) {
    if (error) {
      console.log(err.red);
    } else {
      // data is the password object received
      // verify
      // add to session
      console.log(data); // response.json({data : data});
    }
  });
});
app.get('/:session/home', function (request, response) {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  var session = request.params.session;
  var user_id = sessions.get(session);
  Lessons.find({
    creator: user_id
  }, function (error, data) {
    if (error) {
      console.log(error.red);
    } else {
      var published = [];
      var unpublished = [];

      for (var i = 0; i < data.length; i += 1) {
        if (data[i].published) {
          // 0 is not published, 1 is published
          published.push(data[i]);
        } else {
          unpublished.push(data[i]);
        }
      }

      response.json({
        published: published,
        unpublished: unpublished
      }); // TODO: Wrap and send back!
    }
  });
}); // const temp = {
//   lesson_id: "lesson6",
//   published: false,
//   creator: 1,
//
//   date: 1555892429,
//   gradeStart: 2,
//   gradeEnd: 5,
//   theme: "Sadness",
//   unit: "Two",
//   subunit: "and a third",
//   goal: "everything",
//   intro: "bye",
//   warmup: "yayaya",
//   reflection: "noooo",
//   backup: "nope",
//   additional_game: "yes",
//   quote: "hahahha",
//   materials: [{
//     item: "crayons",
//     quantity: 10000000
//   }]
// }

app.post('/:session/newPage', function (request, response) {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  var session = request.params.session;
  var user_id = sessions.get(session); // TODO: Clean input  - consider save VS publish

  var created = {};
  Lessons.create(created, {}, function (error, data) {
    if (error) {
      console.log(error.red);
    } else {
      var message = "Successfully uploaded the lesson!";
      console.log(message.green); // TODO: Send back confirmation
    }
  });
});

function buildQuery(searchString, fltr) {
  // TODO: make sure to check that gradeStart <= gradeEnd
  var textQuery = {
    $text: {
      $search: searchString
    }
  };
  var userYear = fltr.year === "" ? {
    $exists: true
  } : fltr.year;
  var userMonth = fltr.month === "" ? {
    $exists: true
  } : fltr.month;
  var userTheme = fltr.theme === "" ? {
    $exists: true
  } : fltr.theme;
  var userUnit = fltr.unit === "" ? {
    $exists: true
  } : fltr.unit;
  var rangeQuery = {
    $and: [{
      $gte: fltr.gradeStart
    }, {
      $lte: fltr.gradeEnd
    }]
  };
  var userGradeEnd = fltr.unit === "" ? {
    $exists: true
  } : fltr.gradeStart === fltr.gradeEnd ? fltr.gradeStart : rangeQuery; // may cause issues IDK if AND or OR

  var userGradeStart = fltr.unit === "" ? {
    $exists: true
  } : fltr.gradeStart === fltr.gradeEnd ? fltr.gradeStart : rangeQuery;
  var filterQuery = {
    published: 1,
    // 1 is true or 0 is false
    year: userYear,
    month: userMonth,
    gradeStart: userGradeStart,
    gradeEnd: userGradeEnd,
    theme: userTheme,
    unit: userUnit
  };

  if (typeof searchString === "undefined" || searchString === "") {
    return filterQuery;
  } else if (fltr.hasResponses) {
    return {
      $and: [textQuery, filterQuery]
    };
  } else {
    return textQuery;
  }
}

app.get('/:session/search', function (request, response) {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  var session = request.params.session;
  var user_id = sessions.get(session);
  var input = "sadness"; // TODO: Clean input - query by whats given

  var finalQuery = buildQuery(input);
  Lessons.find(finalQuery, function (error, data) {
    if (error) {
      console.log(error.red);
    } else {// TODO: Wrap and send back!
    }
  });
});
/*
 * Gets all the current chatrooms
 */

var authComponents = {
  login: "Login",
  signup: "SignUp",
  forgot: "Forgot"
};
app.get('/', function (request, response) {
  console.log('- request received:', request.method.red, request.url.underline); //console.log('404 - Not Found'.red)
  //response.status(404).type('html');
  //response.setHeader('Content-Type', 'application/json');
  //response.end(JSON.stringify({ a: 1 }));

  var body = renderToString(React.createElement(App, null));
  var title = 'Server side Rendering with Styled Components';
  response.send(Html({
    body: body,
    title: title
  }));
});
app.get('*', function (request, response) {
  console.log('- request received:', request.method.red, request.url.underline);
  console.log('404 - Not Found'.red);
  response.status(404).type('html');
});
app.listen(8080);
console.log('App is listening on port 8080'.grey);