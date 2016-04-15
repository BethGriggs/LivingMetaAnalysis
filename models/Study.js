var mongoose = require('mongoose');

var StudySchema = new mongoose.Schema({
  identifier: String,
  title: String,
  author: String,
  year: String,
  link: String,
  tags: [String],
  derivedData: [{
    property: String,
    value: String,
    comment: String,
    addedBy: String
  }]
});

mongoose.model('Study', StudySchema);
