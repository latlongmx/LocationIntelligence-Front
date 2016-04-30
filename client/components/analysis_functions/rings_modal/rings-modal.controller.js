(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var ringsModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

		var _this = null;
		init();

		function init(){
			console.log("modal");
		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	ringsModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('rings.modal.controller', [])
		.controller('ringsModalController', ringsModalController);

}());