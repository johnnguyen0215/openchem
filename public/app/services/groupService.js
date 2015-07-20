angular.module('groupService', [])

.factory('Group', function($http) {

	// create a new object
	var groupFactory = {};
 	
 	groupFactory.addGroup = function(groupData){
 		return $http.post('/api/group', groupData);
 	}

 	groupFactory.updateGroup = function(groupId, groupData){
 		return $http.put('/api/group/'+groupId, groupData);
 	}

 	groupFactory.deleteGroup = function(groupId){
 		return $http.delete('/api/group/'+groupId);
 	}

 	groupFactory.getGroups = function(groupsArray){
 		return $http.post('/api/getGroups', groupsArray);
 	}

 	
 	groupFactory.all = function(){
 		return $http.get('/api/group');
 	}


	return groupFactory;

});