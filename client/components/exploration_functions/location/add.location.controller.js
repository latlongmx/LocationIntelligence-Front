(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function AddLocationController(_, $scope, $mdDialog, $mdToast, $interval, $timeout, FileUploader, $document, LocationFactory, LocationService){
		
		var j= 0, counter = 0;
		$scope.activated = true;
		$scope.determinateValue = 30;
		$scope.determinateValue2 = 30;
		$scope.showList = [ ];
		
		
		var uploader = $scope.uploader = new FileUploader({
			queueLimit: 1,
			isUploading: true,
			scope: $scope
		});
		
		uploader.filters.push({
			name: 'customFilter',
			fn: function(item, options) {
				return this.queue.length <= 1;
			}
		});

		uploader.filters.push({
			name: 'imageFilter',
				fn: function(item /*{File|FileLikeObject}*/, options) {
					var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
					return '|jpg|png|jpeg|'.indexOf(type) !== -1;
				}
		});

		uploader.onAfterAddingFile = function(item) {
			console.log(item.uploader.queue.length)
			if (item.uploader.queue.length === 1) {
				_validateFile(item);
			}
			else {
				_validateIcon(item);
			}
		}
		
		uploader.onSuccessItem = function(item, response, status, headers) {
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
		
		uploader.loadFile = function(validForm, locationData) {
			if (validForm.$valid === true) {
				var formData = new FormData();
				formData.append('nm', locationData.nm );
				formData.append('lat', locationData.lat );
				formData.append('lng', locationData.lng );
				formData.append('pin', uploader.queue[1]._file );
				formData.append('file', uploader.queue[0]._file );
				LocationService.addNewLocation( formData );
				$mdDialog.hide(true);
			}

		}
		
		var _validateFile = function(file) {
			$scope.validateFile = true;
			$timeout(function(){
				if (file.file.type === "text/csv") {
					_chooseLatLng(file._file);
				}
				else {
					uploader.clearQueue();
					_showToastMessage('Archivo removido porque no es válido');
				}
				$scope.validateFile = false;
			}, 2500);

			var _chooseLatLng = function(evt) {
				LocationFactory.processCSV(evt,function(columns){
					if (columns && columns.length === 3) {
						_showToastMessage('Archivo válido');
						$scope.set_columns = true;
						$scope.items = columns;
					}
					else {
						uploader.clearQueue();
						_showToastMessage('Archivo removido porque no cumple con el número de columnas (3)');
					}
				});
			}
		}
		
		var _validateIcon = function(file) {
			$scope.validateFile = true;
			$timeout(function(){
				if(file.file.type === "image/png" || file.file.type === "image/jpg" || file.file.type === "image/jpeg"){
					_showToastMessage('Icono válido');
				}
				else {
					uploader.removeFromQueue(1);
					_showToastMessage('Icono removido porque no es válido');
				}
				$scope.validateFile = false;
			}, 2000);
		}

		
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

	AddLocationController.$inject = ['_','$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', 'FileUploader', '$document', 'LocationFactory', 'LocationService'];

	angular.module('add.location.controller', []).
	controller('AddLocationController', AddLocationController);

})();
