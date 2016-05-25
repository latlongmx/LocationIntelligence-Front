(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function explorationFunctions(){

		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<li class="m-list-functions__item js-exploration-item" data-ep="location" tooltip-placement="right" uib-tooltip="Mis ubicaciones" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-locations"></i>',
					'</li>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="competence" tooltip-placement="right" uib-tooltip="Competencia" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-competence"></i>',
					'</li>',
					'<demography></demography>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="potential" tooltip-placement="right" uib-tooltip="Potencial de ubicación" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-potencial-location"></i>',
					'</li>',
				'</ul>',
			].join(''),
			controller: function($scope){
				var _$js_exploration_item = angular.element(document.getElementsByClassName('js-exploration-item')),
				_data_ep = null,
				modalDemographyInstance = null;

				_$js_exploration_item.on('click', function(e){
					e.preventDefault();
					$scope.epId = this.getAttribute('data-ep');
					$scope.explorationItemSelected = angular.element(this);
					_data_ep = this.getAttribute('data-ep');
					angular.element(this).addClass('is-item-panel-active');
				});

			}
		};
	}

	explorationFunctions.$inject = [];

	angular.module('exploration.directive', [])
		.directive('explorationFunctions', explorationFunctions);
}());
