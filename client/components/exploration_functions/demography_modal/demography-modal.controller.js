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

			demography.options = {
				collapsed: true,
				fullCollapse: true,
				onExpandMenuStart: function() {
				},
				onExpandMenuEnd: function() {
					console.log("terminado")
				},
				onItemClick: function(event, item) {
				  console.log(item.id)
				}
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