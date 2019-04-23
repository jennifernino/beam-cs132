module.exports = [
  {
    user_id: Number, // Should be secret
    password: String, // Should never be in plain text
    email: String, // visible
    name: String // meh
  },
  {
    collection : 'users'
  },
  {
    lesson_id: Number, // unique id # for lesson
    published: Number, // 1 is true or 0 is false
    creator: Number, // user ID

    semester: String,
    dayOfWeek:String,
    date: Number, // UNIX time
    gradeStart: Number,
    gradeEnd: Number,
    theme: String,
    unit: String,
    subunit: String,
    goal: String,
    intro: String,
    warmup: String,
    reflection: String,
    backup: String,
    additional_game: String,
    quote: String,
    materials: [{
      item: String,
      quantity: Number
    }]
  },
  {
    collection : 'lessons'
  }
];
