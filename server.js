const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const passport = require("passport");
const uuidv1 = require('uuid/v1');
const nodemailer = require('nodemailer');

/*
 * bcrypt constants
 */
const saltRounds = 10;


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
const ids = new Map();
const names = new Map(); // session to NAME

sessions.set("abc123",1) // fake user REMOVE once login is made
ids.set(1,"abc123")
names.set("abc123","Jennifer") // ^^^

/*
 * Generates UUID
 */
function genUUID() {
  return uuidv1();
}

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

  const user_id = sessions.get(session);

  Lessons.find({creator:user_id}, (error, data) => {
    // console.log(data)
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
  const created = request.body;
  created.yearOfLesson = 1000; // TODO Change to numbers?
  created.creator = user_id;
  Lessons.find({}, {lesson_id:1})
    .then((res) => {
      if (res.length < 1) {
        created.lesson_id = 0;
        return Lessons.create(created)
      } else {
        let arr = res.map(x => x.lesson_id)
        const new_id = Math.max(...arr) + 1;
        created.lesson_id = new_id;
        return Lessons.create(created) // TODO: Change to null to see error!
      }
    })
    .then((res, error) => {
      if (typeof res === "undefined") {
        response.json({
          received:false,
          message:"Unable to submit lesson"
        })
      } else {
        response.json({
          received:true,
          message:"Lesson was submitted!"
         })
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


app.post('/forgotpassword', (request, response) => {
  confirmationID = genID();
  Users.find({ 'email': request.body.email }, 'email confirmationID', function (err, user) {
    console.log(user[0].confirmationID);


  });

  // console.log('request-received');
  // var transporter = nodemailer.createTransport({
  // service: 'gmail',
  // auth: {
  //   user: 'beamapptestemail@gmail.com',
  //   pass: 'beambeambeam'
  // }
  // });
  //
  //
  //
  // var mailOptions = {
  // from: 'beamapptestemail@gmail.com',
  // to: request.body.email,
  // subject: 'BEAM Password Reset',
  // text: 'Click the following link http://localhost:3000/resetpassword and enter the following code: ' + confirmationID
  // };
  //
  // transporter.sendMail(mailOptions, function(error, info){
  // if (error) {
  //   console.log(error);
  // } else {
  //   console.log('Email sent: ' + info.response);
  // }
  // });



});


app.post('/signup', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  const first_name = request.body.first
  const last_name = request.body.last
  const email = request.body.email
  const password = request.body.password
  const sesh = genUUID();
  const user_id = genUUID();
  const confirmationID = genID();
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        //store hash in db
        var user = new Users({
            verified: 0,
            user_id: user_id, // Should be secret
            password: hash, // Should never be in plain text
            email: email, // visible
            name: last_name+","+first_name // meh
          });
          user.save(function(error) {
            console.log("Your user has been saved!");
            sessions.set(sesh, user_id);
            console.log(sessions);
            if (error) {
              console.error(error);
            }
          });

    });

});
  response.status(200).type('html');
  response.render
});

app.post('/', (request, response) => {
  console.log('post req still works')
  console.log('- request received:', request.method.cyan, request.url.underline);
  var correctPass = '';
    Users.find({ 'email': request.body.email }, 'email password', function (err, user) {
    if (err) return handleError(err);
    // 'email' contains the list of athletes that match the criteria.

     //correct password
    hash = user[0].password;
    plainText = request.body.password
    bcrypt.compare(plainText, hash, function(err, res) {
    if(res){
      console.log(user)

      console.log(user[0]._id)
      sessions.set(genUUID(), user[0]._id);
      console.log(sessions);
    } else {
      console.log("comparison failed");
    }
    console.log(res);
    });
    console.log(plainText);
    console.log(correctPass);

  });




//   const password = request.body.password
//   passport.use(new LocalStrategy(function(username, password, cb) {
//     console.log('got inside passport fn')
//   //Locate user first here
//   bcrypt.compare(password, user[0].password, function(err, res) {
//
//     if (err) return cb(err);
//
//     if (res === false) {
//       return cb(null, false);
//       console.log('error')
//     } else {
//       return cb(null, user);
//       console.log('success')
//     }
//   });
// }));
// console.log('is it just skipping it')
//   Users.find({ 'email': request.body.email }, 'email password', function (err, user) {
//   if (err) return handleError(err);
//   // 'email' contains the list of athletes that match the criteria.
//
//   user[0].password; //correct password
//
//
//
//
//
//   })
//
//   response.status(200).type('html');
//   response.render
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
