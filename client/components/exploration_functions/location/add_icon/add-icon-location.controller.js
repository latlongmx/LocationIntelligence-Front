(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function AddIconLocationController($scope, $mdDialog, $mdToast, $interval, $timeout, $document){
		
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

	AddIconLocationController.$inject = ['$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', '$document'];

	angular.module('add.icon.location.controller', []).
	controller('AddIconLocationController', AddIconLocationController);

})();
