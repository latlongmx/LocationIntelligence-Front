(function(){
	'use strict';
	
	angular.module('routes', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/login', {
				reload: true,
				templateUrl: './components/login/login.html',
				controller: 'LoginController',
				controllerAs: 'lg'
			})
			.when('/mapa', {
				reload: true,
				templateUrl: './components/basemap/basemap.component.html',
				controller: 'BaseMapController'
			})
			.otherwise('/login');
	}]);

})();