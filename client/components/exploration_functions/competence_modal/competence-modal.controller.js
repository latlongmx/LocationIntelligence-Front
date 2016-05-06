(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var competenceModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope, epId){

		var _this = null;
		$scope.epId = epId;
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

	competenceModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope', 'epId'];

	angular.module('competence.modal.controller', [])
		.controller('competenceModalController', competenceModalController);

}());