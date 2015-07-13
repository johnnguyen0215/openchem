angular.module('groupService', [])

.factory('Group', function($http) {

	// create a new object
	var groupFactory = {};
 	
 	groupFactory.addGroup = function(groupData){
 		$http.post('/api/group', groupData);
 	}

	return groupFactory;

});