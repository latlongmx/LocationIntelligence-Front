(function(){

	'use strict';

	angular.module('walmex',[
			'basemap',
			'basemap.service',
			'routes',
			'mapswitcher.directive',
			'maptools',
			'exploration.directive',
			'location.modal.controller',
			'competence.modal.controller',
			'demography.modal.controller',
			'potential.modal.controller',
			'analysis.directive',
			'historical.directive',
			'search.directive',
			'ui.router',
			'ui.bootstrap'
		]
	)
	.run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {

		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		return $rootScope;

	}]);

}());