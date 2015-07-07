var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// course schema 
var LectureSchema   = new Schema({
	lectureName: { type: String},
	videoId: { type: String},
	videoUrl: { type: String},
	videoDescription: {type: String},
	keywords: { type: Array},
	chemTextUrls: { type: Array}
});

LectureSchema.pre('save', function(next) {
	next();
});


module.exports = mongoose.model('Lecture', LectureSchema);