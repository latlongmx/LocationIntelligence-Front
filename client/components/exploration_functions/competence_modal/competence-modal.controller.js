(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var competenceModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope, items){

		var _this = null;
		var competence = this;
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

	competenceModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope', 'items'];

	angular.module('competence.modal.controller', [])
		.controller('competenceModalController', competenceModalController);

}());