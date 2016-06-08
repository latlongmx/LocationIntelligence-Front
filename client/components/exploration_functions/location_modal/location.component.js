(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function locationDirective(){

		var _$js_potential_side_panel = null,
		_$js_potential_item = null;

		return {
			restrict: 'E',
			replace: true,
			require: ['^explorationFunctions'],
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="location" tooltip-placement="right" uib-tooltip="Ubicaciones" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-potencial-location"></i>',
					'</li>',
					'<div class="m-side-panel js-location-side-panel">',
						'<h3 class="m-side-panel__title">Mis ubicaciones</h3>',
						'<div class="js-location-file-select">',
						  '<input class="location-file-input" type="file" id="inpFileUp">',
						'</div>',
						'<div class="js-location-file-options"></div>',
					'</div>',
				'</div>'
			].join(''),
			link: function(scope, element, attr){

				element.on('change', function(evt){
					console.log('locationCtrl');
					console.log(evt);
				});

			}
		};
	}

	locationDirective.$inject = [];

	angular.module('location.directive', [])
		.directive('location', locationDirective);
})();
