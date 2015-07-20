var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Topic      = require('../models/topic');
var Group      = require('../models/group');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var fs         = require('fs');
var multer 	   = require('multer');
var mongoose   = require('mongoose');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {
	  console.log('authenticating');
	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('_id name email username password admin groups groupInvites leader').exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({ 
	      	success: false, 
	      	message: 'Authentication failed. User not found.' 
	    	});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({ 
	        	success: false, 
	        	message: 'Authentication failed. Wrong password.' 
	      	});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	_id: user._id,
	        	name: user.name,
	        	email: user.email,
	        	username: user.username,
	        	admin: user.admin,
	        	groups: user.groups,
	        	groupInvites: user.groupInvites,
	        	leader: user.leader,
	        }, superSecret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	  });
	});

	// route middleware to verify a token
	apiRouter.use(
		multer({dest:'./uploads',
			rename: function(fieldname, filename){
				return filename;
			},
			onFileUploadStart: function(file){
				console.log(file.originalname + ' is starting ...')
			},
			onFileUploadComplete: function(file){
				console.log(file.filename + ' uploaded to ' + file.path)
				done = true;
			}
		}),
		function(req, res, next) {
		// do logging

		console.log('Somebody just came to our app!');

		var token = req.body.token || req.query.token || req.headers['x-access-token'];
	  	// check header or url parameters or post parameters for token
	  	if (token) {

	    	// verifies secret and checks exp
		    jwt.verify(token, superSecret, function(err, decoded) {      
		    	console.log('verifying token');
		      if (err) {
		        res.status(403).send({ 
		        	success: false, 
		        	message: 'Failed to authenticate token.' 
		    	});  	   
		      } else { 
		        // if everything is good, save to request for use in other routes
		        req.decoded = decoded;
		        next(); // make sure we go to the next routes and don't stop here
		      }
		    });

		}
		else if (req.param('id') == 'create' || req.query.q || req.path == "/upload"){
			next();
		}
		else {
			console.log(req.path);
		// if there is no token
		// return an HTTP response of 403 (access forbidden) and an error message
		 	res.status(403).send({ 
		 		success: false, 
		 		message: 'No token provided.' 
		 	});

		}
	});

	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

/*****************USER ROUTING *************************/
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			var user = new User();		// create a new instance of the Topic model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.email = req.body.email;
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)
			user.save(function(err) {
				console.log(err);
				if (err) {
					// duplicate entry
					if (err.code == 11000){
						return res.json({ success: false, message: 'A user with that username already exists. '});
					}
					else {
						return res.send(err);
					}
				}
				else{
					res.json({ message: 'User created!' });
				}
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body._id) user._id = req.body._id;
				if (req.body.name) user.name = req.body.name;
				if (req.body.email) user.email = req.body.email;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				if (req.body.admin) user.admin = req.body.admin;
				if (req.body.leader) user.leader = req.body.leader;
				if (req.body.groups) user.groups = req.body.groups;
				if (req.body.groupInvites) user.groupInvites = req.body.groupInvites;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.send('User updated!');
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			Topic.remove({_id: req.params.user_id}, 
				function(err, user) {
					if (err){ 
						res.send(err)
					}
					else{
						res.json({ message: 'Successfully deleted' });
					}
			});
		});

//	db.groups.find({name:"Hector Group"}, {_id:1}).forEach(function(doc){db.users.update({username:"john"},{$push:{groups:doc._id}})})

	apiRouter.put('/insertLeaderGroup',function(req,res){
		Group.find({name:req.body.groupName}, {_id:1}, function(err,doc){
			if (err){
				res.send(err);
			}
			else{
				User.update({_id:req.body.leaderId},
						{$push:{groups:doc[0]._id, 'leader.groups':doc[0]._id}, $inc:{'leader.groupsCreated':1}},
						function(err){
							if(err){
								res.send(err);
							}
							else{
								res.send("Leader Groups have been updated");
							}
						})
			}
		})
	})

	apiRouter.put('/updateUserGroups', function(req,res){
		User.update(
			{groups:req.body.group_id}, 
			{$set:{"groups.$":req.body.newGroupName, "leader.groups.$":req.body.newGroupName}},
			function(err){
				if(err) res.send(err);
				res.json({message: "Updated Group"});
			});
	}
)
	apiRouter.delete('/deleteFromUsers/:groupId', function(req,res){
		console.log(req.params.groupId);
		User.update({}, {$pull:{'groups':mongoose.Types.ObjectId(req.params.groupId), 'leader.groups':mongoose.Types.ObjectId(req.params.groupId)}}, {multi:true}, 
			function(err){
				if (err) res.send(err);
				res.json({message:'Successfully removed from groups'});
			});
	})

	apiRouter.delete('/decrementGroupsCreated/:leaderId', function(req,res){
		User.findByIdAndUpdate(req.params.leaderId, 
			{$inc:{'leader.groupsCreated':-1}},
			function(err){
				if(err) res.send(err);
				res.json({message:'successfully decremented'});
			});
	})


	apiRouter.put('/invite/:email', function(req,res){
		User.findOneAndUpdate(
			{email:req.params.email}, 
			{$push: { groupInvites: req.body  }}, 
			function(err,user){
				if (err){
					res.send(err);
					res.json({message:"invite sent"});
				}
				else{
					res.json(user);
				}
			});
	})



