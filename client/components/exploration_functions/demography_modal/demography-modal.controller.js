(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var demographyModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope, items, DemographyJsonService){
		var _this = null;
		var demography = this;
		demography.epId = items.id;

		//demography.variableSearch = function(){
			
			DemographyJsonService.demographyJsonRequest()
			.then(function(result){
				demography.list = true;
				demography.menu = result.data;
				
			}, function(error){
				console.log(error)
			});
			
			demography.events = [];
			demography.options = {
				collapsed: true,
				fullCollapse: true,
				onExpandMenuEnd: function() {
					console.log("terminado")
				},
				// containersToPush: [$('#pushobj')],
				// direction: 'ltr',
				// onItemClick: function(event, item) {
				//   demography.events.push('Item ' + item.name + ' clicked!');
				// }
			};
		//};


		demography.ok = $uibModalInstance.close;

		demography.cancel = function(){
			$uibModalInstance.close('cancel');
		};
	};

	demographyModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope', 'items', 'DemographyJsonService'];

	angular.module('demography.modal.controller', [])
		.controller('demographyModalController', demographyModalController);

}());