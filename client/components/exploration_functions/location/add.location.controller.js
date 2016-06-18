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
			isUploading: true
		});
		
		
		uploader.filters.push({
			name: 'customFilter',
			fn: function(item, options) {
				if (item.type === "text/csv" || item.type === "application/vnd.ms-excel") {
					if (uploader.queue.length === 1) {
						if (uploader.queue[0]){
							if (uploader.queue[0]._file.type === item.type) {
								_showToastMessage('Removiendo ' + uploader.queue[0]._file.name);
								uploader.removeFromQueue(uploader.queue[0]);
								return true;
							}
							else {
								return true;
							}
						}
						if (uploader.queue[1]){
							if (uploader.queue[1]._file.type === item.type) {
								_showToastMessage('Removiendo ' + uploader.queue[1]._file.name);
								uploader.removeFromQueue(uploader.queue[1]);
								return true;
							}
							else {
								return true;
							}
						}
					}
					if (uploader.queue.length === 2) {
						if (uploader.queue[0]){
							if (uploader.queue[0]._file.type === item.type) {
								_showToastMessage('Removiendo ' + uploader.queue[0]._file.name);
								uploader.removeFromQueue(uploader.queue[0]);
								return true;
							}
							else {
								return true;
							}
						}
						if (uploader.queue[1]){
							if (uploader.queue[1]._file.type === item.type) {
								_showToastMessage('Removiendo ' + uploader.queue[1]._file.name);
								uploader.removeFromQueue(uploader.queue[1]);
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
					return _showToastMessage('Archivo csv no válido');
				}
			}
		});

		uploader.filters.push({
			name: 'imageFilter',
			fn: function(item, options) {
				if (item.type === "image/png" || item.type === "image/jpeg" || item.type === "image/jpg") {
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
						if (uploader.queue[1]) {
							if (uploader.queue[1]._file.type === item.type) {
								_showToastMessage('Removiendo ' + uploader.queue[1]._file.name);
								uploader.removeFromQueue(uploader.queue[1]);
								return true;
							}
							else {
								return true;
							}
						}
					}
					if (uploader.queue.length === 2) {
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
						if (uploader.queue[1]) {
							if (uploader.queue[1]._file.type === item.type) {
								_showToastMessage('Removiendo ' + uploader.queue[1]._file.name);
								uploader.removeFromQueue(uploader.queue[1]);
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

		$scope.hide = function() {
			uploader.clearQueue();
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			uploader.clearQueue();
			$mdDialog.cancel();
		};
		
		uploader.loadFile = function(validForm, locationData) {
			if (validForm.$valid === true) {
				var pin = uploader.queue;
				var icon = null;
				var csv = null;
				var idLayer = null;

				pin[0]._file.type === "text/csv" || pin[0]._file.type === "application/vnd.ms-excel" ? csv = pin[0]._file : csv = pin[1]._file;
				pin[0]._file.type === "image/png" || pin[0]._file.type === "image/jpeg" || pin[0]._file.type === "image/jpg" ? icon = pin[0]._file: icon = pin[1]._file;

				var formData = new FormData();
				formData.append('nm', locationData.nm );
				formData.append('lat', locationData.lat );
				formData.append('lng', locationData.lng );
				formData.append('pin', icon);
				formData.append('file', csv );
				LocationService.addNewLocation( formData )
				.then(function(data){
					if (data.status === 200) {
						idLayer = data.data.id_layer;
						uploader.clearQueue();
						$mdDialog.hide(idLayer);
					}
				}, function(error){
					console.log(error)
				});
				
			}

		}
		
		var _validateFile = function(file) {
			
			$scope.validateFile = true;
			var fileType = file._file.type;
			$timeout(function(){
				if (fileType === "text/csv" || fileType === "application/vnd.ms-excel") {
					_chooseLatLng(file._file);
					uploader.queue[0].file.type === fileType ? $scope.csv = uploader.queue[0].file.name : $scope.csv = uploader.queue[1].file.name;
				}
				else {
					_showToastMessage('Icono válido');
					uploader.queue[0].file.type === fileType ? $scope.icon = uploader.queue[0].file.name : $scope.icon = uploader.queue[1].file.name;
				}
				$scope.validateFile = false;
			}, 2500);

			var _chooseLatLng = function(evt) {
				LocationFactory.processCSV(evt,function(columns){
					if (columns && columns.length >= 3) {
						_showToastMessage('Archivo válido');
						$scope.set_columns = true;
						$scope.items = columns;
					}
					else {
						uploader.clearQueue();
						_showToastMessage('Archivo removido porque no cumple con el número de columnas (3)');
						$scope.csv = "";
					}
				});
			}
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
