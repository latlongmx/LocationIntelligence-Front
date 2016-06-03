(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function locationDirective(){

		return {
			restrict: 'E',
			replace: true,
			require: '^explorationFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="location" tooltip-placement="right" uib-tooltip="Mis ubicaciones" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-location"></i>',
					'</li>',
					'<div class="m-side-panel js-location-side-panel">',
					'<div>',
				'<div>'
			].join(''),
			link: function(scope, element, attr){
				var _this = null;
				console.log("location");
			}
		};
	}
	
	locationDirective.$inject = [];

	angular.module('location.directive', [])
		.directive('location', locationDirective);
})();