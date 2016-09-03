(function(){
	'use strict';
	
	angular.module('routes', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/login');
		$stateProvider
			.state('login', {
				url: '/login',
				reload: true,
				templateUrl: './components/login/login.html',
				controller: 'LoginController',
				controllerAs: 'lg'
			})
			.state('registro', {
				url: '/registro',
				reload: true,
				templateUrl: './components/signup/signup.html',
				controller: 'RegistroController',
				controllerAs: 'rg'
			})
			.state('mapa', {
				url: '/mapa',
				reload: true,
				templateUrl: './components/basemap/basemap.component.html',
				controller: 'BaseMapController'
			});
	}]);

})();