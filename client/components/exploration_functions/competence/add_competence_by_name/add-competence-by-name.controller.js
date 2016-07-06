(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function AddCompetenceByNameController(_, $scope, $mdDialog, $mdToast, $interval, $timeout, FileUploader, $document, LocationFactory, CompetenceService, BaseMapService){

		$scope.name_bounds = null;
		$scope.name_nw = null;
		$scope.name_se = null;
		$scope.name_bbox = null;
		BaseMapService.map.then(function (map) {
			$scope.name_bounds = map.getBounds();
			$scope.name_nw = $scope.name_bounds.getNorthWest();
			$scope.name_se = $scope.name_bounds.getSouthEast();
			$scope.name_bbox = [$scope.name_nw.lng, $scope.name_se.lat, $scope.name_se.lng, $scope.name_nw.lat].join(',');
		});

		$scope.loadCompetenceName = function(validForm, competenceNameData) {
			if (validForm.$valid === true) {
				BaseMapService.addCompetenciaQuery({
					qf: competenceNameData.query_find,
					qb: $scope.name_bbox,
					competence:"1",
					nm: competenceNameData.nm
				})
				.then(function(result){
					if (result.statusText === 'OK') {
						CompetenceService.getCompetences({competence: '1'}).then(function(res){
							if(res.data && res.data.places){
								var lastCompetenceLayer = res.data.places[res.data.places.length -1];
								var idCompetenceLayer = lastCompetenceLayer.id_layer+'-'+lastCompetenceLayer.name_layer.replace(' ','_');
								$scope.save_competence_variable_list.push(lastCompetenceLayer);
								BaseMapFactory.addLocation({
									name: idCompetenceLayer,
									data: lastCompetenceLayer.data
								});
							}
						});
					}
				}, function(error){
					console.log(error);
				});
			}

		}
		
		$scope.hide = function() {
			uploader.clearQueue();
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		

		/**
		 * [_showToastMessage Function to open $mdDialog]
		 * @param  {[type]} message [Message to show in $mdDialog]
		 */
		var _showToastMessage = function(message) {
			$mdToast.show(
				$mdToast.simple({
					textContent: message,
					position: 'top right',
					hideDelay: 2500,
					parent: $document[0].querySelector('.m-dialog__content')
				})
			);
		}

	};

	AddCompetenceByNameController.$inject = ['_','$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', 'FileUploader', '$document', 'LocationFactory', 'CompetenceService', 'BaseMapService'];

	angular.module('add.competence.name.controller', []).
	controller('AddCompetenceByNameController', AddCompetenceByNameController);

})();
