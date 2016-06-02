(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var ringsModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope, BaseMapService, BaseMapFactory){

		var _this = null;
		init();

		function init(){
			console.log("modal");

			BaseMapService.map.then(function (map) {

				if(map.getZoom()<13){
					console.log('zoom mayor');
					return;
				}
				BaseMapFactory.setPobVivWMS('pea');
			});
		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	ringsModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope', 'BaseMapService', 'BaseMapFactory'];

	angular.module('rings.modal.controller', [])
		.controller('ringsModalController', ringsModalController);

}());
