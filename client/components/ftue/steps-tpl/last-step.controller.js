(function(){
	/*
	* First Time User Controller
	*/
	'use strict';

	function IsolatedStepCtrl(_, $scope, multiStepFormScope){
		// $scope.ftue = angular.copy(multiStepFormScope.ftue);
  //   $scope.$on('$destroy', function () {
  //       multiStepFormScope.ftue = angular.copy($scope.ftue);
  //   });
		// console.log($scope.ftue)
	};

	IsolatedStepCtrl.$inject = ['_','$scope', 'multiStepFormScope'];

	angular.module('walmex').controller('IsolatedStepCtrl', IsolatedStepCtrl);

})();
