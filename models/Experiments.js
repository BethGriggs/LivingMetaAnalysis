var mongoose = require('mongoose');

var ExperimentSchema = new mongoose.Schema({
  experimentRef: String,
  titleOfPaper: String,
  authors: String,
  year: String,
  link: String,
  tags: String,
  derivedData: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interpretation'
  }]
});

mongoose.model('Experiment', ExperimentSchema);
