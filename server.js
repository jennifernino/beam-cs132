const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const cors = require('cors');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const passport = require("passport");
const uuidv1 = require('uuid/v1');
const nodemailer = require('nodemailer');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const token_stuff = require('./token.json');
const { installed } = require('./credentials.json');

/*******************************************************************************
 *******************************************************************************
 *******************************************************************************
 * OAuth2 functionality
 *******************************************************************************
 *******************************************************************************
 *******************************************************************************/
// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), listLabels);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      //console.log('Labels:');
      labels.forEach((label) => {
        // console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}

/*
 * Set up email
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    clientId: installed.client_id,
    clientSecret: installed.client_secret
  }
});

/*******************************************************************************
 *******************************************************************************
 *******************************************************************************
 * Database set up functionality
 *******************************************************************************
 *******************************************************************************
 *******************************************************************************/
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
const Lessons = mongoose.model('Lessons', lessonsSchema.index({
  '$**': 'text'
}));

mongoose.connect(url, {
  useNewUrlParser: true
}, function(error, resolve) {
  if (error) {
    let err = 'ERROR: Unable to connect to ' + url;
    console.log(err.red);
  } else {
    let res = 'SUCCESS: Connected to ' + url;
    console.log(res.green);
  }
});


/*******************************************************************************
 *******************************************************************************
 *******************************************************************************
 * Server setup
 *******************************************************************************
 *******************************************************************************
 *******************************************************************************/
/*
 * Server set up
 */
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
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
const saltRounds = 10; // for bcrypt
/*******************************************************************************
 *******************************************************************************
 *******************************************************************************
 * Admin functionality
 *******************************************************************************
 *******************************************************************************
 *******************************************************************************/

/*
 * Deletes a user who has signed up, but the admin doesn't verify them
 */
app.delete('/:session_id/delete/:email', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');

  const session_id = request.params.session_id;
  const user_id = sessions.get(session_id);
  const email = request.params.email;

  Users.findOneAndDelete({
    email: email
  }, (error, data) => {
    if (error) {
      console.log("Error!");
      response.json({
        deleted: false
      })
    } else {
      console.log("Deleted!");
      response.json({
        deleted: true,
        data: data
      });
    }
  })
})

/*
 * Sets up the admin page
 */
app.get('/:session_id/adminsetup', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');

  const session = request.params.session_id;
  const user_id = sessions.get(session);
  const query = {}
  const ret = {
    user_id: 1,
    group: 1,
    name: 1,
    verified: 1,
    leader: 1,
    email: 1,
    position: 1
  }
  // future send email with update
  Users.find(query, ret, (error, data) => {
    if (error) {
      console.log(error, red)
      response.json({
        requests: [],
        users: []
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
        requests: requests,
        users: users
      })
    }
  })
})

/*
 * anytime the admin accepts someones invitation to join or not
 */
app.post('/:session_id/adminupdate', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');

  const session = request.params.session_id;
  const user_id = sessions.get(session);
  const query = {
    email: request.body.email
  }
  const update = {
    $set: request.body.toUpdate
  }
  Users.findOneAndUpdate(query, update, {
    new: true
  }, (error, data) => {
    if (error) {
      console.log(error, red, 'FALSE')
      response.json({
        resolved: false
      })
    } else {
      console.log(data, "TRUE");
      response.json({
        resolved: true
      })
    }
  })
})
/*******************************************************************************
 *******************************************************************************
 *******************************************************************************
 * Homepage functionality
 *******************************************************************************
 *******************************************************************************
 *******************************************************************************/

/*
 * Sets up the homepage of any login
 */
app.get('/:session_id/home', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session_id;

  const user_id = sessions.get(session);
  Users.find({
      user_id: user_id
    }, {
      isAdmin: 1
    })
    .then((res) => {
      if (res.length < 1) {
        response.json({
          published: [],
          unpublished: [],
          isAdmin: 0,
          name: names.get(session)
        });
        return;
      }
      const isAdmin = res[0].isAdmin;
      Lessons.find({
        creator: user_id
      }, (error, data) => {
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
            published: published,
            unpublished: unpublished,
            isAdmin: parseInt(isAdmin),
            name: names.get(session)
          });
          // TODO: Wrap and send back!
        }
      })
    })
})

/*******************************************************************************
 *******************************************************************************
 *******************************************************************************
 * Search functionality
 *******************************************************************************
 *******************************************************************************
 *******************************************************************************/


/*
 * builds a query for a search given all the options passed in
 */
