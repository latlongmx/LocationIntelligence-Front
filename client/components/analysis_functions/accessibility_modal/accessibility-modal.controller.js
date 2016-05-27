(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var accessibilityModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

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

	accessibilityModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('accessibility.modal.controller', [])
		.controller('accessibilityModalController', accessibilityModalController);

})();