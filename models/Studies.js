var mongoose = require('mongoose');

var StudySchema = new mongoose.Schema({
  title: String,
  author: [String],
  year: Number,
  comments: [String],
  experiments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Experiment'}]
});

mongoose.model('Study', StudySchema);
