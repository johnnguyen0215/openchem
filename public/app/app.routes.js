angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html',
			controller  : 'mainController',
			controllerAs: 'main'
		})
		
		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    		controllerAs: 'login'
		})

		.when('/signup', {
			templateUrl : 'app/views/pages/signup.html',
   			controller  : 'userCreateController',
    		controllerAs: 'signup'
		})

		.when('/admin', {
			templateUrl : 'app/views/pages/admin.html',
   			controller  : 'adminController',
    		controllerAs: 'admin'
		})
		
		.when('/admin/all-topics', {
			templateUrl : 'app/views/pages/all-topics.html',
			controller  : 'topicEditController',
			controllerAs: 'admin'
		})

		.when('/admin/:topic_id', {
			templateUrl : 'app/views/pages/admin.html',
			controller  : 'adminController',
			controllerAs: 'admin'
		})

		.when('/api/upload',{
			templateUrl : 'app/views/pages/admin.html',
			controller  : 'adminController',
			controllerAs: 'admin'
		})


	$locationProvider.html5Mode(true);

});
