module.exports = [
  {
    user_id: Number, // Should be secret
    isAdmin: Number, // 1 if true, 0 if false
    leader: Number, // 1 if true, 0 if false
    group: String, // Some Day?
    verified: Number,
    firstName: String, // meh
    lastName: String,
    password: String, // Should never be in plain text
    email: String, // visible
    confirmationID: String,
    position: String
  },
  {
    collection : 'users'
  },
  {
    lesson_id: Number, // unique id for lesson
    published: Number, // 1 is true or 0 is false
    creator: Number, // user ID
    datePublished: Number, //UNIX time

    lessonName: String,
    monthOfLesson:String,
    yearOfLesson:Number,

    subject:String,
    gradeStart: Number,
    gradeEnd: Number,
    semester:String,
    dayOfWeek:String,

    theme: String,
    unit: String,
    subunit: String,
    goal: String,
    introduction: String,
    warmup: String,
    mainActivity: String,
    backupActivity: String,
    reflection: String,
    materials: [{
      material: String,
      quantity: Number
    }]
  },
  {
    collection : 'lessons'
  }
];
