(function(){

	'use strict';

	angular.module('walmex',[
			'basemap',
			'basemap.service',
			'routes',
			'mapswitcher.directive',
			'maptools',
			'ui.router'
		]
	)
	.run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {

		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

		return $rootScope;

	}]);

}());