/***************** GROUP ROUTING *************************/

	apiRouter.route('/group')
		.post(function(req,res){
			var group = new Group();
			group.name = req.body.name;
			group.leaders = req.body.leaders;
			group.save(function(err){
				if(err){
					console.log(err);
					if (err.code == 11000){
						return res.json({ success: false, error: 'A group with that name already exists. '});
					}
					else {
						return res.send(err);
					}
				}
				else{
					res.json({message: "Successfully added Group"});
				}

			})
		})


	apiRouter.route('/group/:group_id')
		.put(function(req, res){
			Group.findById(req.params.group_id, function(err, group){
				if (err) res.send(err);

				// set the group information
				if (req.body._id) group._id = req.body._id;
				if (req.body.name) group.name = req.body.name;
				if (req.body.leaders) group.leaders = req.body.leaders;
				if (req.body.members) group.members = req.body.members;
				if (req.body.discussionTopics) group.discussionTopics = req.body.discussionTopics;

				group.save(function(err){
					if (err) res.send(err);
					res.send('Group updated');
				})
			})
		})
		.delete(function(req,res){
			Group.remove({
				_id: req.params.group_id
			}, 
			function(err) {
				if (err) res.send(err);
				res.json({message: "Group has been deleted"});
			});	
		});

	apiRouter.post('/getGroups', function(req,res){
		Group.find({
			_id: {$in: req.body.groups}
		}, 
		function(err, groups){
			if (err){
				res.send(err);
			}
			else{
				res.json(groups);
			}
		});

	})



/*****************ADMIN ROUTING *************************/
	apiRouter.route('/admin')
		.post(function(req, res) {
			var topic = new Topic();		// create a new instance of the topic model
			topic.topicName = req.body.topicName;  // set the topic's name (comes from the request)
			topic.videoId = req.body.videoId; // set the youtube id to generate a thumbnail image
			topic.videoUrl = req.body.videoUrl;  // set the video youtube video url
			topic.videoDescription = req.body.videoDescription;  // set the youtube video description
			topic.keywords = req.body.keywords; // set the keywords for the topic
			topic.chemText = req.body.chemText; // set the array of chem text urls
			topic.practiceProblems = req.body.practiceProblems;
			topic.save(function(err) {
				console.log(err);
				if (err) {
					// duplicate entry
					if (err.code == 11000){
						return res.json({ success: false, message: 'A user with that username already exists. '});
					}
					else {
						return res.send(err);
					}
				}

				// return a message
				res.json({ message: 'Topic successfully uploaded!' });
			});
		})

		// get all the topics (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {
			Topic.find({}, function(err, topics) {
				if (err) res.send(err);

				// return the topics
				res.json(topics);
			});
		});

	apiRouter.route('/admin/uploadDirectory')
		.get(function(req,res){
			var directory = fs.readdirSync('./uploads');
			res.send(directory);
		})

	apiRouter.route('/admin/:topic_id')
		//get the topic with that id
		.get(function(req, res) {
			Topic.findById(req.params.topic_id, function(err, topic) {
				if (err) res.send(err);

				// return that topic
				res.json(topic);
			});
		})

		// update the topic with this id
		.put(function(req, res) {
			Topic.findById(req.params.topic_id, function(err, topic) {

				if (err) res.send(err);

				// set the new topic information if it exists in the request
				if (req.body.topicName) topic.topicName = req.body.topicName;
				if (req.body.videoId) topic.videoId = req.body.videoId;
				if (req.body.videoUrl) topic.videoUrl = req.body.videoUrl;
				if (req.body.videoDescription) topic.videoDescription = req.body.videoDescription;
				if (req.body.keywords) topic.keywords = req.body.keywords;
				if (req.body.chemText) topic.chemText = req.body.chemText;
				if (req.body.practiceProblems) topic.practiceProblems = req.body.practiceProblems;
				// save the topic
				topic.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Topic has been updated.' });
				});

			});
		})

		// delete the topic with this id
		.delete(function(req, res) {
			Topic.remove({
				_id: req.params.topic_id
			}, function(err, topic) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});



	apiRouter.post('/upload', function(req,res){
		if(done == true){
			res.end("File uploaded.");
		}
	});
	
	apiRouter.get('/search', function(req,res){
		
		Topic.find(
				{$text: { $search: req.query.q }},
				{score: { $meta : "textScore"}}
			)
			.sort( { score: { $meta : 'textScore' } })
			.exec(function(err, results){
				if (err){
					res.send(err);
				}
				else{
					res.send(results);
				}
			});
	});
	

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		console.log(req.decoded);
		res.send(req.decoded);
	});

	return apiRouter;
};