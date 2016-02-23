var mongoose = require('mongoose');

var MetaAnalysisSchema = new mongoose.Schema({
  title: String,
  description: String
});

mongoose.model('MetaAnalysis', MetaAnalysisSchema);
