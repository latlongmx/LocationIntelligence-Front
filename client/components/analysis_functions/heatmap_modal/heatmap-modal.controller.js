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

			BaseMapService.map.then(function (map) {
				var bounds = map.getBounds();
				var nw = bounds.getNorthWest();
				var se = bounds.getSouthEast();
				var bbox = [nw.lng, se.lat, se.lng, nw.lat].join(',');

				BaseMapService.addCompetenciaQuery({
					qf: 'oxxo',
					qb: bbox,
					competence:"1",
					nm: 'Competencia - oxxo'
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
