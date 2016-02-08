var mongoose = require('mongoose');

var InterpretationSchema = new mongoose.Schema({
owner: String,
derivedData: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DerivedData'
  }]
});

mongoose.model('Interpretation', InterpretationSchema);
