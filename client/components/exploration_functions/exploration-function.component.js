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
					'<li class="m-list-functions__item js-exploration-item" data-ep="location">',
						'<i class="m-list-functions__item-icon demo demo-locations"></i>',
					'</li>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="competence">',
						'<i class="m-list-functions__item-icon demo demo-competence"></i>',
					'</li>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="demography">',
						'<i class="m-list-functions__item-icon demo demo-demography"></i>',
					'</li>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="potential">',
						'<i class="m-list-functions__item-icon demo demo-potencial-location"></i>',
					'</li>',
				'</ul>',
			].join(''),
			controller: function($scope){
				var _$js_exploration_item = angular.element(document.getElementsByClassName('js-exploration-item'));
				var _data_ep = null;
				_$js_exploration_item.on('click', function(e){
					e.preventDefault();
					$scope.epId = this.getAttribute('data-ep');
					_data_ep = this.getAttribute('data-ep');
					$uibModal.open({
						controller: _data_ep+'ModalController',
						templateUrl: './components/exploration_functions/'+_data_ep+'_modal/'+_data_ep+'.tpl.html',
						animation: true,
						resolve: {
							epId: function () {
								return $scope.epId;
							}
						}
					});
				});
				
			}
		};
	}
	
	explorationFunctions.$inject = ['$uibModal'];

	angular.module('exploration.directive', [])
		.directive('explorationFunctions', explorationFunctions);
}());