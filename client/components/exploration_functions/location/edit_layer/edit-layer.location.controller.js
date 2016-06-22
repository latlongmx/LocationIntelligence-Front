(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function EditLayerLocationController($scope, $mdDialog, $mdToast, $interval, $timeout, $document){
		
		// $scope.chooseIcon = function(icon) {
		// 	$scope.icon = icon;
		// }
		
		$scope.chooseIcon = function(iconName){
			$scope.validatingIcon = true;
			$mdDialog.hide(iconName);
			
		}
		
		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

	};

	EditLayerLocationController.$inject = ['$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', '$document'];

	angular.module('edit.layer.location.controller', []).
	controller('EditLayerLocationController', EditLayerLocationController);

})();
