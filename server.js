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

sessions.set("abc123",1) // fake user REMOVE once login is made
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

app.get('/:session_id/home', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session_id;
  console.log(session)
  const user_id = sessions.get(session);
  console.log(user_id)
  Lessons.find({creator:user_id}, (error, data) => {
    console.log(data)
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

app.post('/:session_id/newPage', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session_id;
  const user_id = sessions.get(session);

  // TODO: Clean input  - consider save VS publish
  const created = {}

  Lessons.find({}, {lesson_id:1},(error,data) => {
    if (error) {
      console.log(error.red)
    } else {
      const nums = data.map(x => x.lesson_id);
      created.lesson_id = Math.max(...nums) + 1;
    }
  })

  console.log(created); // TODO: Check if it works! May not return created value

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

function buildQuery(fltr) {
  const textQuery = { $text: { $search: fltr.textSearch } };
  if (fltr.hasResponses) {
    return textQuery;
  }
  const semester = (fltr.semester === "") ? {$exists: true} : fltr.semester;
  const weekday = (fltr.weekday === "") ? {$exists: true} : fltr.weekday;
  const month = (fltr.month === "") ? {$exists: true} : fltr.month;
  const year = (fltr.year === "") ? {$exists: true} : fltr.year;
  const subject = (fltr.subject === "") ? {$exists: true} : fltr.subject;
  // gradeStart: gStart,
  // gradeEnd: gEnd,
  // TODO: make sure to check that gradeStart <= gradeEnd
  //
  // // What if one or the other
  // const rangeQuery = { $and: [ { $gte: fltr.gradeStart }, { $lte: fltr.gradeEnd } ] }
  //
  // const userGradeEnd = (fltr.gradeEnd === "") ? {$exists: true} :
  //   ((fltr.gradeStart === fltr.gradeEnd) ? fltr.gradeStart : rangeQuery);
  //   // may cause issues IDK if AND or OR
  // const userGradeStart = (fltr.unit === "") ? {$exists: true} :
  //   ((fltr.gradeStart === fltr.gradeEnd) ? fltr.gradeStart : rangeQuery);

  const filterQuery =
    {
      published: 1, // 1 is true or 0 is false
      semester: semester,
      dayOfWeek: weekday,
      monthOfLesson: month,
      yearOfLesson: year,
      subject: subject
    };

  if (fltr.textSearch === "" ) {
    return filterQuery;
  } else {
    return { $and : [ textQuery, filterQuery ] };
  }
}

app.post('/:session_id/search', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');

  const session = request.params.session_id;
  const user_id = sessions.get(session);

  // TODO: Clean input - query by whats given
  const finalQuery = buildQuery(request.body);
  console.log(finalQuery)
  Lessons.find(finalQuery, (error, data) => {
    if (error) {
      console.log(error.red)
    } else {
      console.log(data)
      response.json(data)
    }
  })
})

app.post('/', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);

  response.status(200).type('html');
  response.render
});

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
