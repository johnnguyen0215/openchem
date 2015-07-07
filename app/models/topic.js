var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// course schema 
var TopicSchema   = new Schema({
	topicName: { type: String, required: true},
	videoId: { type: String, required: true},
	videoUrl: { type: String, required: true},
	videoDescription: {type: String, required: true},
	keywords: { type: Array, required: true},
	chemText: { type: Array, required: false},
	practiceProblems: { type: Array, required: false}
});

TopicSchema.pre('save', function(next) {
	next();
});


module.exports = mongoose.model('Topic', TopicSchema);