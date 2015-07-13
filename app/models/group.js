var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var GroupSchema   = new Schema({
	name: {type: String, required: true},
	leaders: {type: Array, required: true},
	members: { type: Array, required: false},
	discussionTopics: { type: Array, required: false}
});

GroupSchema.pre('save', function(next) {
	next();
});

module.exports = mongoose.model('Group', GroupSchema);