function buildQuery(fltr) {
  const textQuery = {
    $text: {
      $search: fltr.textSearch
    }
  };
  if (fltr.hasResponses) {
    return textQuery;
  }

  const semester = (fltr.semester === "") ? {
    $exists: true
  } : fltr.semester;
  const weekday = (fltr.weekday === "") ? {
    $exists: true
  } : fltr.weekday;
  const month = (fltr.month === "") ? {
    $exists: true
  } : fltr.month;
  const year = (fltr.year === "") ? {
    $exists: true
  } : fltr.year;
  const subject = (fltr.subject === "") ? {
    $exists: true
  } : fltr.subject;
  const gsq = (fltr.gradeStart === "") ? ({
    $exists: true
  }) : ({
    $gte: fltr.gradeStart
  })
  const geq = (fltr.gradeEnd === "") ? ({
    $exists: true
  }) : ({
    $lte: fltr.gradeEnd
  })
  const filterQuery = {
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

  if (fltr.textSearch === "") {
    return filterQuery;
  } else {
    queries.push(textQuery);
  }
  return {
    $and: queries
  };
}

/*
 * search query, gets all lesons that satisfy the options passed in
 */
app.post('/:session_id/search', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');

  const session = request.params.session_id;
  const user_id = sessions.get(session);
  const finalQuery = buildQuery(request.body);

  Lessons.find(finalQuery, (error, data) => {
    if (error) {
      console.log(error.red)
    } else {
      response.json(data)
    }
  })
})
/*******************************************************************************
 *******************************************************************************
 *******************************************************************************
 * View/Edit page functionality
 *******************************************************************************
 *******************************************************************************
 *******************************************************************************/

/*
 * Gets the specific details for a given lesson
 */
app.get('/:session_id/getpage/:lesson_id', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session_id;
  const lesson_id = request.params.lesson_id;
  const user_id = sessions.get(session);
  Lessons.find({
    lesson_id: lesson_id
  }, (error, data) => {
    if (error) {
      console.log(error.red)
      response.json({
        received: false,
        message: 'Something went terribly wrong'
      })
    } else {
      if (typeof data === "undefined" || data === null) {
        response.json({
          pageInfo: null,
          received: false
        })
      } else {
        response.json({
          pageInfo: data,
          received: true
        })
      }
    }
  })
})

/*
 * Saves a lesson when you go back and edit it OR when you do multiple saves in
 * new page
 */
app.post('/:session_id/getpage/:lesson_id', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session_id;
  const lesson_id = request.params.lesson_id;
  const user_id = sessions.get(session);
  const created = request.body;
  created.creator = user_id;

  Lessons.findOneAndUpdate({
    lesson_id: lesson_id
  }, {
    $set: created
  }, {
    new: true
  }, (error, data) => {
    if (error) {
      console.log(error, red, 'FALSE')
      response.json({
        resolved: false
      })
    } else {
      // console.log(data, "TRUE");
      response.json({
        pageInfo: data,
        resolved: true
      })
    }
  })
})

/*
 * Gets a page given a lesson for purposes of JUST viewing the page
 */
app.get('/:session_id/viewpage/:lesson_id', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session_id;
  const lesson_id = request.params.lesson_id;
  const user_id = sessions.get(session);
  Lessons.find({
    lesson_id: lesson_id
  }, (error, data) => {
    if (error) {
      console.log(error.red)
    } else {
      response.json({
        pageInfo: data,
        received: true
      })
    }
  })
})

/*
 * Updates a lesson when you add a reflection
 */
app.post('/:session_id/updatelesson/:lesson_id', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session_id;
  const lesson_id = request.params.lesson_id;
  const user_id = sessions.get(session);
  const query = {
    lesson_id: lesson_id
  }
  const update = {
    $set: request.body
  }
  Lessons.findOneAndUpdate(query, update, {
    new: true
  }, (error, data) => {
    if (error) {
      console.log(error, red, 'FALSE')
      response.json({
        resolved: false
      })
    } else {
      response.json({
        resolved: true
      })
    }
  })
})

/*
 * adds a new lesson
 */
app.post('/:session_id/newPage', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  const session = request.params.session_id;
  const user_id = sessions.get(session);
  const created = request.body;
  created.creator = user_id;

  Lessons.find({}, {
      lesson_id: 1
    })
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
          received: false,
          message: "Unable to submit lesson"
        })
      } else {
        if (created.published === 0) {
          response.json({
            received: true,
            message: "Lesson was saved!"
          })
        } else {
          response.json({
            received: true,
            message: "Lesson was submitted!"
          })
        }

      }
    })
})

/*
 * Deletes a lesson you started but never finished
 */
app.delete('/:session_id/deleteLesson/:lesson_id', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');

  const session_id = request.params.session_id;
  const user_id = sessions.get(session_id);
  const lesson_id = request.params.lesson_id;

  Lessons.findOneAndDelete({
    lesson_id: lesson_id
  }, (error, data) => {
    if (error) {
      console.log("Error!");
      response.json({
        deleted: false
      })
    } else {
      console.log("Deleted!");
      response.json({
        deleted: true,
        data: data
      });
    }
  })
})
/*******************************************************************************
 *******************************************************************************
 *******************************************************************************
 * Authentication functionality
 *******************************************************************************
 *******************************************************************************
 *******************************************************************************/


/*
 * Gets an ID
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
 * Adds session_id to map
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

/*
 * When the user logs in
 */
