(function(){
	/*
	* First Time User Controller
	*/
	'use strict';

	function FirstTimeUserController(_, $scope, $mdDialog, $mdToast, $interval, $timeout, $location, ftue_bbox, BaseMapService, FtueService, Auth){
		$scope.ftue = {};
		$scope.adding_layer_status = "Añadiendo las ubicaciones de tu competencia al mapa...";
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

		function AddingLayersCtrl() {
	
			$scope.layer_added = true;
			var access_token = Auth.getToken();
			var formData = new FormData();
			var pin = "";

			formData.append('qf', 'oxxo' );
			formData.append('qb', ftue_bbox );
			formData.append('competence', "1" );
			formData.append('nm', "mi competencia" );
			formData.append('pin', pin?pin:'' );

			BaseMapService.addCompetenciaQuery(formData)
			.then(function(result){
				console.log(result)
				if (result.statusText === 'OK' && result.status === 200) {
					$scope.adding_layer_status = "Las capas de tu competencia han sido añadidas al mapa.";
					_registerFtue();
				}
			}, function(error){
				console.log(error)
			});

			function _registerFtue() {
				var dataForm = $scope.ftue;
				var formData = new FormData();

				formData.append('ftue_etapa', dataForm.stage );
				formData.append('ftue_nombre', dataForm.company_name );
				formData.append('ftue_categoria', dataForm.business_category);
				formData.append('ftue_subcat1', "" );
				formData.append('ftue_subcat2', "" );
				formData.append('ftue_entidad', dataForm.city );
				formData.append('ftue_municipio', "" );

				FtueService.addNewFtue(formData)
				.then(function(result){
					console.log(result);
					if (result.statusText === 'OK' && result.status === 200) {
						$scope.layer_added = false;
					}
					
				}, function(error){
					console.log(error);
				});
			}

		}
		
		$scope.finishFtue = function() {
			//var dataForm = $scope.ftue;
			$mdDialog.hide({ftue_status: "completed", success: true});
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

	FirstTimeUserController.$inject = ['_','$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', '$location', 'ftue_bbox', 'BaseMapService', 'FtueService', 'Auth'];

	angular.module('walmex').controller('FirstTimeUserController', FirstTimeUserController);

})();
