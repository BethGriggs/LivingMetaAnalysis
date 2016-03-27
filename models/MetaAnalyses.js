var mongoose = require('mongoose');

var MetaAnalysisSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: String,
  testJson: String
});

mongoose.model('MetaAnalysis', MetaAnalysisSchema);
