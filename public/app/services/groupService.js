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

 	groupFactory.getGroup = function(groupId){
 		return $http.get('/api/group/'+groupId);
 	}

 	groupFactory.getGroups = function(groupsArray){
 		return $http.post('/api/getGroups', groupsArray);
 	}

 	
 	groupFactory.allGroups = function(){
 		return $http.get('/api/group');
 	}

 	groupFactory.addGroupMember = function(memberName, invite){
 		return $http.put('/api/addGroupMember/'+memberName, invite);
 	}


	return groupFactory;

});