(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function AddLocationController($scope, $mdDialog, $mdToast, $interval, $timeout, FileUploader, $document){
		
		var j= 0, counter = 0;
		$scope.mode = 'query';
		$scope.activated = true;
		$scope.determinateValue = 30;
		$scope.determinateValue2 = 30;
		$scope.showList = [ ];
		
		
		var uploader = $scope.uploader = new FileUploader({
			url: 'upload.php',
			queueLimit: 1,
			isUploading: true
		});
		
		uploader.filters.push({
			name: 'customFilter',
			fn: function(item, options) {
				return this.queue.length <= 1;
			}
		});



		uploader.onAfterAddingFile = function(item) {
			_validateFile(item);
		}
		
		uploader.onSuccessItem = function(item, response, status, headers) {
			console.log(response);
		}
		uploader.onErrorItem = function(item, response, status, headers) {
			console.log(response);
			console.log(status)
		}
		

		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		
		uploader.loadFile = function() {

			console.log("subiendo");
			/**
			 * [arreglo Example of array with all locations, from response $http]
			 */
			var arreglo = [
				{"categoria": "oxxo", "sucursales": 10, "id_ubicacion": "oxxo_01"},
				{"categoria": "soriana", "sucursales": 5, "id_ubicacion": "soriana_01"},
				{"categoria": "aurrera", "sucursales": 23, "id_ubicacion": "aurrera_01"}
			];
			$mdDialog.hide(arreglo);

		}
		
		var _validateFile = function(file) {
			$scope.validateFile = true;
			
				$timeout(function(){
					
					if (file.file.type !== "text/csv") {
						uploader.clearQueue();
						_showDialog('Archivo removido por que no es válido');
					}
					else {
						_showDialog('Archivo válido');
					}
					$scope.validateFile = false;
				}, 2500);
			
			
			/**
			 * [_showDialog Function to open $mdDialog]
			 * @param  {[type]} message [Message to show in $mdDialog]
			 */
			var _showDialog = function(message) {
				$mdToast.show(
					$mdToast.simple({
						textContent: message,
						position: 'top right',
						hideDelay: 2500,
						parent: $document[0].querySelector('.m-dialog__content')
					})
				);
			}
		}

	};

	AddLocationController.$inject = ['$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', 'FileUploader', '$document'];

	angular.module('add.location.controller', []).
	controller('AddLocationController', AddLocationController);

})();