app.post('/', (request, response) => {
  console.log('- request received:', request.method.cyan, request.url.underline);
  response.status(200).type('html');
  params = request.body;

  // Check if user exists
  Users.findOne({
    email: params.email
  }, (error, res) => {
    if (error) {
      response.json({
        loggedIn: false,
        message: "Something is terribly wrong"
      })
    } else {
      if (typeof res === "undefined" || res === null) {
        response.json({
          loggedIn: false,
          message: "User does not exist."
        })
      } else {

        return res;
      }
    }
  })
  // checks if user is verified
  .then((potentialUser) => {
    if (typeof potentialUser !== "undefined" && potentialUser !== null) {
      const hash = potentialUser.password;

      // checks if has correct password
      if (bcrypt.compareSync(request.body.password, hash)) {
        if (potentialUser.verified) {
          session(potentialUser.firstName, potentialUser.user_id)
            .then((session) => {
              response.json({
                loggedIn: true,
                session: session,
                isLeader: potentialUser.leader,
                name: potentialUser.firstName,
                isAdmin: potentialUser.isAdmin
              })
            })
        } else {
          response.json({
            loggedIn: false,
            message: "User is not verified."
          })
        }

      } else {
        response.json({
          loggedIn: false,
          message: "Passwords do not match."
        })
      }
    }
  })
});

/*
 * User signs up
 */
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
  Users.find({email:request.body.email})
  .then((res) => {
    if (res.length > 0) {
      return new Promise(function(resolve, reject) {
        resolve(false);
      });
    }
    return new Promise(function(resolve, reject) {
      resolve(true);
    });
  })
  .then((res) => {
    if (res) {
      return Users.find({}, {user_id: 1})
    } else {
      return new Promise(function(resolve, reject) {
        resolve(null);
      });
    }
  })
  .then((res) => {
    if (typeof res === "undefined" || res === null) {
      return null;
    }
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
    if (typeof res === "undefined" || res === null) {
      return null;
    } else {
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(plain, salt, function(err, hash) {
          //store hash in db
          user.password = hash;
          Users.create(user);
        });
      });
      return true;
    }
  })
  .then((res) => {
    console.log(res)
    if (typeof res === "undefined" || res === null) {
      response.json({
        created: false
      })
    } else {
      response.json({
        created: true
      })
    }
  })
});

/*
 * Send confirmation id to user
 */
app.get('/resetPassword/:email', (request, response) => {
  const email = request.params.email;

  const confirmation = genID();
  Users.findOneAndUpdate({email:email},{confirmationID:confirmation}, {new:true})
  .then((data) => {
    if (typeof data === "undefined" || data === null) {
      console.log("Not Found")
      return new Promise(function(resolve, reject) {
        resolve(false);
      });
    } else {
      console.log("Found")

      return new Promise(function(resolve, reject) {
        resolve(true);
      });
    }

  })
  .then((res) => {
    console.log(res)
    if (res) {
      console.log("YES@@@")
      const mailOptions = {
        from: 'beamcs132@gmail.com',
        to: email,
        subject: 'Reset Password - BEAM Applciation',
        text: 'Confirmation ID: ' + confirmation,
        auth: {
          user: 'beamcs132@gmail.com',
          accessToken: token_stuff.access_token,
          refreshToken: token_stuff.refresh_token,
          expires: token_stuff.expiry_date
        }
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('ERROR ==>', error)
          console.log("NOT SENT")
          response.json({sent:false})
        } else {
          console.log("SENT", info)
          console.log('Email sent: ' + info.response);
          response.json({sent:true})
        }
      })
    } else {
      response.json({sent:false})
    }
  })
  .catch((err) => {
    console.log(err)
  })
})

/*
 * submit password change when user inputs confirmation id
 */

app.post('/resetPassword/:email', (request, response) => {
  const email = request.params.email;
  const confirmation = request.body.confirmation;
  console.log('confirmation ', confirmation)
  const newpass = request.body.newpass;
  console.log('pass ', newpass)
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(newpass, salt, function(err, hash) {
      //store hash in db
      const update = {password:hash}
      Users.findOneAndUpdate(
        {
          email: email,
          confirmationID:confirmation
        },
        update,
        (error, data) => {
          if (error) {
            console.log("ERROR HERE")
            response.json({
              passReset: false
            })
          } else {
            if (typeof data === "undefined" || data === null) {
              console.log("ERROR THERE")
              response.json({
                passReset: false
              })
            } else {
              response.json({
                passReset: true
              })
            }
          }
      })
    });
  });
})

/*******************************************************************************
 *******************************************************************************
 *******************************************************************************
 * Inspiration functionality
 *******************************************************************************
 *******************************************************************************
 *******************************************************************************/

app.post('/inspiration', (request, response) => {
  Lessons.find({
    'published': 1
  }, 'warmup mainActivity theme', function(err, lessons) {
    response.json(lessons);
  });
});

app.get('*', function(request, response) {
  console.log('- request received:', request.method.red, request.url.underline);
  console.log('404 - Not Found'.red)
  response.status(404).type('html');

});
app.listen(8080);
console.log('App is listening on port 8080'.grey);
