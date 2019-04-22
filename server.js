const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')

const username = "beam_manager";
const password = "1320csci";
const url = "mongodb+srv://" + username + ":" + password + "@cluster0-auldt.mongodb.net/cs132beam";

const schemas = require('./schemas.js');

const usersSchema = new mongoose.Schema(schemas[0], schemas[1]);
const lessonsSchema = new mongoose.Schema(schemas[2], schemas[3]);

const Users = mongoose.model('Users', usersSchema);
const Lessons = mongoose.model('Lessons', lessonsSchema);

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

sessions.set("ABC123","111111")
names.set("ABC123","Jennifer")
/*
 * Generates a random character sequence to use as session ID
 */
function genID() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars[(Math.floor(Math.random() * chars.length))];
  }
  return result;
}

function session(name, user_id) {
  let sesh = genID()
  while (sessions.has(sesh)) {
    sesh = genID();
  }
  sessions.set(sesh, user_id);
  return sesh;
}

// ADD TO LESSONS
// const { users, lessons } = require('./pre_info.js');
//
// Lessons.create(lessons[0], {}, (error, data) => {
//   if (error) {
//     console.log(error.red);
//   } else {
//     let message = "Lesson Added to database!"
//     console.log(message.green, lessons[0].lesson_id);
//   }
// })
// Lessons.create(lessons[1], {}, (error, data) => {
//   if (error) {
//     console.log(error.red);
//   } else {
//     let message = "Lesson Added to database!"
//     console.log(message.green, lessons[1].lesson_id);
//   }
// })
// Lessons.create(lessons[2], {}, (error, data) => {
//   if (error) {
//     console.log(error.red);
//   } else {
//     let message = "Lesson Added to database!"
//     console.log(message.green, lessons[2].lesson_id);
//   }
// })
// Lessons.create(lessons[3], {}, (error, data) => {
//   if (error) {
//     console.log(error.red);
//   } else {
//     let message = "Lesson Added to database!"
//     console.log(message.green, lessons[3].lesson_id);
//   }
// })


// ADD TO USERS
// Users.create(users[0], {}, (error,data) => {
//   if (error) {
//     console.log(error.red);
//   } else {
//     let message = "User Added to database!"
//     console.log(message.green, users[0].user_id);
//   }
// })
// Users.create(users[1], {}, (error,data) => {
//   if (error) {
//     console.log(error.red);
//   } else {
//     let message = "User Added to database!"
//     console.log(message.green, users[1].user_id);
//   }
// })
// Users.create(users[2], {}, (error,data) => {
//   if (error) {
//     console.log(error.red);
//   } else {
//     let message = "User Added to database!"
//     console.log(message.green, users[2].user_id);
//   }
// })


// Query to check/get password
app.post('/', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const email = response.body.email;
  User.find({email:email}, {password:true}, (error, data) => {
    if (error) {
      console.log(err.red);
    } else {
      // data is the password object received
      // verify
      // add to session
      console.log(data);
      // response.json({data : data});
    }
  })
});

app.get('/:session/home', (request, response) => {
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
      console.log("Published: ", published)
      console.log("Unpublished: ", unpublished)
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


app.post('/:session/newPage', (request, response) => {
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

function buildQuery(input) {
  let obj = {
    published: 1, // 1 is true or 0 is false

    date: {$exists: true}, // UNIX time
    gradeStart: {$exists: true},
    gradeEnd: {$exists: true},
    theme: {$exists: true},
    unit: {$exists: true},
    subunit: {$exists: true},
    goal: {$exists: true},
    intro: {$exists: true},
    warmup: {$exists: true},
    reflection: {$exists: true},
    backup: {$exists: true},
    additional_game: {$exists: true},
    quote: {$exists: true},
    materials: [{
      item: {$exists: true},
      quantity: {$exists: true}
    }]
  }

  return obj;
}

app.post('/:session/search', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session;
  const user_id = sessions.get(session);
  // TODO: Clean input - query by whats given
  const finalQuery = buildQuery(input);

  Lessons.find(finalQuery, (error, data) => {
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
      console.log("Published: ", published)
      console.log("Unpublished: ", unpublished)
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
