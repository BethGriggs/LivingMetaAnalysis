var mongoose = require('mongoose');

var DerivedDataSchema = new mongoose.Schema({
   property: String,
   comment: String,
   value: String
});

mongoose.model('DerivedData', DerivedDataSchema);
