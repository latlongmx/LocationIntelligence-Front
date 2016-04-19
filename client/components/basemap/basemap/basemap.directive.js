(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function BaseMap($rootScope, $timeout, BaseMapService){
		return {
			restrict: 'E',
			replace:true,
			template: '<div id="basemap" class="m-basemap"></div>',
			link:function(scope, element){
				BaseMapService.resolve(element[0]);
			}
		};
	}
	
	BaseMap.$inject = ['$rootScope', '$timeout', 'BaseMapService'];

	angular.module('basemap.directive', [])
		.directive('basemap', BaseMap);
}());