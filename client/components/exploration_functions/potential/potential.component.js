(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function potentialDirective(){
		
		var _$js_potential_side_panel = null,
		_$js_potential_item = null;

		return {
			restrict: 'E',
			replace: true,
			require: '^explorationFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="potential" tooltip-placement="right" uib-tooltip="Potencial" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-potencial-location"></i>',
					'</li>',
					'<div class="m-side-panel js-potential-side-panel">',
						'<h3 class="m-side-panel__title">Seleccionar variables</h3>',
					'<div>',
				'<div>'
			].join(''),
			link: function(scope, element, attr, potencialCtrl){
				// _$js_potential_item = angular.element(document.getElementsByClassName('js-potential-item'));
				// _$js_potential_side_panel = angular.element(document.getElementsByClassName('js-potential-side-panel'));
				
				// scope.explorationPotential = function(){
				// 	potencialCtrl.test("potential");
				// }
				/**
				 * [ Open potential panel ]
				 */
				// _$js_potential_item.on('click', function(e){
				// 	e.preventDefault();
				// 	_$js_potential_side_panel.toggleClass('is-panel-open');
				// 	_$js_potential_item.toggleClass('is-item-panel-active');
				// });
			}
		};
	}
	
	potentialDirective.$inject = [];

	angular.module('potential.directive', [])
		.directive('potential', potentialDirective);
}());