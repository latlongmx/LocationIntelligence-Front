(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var potentialModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

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

	potentialModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('potential.modal.controller', [])
		.controller('potentialModalController', potentialModalController);

}());