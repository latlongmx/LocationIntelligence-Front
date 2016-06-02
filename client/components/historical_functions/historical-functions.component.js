(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function HistoricalFunctions(){
		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<li class="m-list-functions__item" tooltip-placement="right" uib-tooltip="Históricos" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-historic"></i>',
					'</li>',
				'</ul>',
			].join('')
		};
	}
	
	//HistoricalFunctions.$inject = [];

	angular.module('historical.directive', [])
		.directive('historicalFunctions', HistoricalFunctions);
})();