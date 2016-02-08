var mongoose = require('mongoose');

// may potentially need to change this to handle differing data types
var DerivedDataSchema = new mongoose.Schema({
   characteristic: String,
   comment: String,
   value: String
});

mongoose.model('DerivedData', DerivedDataSchema);
