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
 * Connecting to the database
 * One database, 2 collections
 *    -
 */
const username = "beam_manager";
const password = "1320csci";
const url = "mongodb+srv://" + username + ":" + password + "@cluster0-auldt.mongodb.net/cs132beam";

const schemas = require('./schemas.js');
const usersSchema = new mongoose.Schema(schemas[0], schemas[1]);
const lessonsSchema = new mongoose.Schema(schemas[2], schemas[3]);
const Users = mongoose.model('Users', usersSchema);
// INDEX NEEDED FOR FULL TEXT QUERIES
const Lessons = mongoose.model('Lessons', lessonsSchema.index({'$**': 'text'}));

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
 * Server set up
 */
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


/*
 * Maps to keep track of people who've logged in
 * sessions: a map from session_id -> user_id
 * ids: a map from user_id -> session_id
 * names: a map from session_id -> name
 */
const sessions = new Map();
const ids = new Map();
const names = new Map();



/*
 *******************************************************************************
 * Admin functionality
 *******************************************************************************
 */
 app.delete('/:session_id/delete/:email', (request, response) => {
   console.log('- request received:', request.method.cyan, request.url.underline);
   response.status(200).type('html');

   const session_id = request.params.session_id;
   const user_id = sessions.get(session_id);
   const email = request.params.email;

   Users.findOneAndDelete({email: email}, (error, data) => {
     if (error) {
       console.log("Error!");
       response.json({deleted:false})
     } else {
       console.log("Deleted!");
       response.json({deleted:true,data:data});
     }
   })
})

 /*
  * Whenever you go to the admin page, this is called
  */
 app.get('/:session_id/adminsetup', (request, response) => {
   console.log('- request received:', request.method.cyan, request.url.underline);
   response.status(200).type('html');

   const session = request.params.session_id;
   const user_id = sessions.get(session);
   const query = {}
   const ret = {
     user_id:1,
     group:1,
     name:1,
     verified:1,
     leader:1,
     email:1,
     position:1
   }
   // future send email with update
   Users.find(query, ret, (error, data) => {
     if (error) {
       console.log(error, red)
       response.json({
         requests:[],
         users:[]
       })
     } else {

       // Seperate people who've signed up from those who have
       let requests = [];
       let users = [];
       for (let i = 0; i < data.length; i += 1) {
         if (data[i].verified === 0) {
           requests.push(data[i])
         } else {
           users.push(data[i])
         }
       }

       response.json({
         requests:requests,
         users:users
       })
     }
   })
 })

/*
 * Anytime the admin accepts someones invitation to join or not
 */
app.post('/:session_id/adminupdate', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');

  const session = request.params.session_id;
  const user_id = sessions.get(session);
  const query = { email: request.body.email }
  const update= { $set: request.body.toUpdate }
  Users.findOneAndUpdate(query, update, {new: true}, (error, data) => {
    if (error) {
      console.log(error, red, 'FALSE')
      response.json({
        resolved:false
      })
    } else {
      console.log(data, "TRUE");
      response.json({
        resolved:true
      })
    }
  })
})
/*
 *******************************************************************************
 * Homepage functionality
 *******************************************************************************
 */
 app.get('/:session_id/home', (request, response) => {
   console.log('- request received:', request.method.cyan, request.url.underline);
   response.status(200).type('html');
   const session = request.params.session_id;

   const user_id = sessions.get(session);
   Users.find({user_id:user_id},{isAdmin:1})
    .then((res) => {
      if (res.length < 1) {
        response.json({
          published:[],
          unpublished:[],
          isAdmin:0,
          name:names.get(session)
        });
        return;
      }
      const isAdmin = res[0].isAdmin;
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
          response.json({
            published:published,
            unpublished:unpublished,
            isAdmin:parseInt(isAdmin),
            name:names.get(session)
          });
          // TODO: Wrap and send back!
        }
      })
    })
 })
