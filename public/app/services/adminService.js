angular.module('adminService', [])

.factory('Admin', function($http) {

	// create a new object
	var adminFactory = {};

	// get a single Topics
	adminFactory.get = function(topicId) {
		return $http.get('/api/admin/' + topicId);
	};

	// get all Topics
	adminFactory.all = function() {
		return $http.get('/api/admin/');
	};

	// create a 
	adminFactory.create = function(topicData) {
		return $http.post('/api/admin/', topicData);
	};

	// update a user
	adminFactory.update = function(topicId, topicData) {
		return $http.put('/api/admin/' + topicId, topicData);
	};

	// delete a user
	adminFactory.delete = function(topicId) {
		return $http.delete('/api/admin/' + topicId);
	};

	adminFactory.getUploadDirectory = function(){
		return $http.get('/api/admin/uploadDirectory');
	};

	// return our entire adminFactory object
	return adminFactory;

});