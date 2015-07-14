angular.module('groupService', [])

.factory('Group', function($http) {

	// create a new object
	var groupFactory = {};
 	
 	groupFactory.addGroup = function(groupData){
 		return $http.post('/api/group', groupData);
 	}

 	groupFactory.getGroups = function(groupType, userData){
 		return $http.post('/api/group/'+groupType, userData);
 	}

 	groupFactory.deleteGroup = function(groupId){
 		return $http.delete('/api/group/'+groupId);
 	}

 	groupFactory.all = function(){
 		return $http.get('/api/group');
 	}

	return groupFactory;

});