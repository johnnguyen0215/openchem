angular.module('searchService', [])

.factory('Search', function($http) {

	// create a new object
	var searchFactory = {};

	// get a single Topics
	searchFactory.getItems = function(query) {
		return $http.get('/api/search?q=' + query);
	};

	return searchFactory;

});