/*
 *******************************************************************************
 * Search functionality
 *******************************************************************************
 */

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
   const gsq = (fltr.gradeStart === "") ? ({$exists: true}): ({ $gte: fltr.gradeStart })
   const geq = (fltr.gradeEnd === "") ? ({$exists: true}): ({ $lte: fltr.gradeEnd })
   const filterQuery =
     {
       published: 1, // 1 is true or 0 is false
       semester: semester,
       dayOfWeek: weekday,
       monthOfLesson: month,
       yearOfLesson: year,
       subject: subject,
       gradeStart: gsq,
       gradeEnd: geq
     };

   const queries = [];
   queries.push(filterQuery);


   // TODO: make sure to check that gradeStart <= gradeEnd
   if (fltr.textSearch === "") {
     return filterQuery;
   } else {
     queries.push(textQuery);
   // TODO can you have an $and in an $and
   }
   return { $and: queries };
 }

 app.post('/:session_id/search', (request, response) => {
   console.log('- request received:', request.method.cyan, request.url.underline);
   response.status(200).type('html');

   const session = request.params.session_id;
   const user_id = sessions.get(session);

   // TODO: Clean input - query by whats given
   const finalQuery = buildQuery(request.body);
   Lessons.find(finalQuery, (error, data) => {
     if (error) {
       console.log(error.red)
     } else {
       response.json(data)
     }
   })
 })
/*
 *******************************************************************************
 * View/Edit page functionality
 *******************************************************************************
 */
 app.get('/:session_id/getpage/:lesson_id', (request, response) => {
   console.log('- request received:', request.method.cyan, request.url.underline);
   response.status(200).type('html');
   const session = request.params.session_id;
   const lesson_id = request.params.lesson_id;
   const user_id = sessions.get(session);
   Lessons.find({lesson_id:lesson_id}, (error, data) => {
     if (error) {
       console.log(error.red)
     } else {
       response.json({
         pageInfo: data,
         recieved:true
       })
     }
   })
 })

app.post('/:session_id/getpage/:lesson_id', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session_id;
  const lesson_id = request.params.lesson_id;
  const user_id = sessions.get(session);
  const created = request.body;
  created.creator = user_id;

  Lessons.findOneAndUpdate({lesson_id:lesson_id}, {$set: created}, {new: true}, (error, data) => {
    if (error) {
      console.log(error, red, 'FALSE')
      response.json({
        resolved:false
      })
    } else {
      // console.log(data, "TRUE");
      response.json({
        pageInfo: data,
        resolved:true
      })
    }
  })
})

app.get('/:session_id/viewpage/:lesson_id', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session_id;
  const lesson_id = request.params.lesson_id;
  const user_id = sessions.get(session);
  Lessons.find({lesson_id:lesson_id}, (error, data) => {
    if (error) {
      console.log(error.red)
    } else {
      response.json({
        pageInfo: data,
        recieved:true
      })
    }
  })
})
//console.log("hgeehesjndkjsnfkjdsnf")
app.post('/:session_id/updatelesson/:lesson_id', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session_id;
  const lesson_id = request.params.lesson_id;
  const user_id = sessions.get(session);
  const query = { lesson_id: lesson_id }
  const update= { $set: request.body }
  Lessons.findOneAndUpdate(query, update, {new: true}, (error, data) => {
    if (error) {
      console.log(error, red, 'FALSE')
      response.json({
        resolved:false
      })
    } else {
      console.log(data, "TRUE");
      response.json({
        resolved:true
      })
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
  created.creator = user_id;
  // unpublished, check if exists
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
        if (created.published === 0) {
          response.json({
            received:true,
            message:"Lesson was saved!"
           })
        } else {
          response.json({
            received:true,
            message:"Lesson was submitted!"
           })
        }

      }
    })
  })

/*
 *******************************************************************************
 * Authentication functionality
 *******************************************************************************
 */

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
  ids.set(user_id, sesh)
  names.set(sesh, name)
  return new Promise(function(resolve, reject) {
    resolve(sesh)
  });
}

