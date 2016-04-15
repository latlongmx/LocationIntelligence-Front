(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function AnalysisFunctions(){
		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-accessibility1"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-origin-destiny"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-heatmap"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-rings"></i>',
					'</li>',
				'</ul>',
			].join('')
		};
	}
	
	//AnalysisFunctions.$inject = [];

	angular.module('analysis.directive', [])
		.directive('analysisFunctions', AnalysisFunctions);
}());