(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function LoginController($scope, LoginService, $location, $timeout, Auth){
		var lg = this;
		var _$js_login_form = null,
		_data = null,
		_session = null;
		lg.status = {
			text: "Enviar"
		}

		lg.submitLogin = function(loginForm, data){
			if(loginForm.$valid) {
				// lg.status = {
				// 	text: "Enviando"
				// }
				//_data = LoginService.encodeData(data);
				var promesa = LoginService.loginRequest(data);
				
				promesa.then(function(result){
					if(result.status === 200 && result.statusText === "OK") {
						Auth.login(result.data);
						// _session = JSON.stringify(result.data);
						// $location.path("/mapa");
						// sessionStorage.setItem('access_token', _session);
					}
				}, function(error){

					if(error.status === 401 && error.statusText === "Unauthorized") {
						sessionStorage.removeItem('access_token');
						lg.error = {
							text : "Las credenciales son incorrectas",
							error : true
						}

						$timeout(function(){
							lg.status = {
								text: "Enviar"
							}
						}, 0);

						$timeout(function(){
							lg.error = {
								error : false
							}
						}, 2500);
					}
					else {
						lg.error = {
							text : "Ha ocurrido un error, intenta nuevamente",
							error : true
						}
						$timeout(function(){
							lg.status = {
								text: "Enviar"
							}
						}, 0);

						$timeout(function(){
							lg.error = {
								error : false
							}
						}, 2500);
					}
				});
			}
		}

	};
	
	LoginController.$inject = ['$scope', 'LoginService','$location', '$timeout', 'Auth'];

	angular.module('login', []).
	controller('LoginController', LoginController);

})();
