(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function ExplorationFunctions(){
		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-locations"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-competence"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-demography"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-potencial-location"></i>',
					'</li>',
				'</ul>',
			].join('')
		};
	}
	
	//ExplorationFunctions.$inject = [];

	angular.module('exploration.directive', [])
		.directive('explorationFunctions', ExplorationFunctions);
}());