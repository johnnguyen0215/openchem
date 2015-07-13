angular.module('openchemApp', ['ngAnimate', 'app.routes', 'authService', 'searchService', 'userService', 'adminService', 'groupService', 'mainCtrl', 'userCtrl', 'adminCtrl', 'groupCtrl'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});