angular.module('groupService', [])

.factory('Group', function($http) {

	// create a new object
	var groupFactory = {};
 	
 	groupFactory.addGroup = function(groupData){
 		return $http.post('/api/group', groupData);
 	}

 	groupFactory.getGroups = function(groupNames){
 		return $http.get('/api/group', groupNames)
 	}

	return groupFactory;

});