module.exports = [
  {
    verified: Number,
    user_id: String, // Should be secret
    password: String, // Should never be in plain text
    email: String, // visible
    name: String // meh
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
    additionalGame: String,
    quote: String,
    materials: String
    // materials: [{
    //   item: String,
    //   quantity: Number
    // }]
  },
  {
    collection : 'lessons'
  }
];
