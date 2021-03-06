var mongoose = require('mongoose');

// Meta-analysis schema
var MetaAnalysisSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: String,
  tags: [String],
  properties: [String],
  studies: [{type: mongoose.Schema.Types.ObjectId,
      ref: 'Study'}]
});

mongoose.model('MetaAnalysis', MetaAnalysisSchema);
