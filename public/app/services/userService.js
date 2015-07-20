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

	userFactory.insertLeaderGroup = function(data){
		return $http.put('/api/insertLeaderGroup', data);
	};

	userFactory.updateUserGroups = function(groupId){
		return $http.put('/api/updateUserGroups', groupId);
	};

	userFactory.deleteFromUsers = function(groupId){
		return $http.delete('/api/deleteFromUsers/'+ groupId);
	};

	userFactory.decrementGroupsCreated = function(leaderId){
		return $http.delete('/api/decrementGroupsCreated/'+leaderId);
	};

	userFactory.inviteUser = function(userEmail, invite){
		return $http.put('/api/inviteUser/'+userEmail, invite);
	}

	// return our entire userFactory object
	return userFactory;

});