(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function EditLayerHeatmapController($scope, $mdDialog, $mdToast, heatmap_layer_id, BaseMapService){
		$scope.updateHeatmap = function(form, data){
			
			if (form.$valid) {
				BaseMapService.updUserHeatMap(heatmap_layer_id , data.nm)
				.then(function(data){
					if(data.statusText === "OK"){
						$mdDialog.hide(true);
					}
				}, function(error){
					console.log(error)
				});
			}
		}

		

		/**
		 * [_showToastMessage Function to show toast messages]
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
		
		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

	};

	EditLayerHeatmapController.$inject = ['$scope', '$mdDialog', '$mdToast', 'heatmap_layer_id', 'BaseMapService'];

	angular.module('walmex').controller('EditLayerHeatmapController', EditLayerHeatmapController);

})();
