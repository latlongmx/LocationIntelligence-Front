(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var competenceModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope, items, BaseMapFactory, BaseMapService){

		var _this = null;
		var competence = this;
		init();

		function init(){
			console.log("modal");
			BaseMapService.map.then(function (map) {

				var polygonWKT = BaseMapFactory.bounds2polygonWKT(map.getBounds());
				if(polygonWKT){
					BaseMapService.intersect({
						s:'inegi',
						t: 'denue_2016',
						c: 'nom_estab',
						w:'nom_estab:!OXXO',
						wkt: polygonWKT,
						mts: 0
					}).then(function(result){
						if(result && result.data){
							var info = result.data.info;
							var geojson = result.data.geojson;
							BaseMapFactory.addCompetencia(geojson);
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

	competenceModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope', 'items', 'BaseMapFactory', 'BaseMapService'];

	angular.module('competence.modal.controller', [])
		.controller('competenceModalController', competenceModalController);

})();
