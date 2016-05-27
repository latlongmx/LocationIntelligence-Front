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

				if(map.getZoom()<15){
					console.log('zoom mayor');
					return;
				}

				var polygonWKT = BaseMapFactory.bounds2polygonWKT(map.getBounds());
				if(polygonWKT){
					var column = 'pea';
					BaseMapService.intersect({
						s:'inegi',
						t: 'pobviv2010',
						c: column,
						w:'',
						wkt: polygonWKT,
						mts: 0
					}).then(function(result){
						console.log(result);
						if(result && result.data){
							var info = result.data.info;
							var geojson = result.data.geojson;
							BaseMapFactory.addColorPletMap(geojson,column);
						}
					}, function(error){
						console.log(error);
					});
				}
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