app.post('/', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  params = request.body;

  Users.findOne({ email: params.email }, (error, res) => {
    if (error) {
      response.json({ loggedIn:false, message:"Something is terribly wrong" })
    } else {
      if (res === null) {
        response.json({ loggedIn:false, message:"User does not exist." })
      } else {
        return res;
      }
    }
  }).then((potentialUser) => {
    if (potentialUser !== null) {
      const hash = potentialUser.password;

      if (bcrypt.compareSync(request.body.password, hash)) {
        if (potentialUser.verified) {
          session(potentialUser.firstName, potentialUser.user_id)
            .then((session) => {
              response.json({
                loggedIn:true,
                session:session,
                isLeader:potentialUser.leader,
                name:potentialUser.firstName,
                isAdmin:potentialUser.isAdmin
              })
            })
        } else {
          response.json({
            loggedIn:false,
            message:"User is not verified."
          })
        }

      } else {
        response.json({
          loggedIn:false,
          message:"Passwords do not match."
        })
      }
    } else {
      response.json({loggedIn:false, message:"Something is terribly wrong pt.2"})
    }
  })
});

// TODO: LOWERCASE EVERYTHING
app.post('/signup', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const plain = request.body.password;
  const user = {
    isAdmin: 0, // 1 if true, 0 if false
    leader: 0, // 1 if true, 0 if false
    group: "Group", // Some Day?
    verified: 0,
    email: request.body.email, // TODO clean and verify & UNIQUE
    firstName: request.body.first, // TODO clean and verify
    lastName: request.body.last,
    confirmationID: "None",
    position: "None"
  }
  const confirmationID = genID();
  Users.find({}, {user_id:1})
    .then((res) => {
      if (res.length < 1) {
        user.user_id = 0;
        // return Users.create(created)
        return false;
      } else {
        let arr = res.map(x => x.user_id)
        const new_id = Math.max(...arr) + 1;
        user.user_id = parseInt(new_id);
         // return Lessons.create(created) // TODO: Change to null to see error!
        return true;
      }
    })
    .then((res) => {
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(plain, salt, function(err, hash) {
             //store hash in db
            user.password = hash;
            Users.create(user);
        });
      });
    })
    .then((res) => {
      Users.find({user_id:user.user_id},(error, res) => {
        if (error) {
          response.json({created:false})
        } else {
          response.json({created:true})
        }
      });
    })
});

app.post('/passwordreset', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');

  var confirmationID = request.body.confirmationID
  var newPassword = request.body.password
  Users.find({ 'confirmationID': confirmationID }, 'email confirmationID', function (err, user) {

    trueID = user[0].confirmationID;
    userEmail = user[0].email;

    var inputID = request.body.confirmationID;

    if(inputID === trueID){

      newConfirmationID = genID();


      Users.updateOne(
        {'email': userEmail},
        {
        $set: {'password': newPassword, 'confirmationID': newConfirmationID}
        }
      );
      console.log("password succesfully changed to: " + user[0].password)
      console.log("confirmationID succesfully changed to: " + user[0].confirmationID)
    }else{
      console.log('no match')
    }

  });
});




















app.post('/forgotpassword', (request, response) => {
  var confirmationID = '';
  Users.find({ 'email': request.body.email }, 'email confirmationID', function (err, user) {
    confirmationID = user[0].confirmationID;

    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'beamapptestemail@gmail.com',
      pass: 'beambeambeam'
    }
    });

    var mailOptions = {
    from: 'beamapptestemail@gmail.com',
    to: request.body.email,
    subject: 'BEAM Password Reset',
    text: 'Click the following link http://localhost:3000/resetpassword and enter the following code: ' + confirmationID
    };


    // transporter.sendMail(mailOptions, function(error, info){
    // if (error) {
    //   console.log(error);
    // } else {
    //   console.log('Email sent: ' + info.response);
    // }
    // });


  });

});








app.get('*', function(request, response){
    console.log('- request received:', request.method.red, request.url.underline);
    console.log('404 - Not Found'.red)
    response.status(404).type('html');

});
app.listen(8080);
console.log('App is listening on port 8080'.grey);
