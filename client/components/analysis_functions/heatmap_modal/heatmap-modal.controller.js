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

			//HEAT MAP por CAtegoria
			//HEAT MAP por CAtegoria
			/*
			donde category puede ser food, tourims o shop
			si reload = true volvera a realizar a peticion de datos del servidor
			*/
			var reload = false;
			var category = 'tourims';
			BaseMapFactory.addHeatMapCategory(category, reload);
			//BaseMapFactory.hideHeatMapCategory('food');





      //BaseMapService.map.then(function (map) {
				/*BaseMapFactory.addHeatMap({
					//filter:'oxxo'
					cod:'4312,3112'
				});*/


			//});

			/*BaseMapService.map.then(function (map) {
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
			});*/

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
