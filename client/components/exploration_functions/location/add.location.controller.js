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
		
		uploader.loadFile = function(validForm, locationData) {
			if (validForm.$valid === true) {
				console.log(locationData);
				var formData = new FormData();
				formData.append('nm', locationData.nm );
				formData.append('lat', locationData.lat );
				formData.append('lng', locationData.lng );
				formData.append('pin', $('#inpFileIco').val() );
				formData.append('file', uploader.queue[0]._file );
				LocationService.addNewLocation( formData );
				$mdDialog.hide(true);
			}
			
			// var file = document.getElementById('inpFileUp');
			// var formData = new FormData();
			// formData.append('nm', $('#inpFileNom').val() );
			// formData.append('lat', $('#selLocLat option:selected').val() );
			// formData.append('lng', $('#selLocLng option:selected').val() );
			// formData.append('pin', $('#inpFileIco').val() );
			// formData.append('file', file.files[0] );
			// LocationService.addNewLocation( formData );
			//LocationService.getLocations().then(function(res){
				//console.log(res)
				// if(res.data && res.data.places){
				// 	var div = angular.element(document.getElementsByClassName('ejemplo-my-locations'));
				// 	div.html('');
				// 	_.each(res.data.places,function(o){
				// 		var id = o.id_layer+'-'+o.name_layer.replace(' ','_');
				// 		div.append('<div data-idlayer="'+id+'">'+o.id_layer+' - '+o.name_layer+' ('+o.data.length+')'+
				// 			'<input type="checkbox" class="ShowHideLocation" value="'+id+'">'+
				// 			'<button class="zoomLocation" data-idlayer="'+id+'">zoom</button>'+
				// 			'</div><br>');
				// 		BaseMapFactory.addLocation({
				// 			name: id,
				// 			data: o.data
				// 		});
				// 	});
				// }
			//});
			//$mdDialog.hide();

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
					_chooseLatLng(file._file);
				}
				$scope.validateFile = false;
			}, 2500);
			
			var _chooseLatLng = function(evt) {
				LocationFactory.processCSV(evt,function(columns){
					console.log(columns)
					if (columns) {
						$scope.set_columns = true;
						$scope.items = columns;
					}
				});
			}

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

	AddLocationController.$inject = ['_','$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', 'FileUploader', '$document', 'LocationFactory', 'LocationService'];

	angular.module('add.location.controller', []).
	controller('AddLocationController', AddLocationController);

})();
