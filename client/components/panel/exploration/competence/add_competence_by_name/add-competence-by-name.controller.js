(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function AddCompetenceByNameController(_, $scope, $mdDialog, $mdToast, $interval, $timeout, FileUploader, $document, LocationFactory, CompetenceService, BaseMapService, BaseMapFactory){

		var uploader = $scope.uploader = new FileUploader({
			queueLimit: 1,
			isUploading: true
		});

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

		uploader.filters.push({
			name: 'imageFilterByName',
			fn: function(item, options) {
				if (item.type === "image/png") {
					if (uploader.queue.length === 1) {
						if (uploader.queue[0]) {
							if (uploader.queue[0]._file.type === item.type) {
								_showToastMessage('Removiendo ' + uploader.queue[0]._file.name);
								uploader.removeFromQueue(uploader.queue[0]);
								return true;
							}
							else {
								return true;
							}
						}
					}
					else{
						return true;
					}
				}
				else {
					return _showToastMessage('Icono o marker no válido');
				}
			}
		});

		uploader.onAfterAddingFile = function(item) {
			_validateFile(item);
		}

		$scope.loadCompetenceName = function(validForm, competenceNameData) {
			if (validForm.$valid === true) {
				var formData = new FormData();
				var pin = "";
				if (uploader.queue[0]) {
					pin = uploader.queue[0]._file;
				}

				formData.append('qf', competenceNameData.query_find );
				formData.append('qb', $scope.name_bbox );
				formData.append('competence', "1" );
				formData.append('nm', competenceNameData.nm );
				formData.append('pin', pin?pin:'' );

				BaseMapService.addCompetenciaQuery(formData)
				.then(function(result){
					console.log(result)
					// if (result.statusText === 'OK') {
					// 	$mdDialog.hide({success: true});
					// }
				}, function(error){
					console.log(error)
					// if(error.status === 500) {
					// 	_showToastMessage('Hubo un error, intenta nuevamente');
					// }
					// else {
					// 	_showToastMessage('No hay elementos para esa categoría');
					// }
				});
			}

		}

		var _validateFile = function(file) {

			$scope.validateIcon = true;
			var fileType = file._file.type;
			$timeout(function(){
				if (fileType === "image/png") {
					_showToastMessage('Icono válido');
					$scope.icon = uploader.queue[0].file.name;
				}
				else {
					_showToastMessage('Icono o marker no válido');
					uploader.clearQueue();
				}
				$scope.validateIcon = false;
			}, 2500);
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
					parent: $document[0].querySelector('.m-dialog--in-competence-by-name')
				})
			);
		}

	};

	AddCompetenceByNameController.$inject = ['_','$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', 'FileUploader', '$document', 'LocationFactory', 'CompetenceService', 'BaseMapService', 'BaseMapFactory'];

	angular.module('add.competence.name.controller', []).
	controller('AddCompetenceByNameController', AddCompetenceByNameController);

})();
