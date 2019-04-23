const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')

/*
 * Database credentials
 */
const username = "beam_manager";
const password = "1320csci";
const url = "mongodb+srv://" + username + ":" + password + "@cluster0-auldt.mongodb.net/cs132beam";

/*
 * Schemas!
 */
const schemas = require('./schemas.js');

const usersSchema = new mongoose.Schema(schemas[0], schemas[1]);
const lessonsSchema = new mongoose.Schema(schemas[2], schemas[3]);

const Users = mongoose.model('Users', usersSchema);
// INDEX NEEDED FOR FULL TEXT QUERIES
const Lessons = mongoose.model('Lessons', lessonsSchema.index({'$**': 'text'}));


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(url, { useNewUrlParser: true }, function (error, resolve) {
  if (error) {
    let err = 'ERROR: Unable to connect to ' + url;
    console.log(err.red);
  } else {
    let res = 'SUCCESS: Connected to ' + url;
    console.log(res.green);
  }
});

const sessions = new Map(); // session to USER_ID
const names = new Map(); // session to NAME

sessions.set("abc123","1") // fake user REMOVE once login is made
names.set("abc123","Jennifer") // ^^^

/*
 * Gets all the current chatrooms
 */
function genID() {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars[(Math.floor(Math.random() * chars.length))];
  }
  return result;
}

/*
 * Adds session to map
 * TODO: Figure out how to remove once done
 */
function session(name, user_id) {
  let sesh = genID()
  while (sessions.has(sesh)) {
    sesh = genID();
  }
  sessions.set(sesh, user_id);
  return sesh;
}

// const { users, lessons } = require('./pre_info.js');
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
app.post('/', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);

  response.status(200).type('html');
  response.render
});

app.get('/:user_id', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session;
  const user_id = sessions.get(session);
  Lessons.find({creator:user_id}, (error, data) => {
    if (error) {
      console.log(error.red)
    } else {
      let published = [];
      let unpublished = [];
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].published) { // 0 is not published, 1 is published
          published.push(data[i]);
        } else {
          unpublished.push(data[i]);
        }
      }
      response.json({published:published, unpublished:unpublished});
      // TODO: Wrap and send back!
    }
  })
})

// const temp = {
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

// });

app.get('/signup', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session;
  const user_id = sessions.get(session);

  // TODO: Clean input  - consider save VS publish
  const created = {}

  Lessons.create(created, {}, (error, data) => {
    if (error) {
      console.log(error.red)
    } else {
      let message = "Successfully uploaded the lesson!";
      console.log(message.green);
      // TODO: Send back confirmation
    }
  })
})

function buildQuery(searchString, fltr) {
  // TODO: make sure to check that gradeStart <= gradeEnd
  const textQuery = { $text: { $search: searchString } };

  const userYear = (fltr.year === "") ? {$exists: true} : fltr.year;
  const userMonth = (fltr.month === "") ? {$exists: true} : fltr.month;
  const userTheme = (fltr.theme === "") ? {$exists: true} : fltr.theme;
  const userUnit = (fltr.unit === "") ? {$exists: true} : fltr.unit;

  const rangeQuery = { $and: [ { $gte: fltr.gradeStart }, { $lte: fltr.gradeEnd } ] }
  const userGradeEnd = (fltr.unit === "") ? {$exists: true} :
    ((fltr.gradeStart === fltr.gradeEnd) ? fltr.gradeStart : rangeQuery);
    // may cause issues IDK if AND or OR
  const userGradeStart = (fltr.unit === "") ? {$exists: true} :
    ((fltr.gradeStart === fltr.gradeEnd) ? fltr.gradeStart : rangeQuery);

  const filterQuery = {
    published: 1, // 1 is true or 0 is false
    year: userYear,
    month: userMonth,
    gradeStart: userGradeStart,
    gradeEnd: userGradeEnd,
    theme: userTheme,
    unit: userUnit,
  };

  if (typeof searchString === "undefined" || searchString === "" ) {
    return filterQuery;
  } else if (fltr.hasResponses) {
    return { $and : [ textQuery, filterQuery ] };
  } else {
    return textQuery;
  }
}

app.get('/forgotpassword', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session;
  const user_id = sessions.get(session);
  const input = "sadness"
  // TODO: Clean input - query by whats given
  const finalQuery = buildQuery(input);

  Lessons.find(finalQuery, (error, data) => {
    if (error) {
      console.log(error.red)
    } else {

      // TODO: Wrap and send back!
    }
  })
})



/*
 * Gets all the current chatrooms
 */

app.get('*', function(request, response){
    console.log('- request received:', request.method.red, request.url.underline);
    console.log('404 - Not Found'.red)
    response.status(404).type('html');

});


app.listen(8080);
console.log('App is listening on port 8080'.grey);
