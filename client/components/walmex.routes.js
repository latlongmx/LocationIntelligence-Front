(function(){
	'use strict';
	
	angular.module('routes', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('root', {
				url: '/',
				template: '<basemap></basemap>',
				controller: 'BaseMapController'
			});
	}]);

}());