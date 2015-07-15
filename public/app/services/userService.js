angular.module('userService', [])

.factory('User', function($http) {

	// create a new object
	var userFactory = {};

	// get a single user
	userFactory.get = function(id) {
		return $http.get('/api/users/' + id);
	};

	// get all users
	userFactory.all = function() {
		return $http.get('/api/users/');
	};

	// create a user
	userFactory.create = function(userData) {
		return $http.post('/api/users?id=create', userData);
	};

	// update a user
	userFactory.update = function(id, userData) {
		return $http.put('/api/users/' + id, userData);
	};

	// delete a user
	userFactory.delete = function(id) {
		return $http.delete('/api/users/' + id);
	};

	userFactory.inviteToGroup = function(email, groupName){
		return $http.put('/api/users/invite/' + email, groupName);
	};

	userFactory.updateLeaderGroups = function(data){
		return $http.put('/api/updateLeaderGroups', data);
	};

	userFactory.deleteFromUsers = function(data){
		return $http.post('/api/deleteUserGroups', data);
	};


	// return our entire userFactory object
	return userFactory;

});