(function(){

	'use strict';

	angular.module('walmex',[
			'basemap',
			'basemap.service',
			'routes',
			'mapswitcher.directive',
			'maptools',
			'exploration.directive',
			'analysis.directive',
			'historical.directive',
			'ui.router'
		]
	)
	.run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {

		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		return $rootScope;

	}]);

}());