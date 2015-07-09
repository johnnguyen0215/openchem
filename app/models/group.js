var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var GroupSchema   = new Schema({
	name: {type: String, required: true},
	id: {type: Number, required: true},
	members: { type: Array, required: false},
	questions: { type: Array, required: false}
});

GroupSchema.pre('save', function(next) {
	next();
});

module.exports = mongoose.model('Group', GroupSchema);