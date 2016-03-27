var mongoose = require('mongoose');

var StudySchema = new mongoose.Schema({
  title: String,
  author: String,
  year: String,
  link: String,
  tags: String,
  derivedData: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interpretation'
  }]
});

mongoose.model('Study', StudySchema);
