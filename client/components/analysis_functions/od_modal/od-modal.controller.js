(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var odModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

		var _this = null;
		init();

		function init(){
			console.log("modal")
		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	odModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('od.modal.controller', [])
		.controller('odModalController', odModalController);

}());