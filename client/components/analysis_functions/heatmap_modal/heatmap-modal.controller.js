(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var heatmapModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

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

	heatmapModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('heatmap.modal.controller', [])
		.controller('heatmapModalController', heatmapModalController);

}());