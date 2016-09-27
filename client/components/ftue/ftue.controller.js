(function(){
	/*
	* First Time User Controller
	*/
	'use strict';

	function FirstTimeUserController(_, $scope, $mdDialog, $mdToast, $interval, $timeout, $location){
		$scope.ftue = {};
		$scope.steps = [
			{
				templateUrl: './components/ftue/steps-tpl/slide1.html',
				title: 'Dinos un poco acerca de tu negocio',
				hasForm: true
			},
			{
				templateUrl: './components/ftue/steps-tpl/slide2.html',
				title: '¿En qué etapa se encuentra tu negocio?',
				hasForm: true
			},
			{
				templateUrl: './components/ftue/steps-tpl/slide3.html',
				title: 'Dinos acerca de tu negocio',
				hasForm: true
			},
			{
				templateUrl: './components/ftue/steps-tpl/slide4.html',
				title: 'Añadiendo capas',
				controller: AddingLayersCtrl
				// hasForm: true
			},
			{
				templateUrl: './components/ftue/steps-tpl/slide5.html',
				title: 'Completado',
			}
		];

		function AddingLayersCtrl(multiStepFormInstance) {
			$scope.layer_added = true;
			$timeout(function(){
				$scope.layer_added = false;
			}, 5000);
			//var currentStep = multiStepFormInstance.getActiveStep();
		}
		
		$scope.finishFtue = function() {
			var dataForm = $scope.ftue;
			$mdDialog.hide({success: true, data: dataForm});
		}
		
		
		// function IsolatedStepCtrl(multiStepFormScope){
		// 	console.log(multiStepFormScope)
		// 	console.log($scope.ftue)
			// $scope.ftue = angular.copy(multiStepFormScope.ftue);
	  //     $scope.$on('$destroy', function () {
	  //       multiStepFormScope.ftue = angular.copy($scope.ftue);
	  //   });
		//}
		
	};

	FirstTimeUserController.$inject = ['_','$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', '$location'];

	angular.module('walmex').controller('FirstTimeUserController', FirstTimeUserController);

})();
