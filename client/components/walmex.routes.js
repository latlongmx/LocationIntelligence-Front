(function(){
	'use strict';
	
	angular.module('routes', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/login');
		$stateProvider
			.state('login', {
				url: '/login',
				reload: true,
				views: {
					"login": { 
						templateUrl: './components/login/login.html',
						controller: 'LoginController',
						controllerAs: 'lg'
					}
				}
			})
			.state('mapa', {
				url: '/mapa',
				reload: true,
				views: {
					"main": { 
						templateUrl: './components/basemap/basemap.component.html',
						controller: 'BaseMapController'
					}
				}
			});
	}]);

})();