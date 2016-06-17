(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var heatmapModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope, BaseMapService, BaseMapFactory){

		var _this = null;
		init();

		function init(){
			console.log("modal");

      BaseMapService.map.then(function (map) {
				BaseMapFactory.addHeatMap({
					filter:'oxxo'
				});
			});

		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	heatmapModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope', 'BaseMapService', 'BaseMapFactory'];

	angular.module('heatmap.modal.controller', [])
		.controller('heatmapModalController', heatmapModalController);

})();
