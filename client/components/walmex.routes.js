(function(){
	'use strict';
	
	angular.module('routes', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider','$sceProvider', function($stateProvider, $urlRouterProvider, $sceProvider) {
		$sceProvider.enabled(false);
		$urlRouterProvider.otherwise('/login');
		$stateProvider
			.state('login', {
				url: '/login',
				reload: true,
				templateUrl: './components/login/login.html',
				controller: 'LoginController',
				controllerAs: 'lg'
			})
			.state('mapa', {
				url: '/mapa',
				reload: true,
				templateUrl: './components/basemap/basemap.component.html',
				controller: 'BaseMapController'
			});
	}]);

})();