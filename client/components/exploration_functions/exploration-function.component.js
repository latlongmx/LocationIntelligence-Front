(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function explorationFunctions($uibModal){

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
					'<li class="m-list-functions__item js-exploration-item" data-ep="demography" tooltip-placement="right" uib-tooltip="Demografía" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-demography"></i>',
					'</li>',
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

					modalDemographyInstance = $uibModal.open({
						controller: _data_ep+'ModalController',
						controllerAs: _data_ep,
						templateUrl: './components/exploration_functions/'+_data_ep+'_modal/'+_data_ep+'.tpl.html',
						animation: true,
						windowClass: "m-modal__" + _data_ep,
						resolve: {
							items: function () {
								return {
									id: $scope.epId,
									item: $scope.explorationItemSelected
								};
							},
							variables: function(){
								return $scope.variables;
							}
						}
					});
					modalDemographyInstance.result.then(function(variables){
						$scope.variables = variables;
						console.log(variables);
					});
					modalDemographyInstance.closed.then(function(){
						angular.element(document.getElementsByClassName('js-exploration-item')).removeClass('is-item-panel-active');
					});
				});
				
			}
		};
	}
	
	explorationFunctions.$inject = ['$uibModal'];

	angular.module('exploration.directive', [])
		.directive('explorationFunctions', explorationFunctions);
}());