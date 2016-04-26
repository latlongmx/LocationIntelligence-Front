(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function LoginController($scope, LoginService, $location){
		var lg = this;
		var _$js_login_form = null,
		_data = null,
		_session = null;
		lg.login = {
			status: "Iniciar"
		}

		lg.submitLogin = function(loginForm, data){
			if(loginForm.$valid) {
				lg.login = {
					status: "enviando"
				}
				_data = LoginService.encodeData(data);
				LoginService.loginRequest(_data).
				then(function(data){
					if(data.status === 200 && data.statusText === "OK") {
						_session = JSON.stringify(data.data);
						$location.path("/mapa");
						sessionStorage.setItem('access_token', _session);
					}
				}, function(error){
					lg.login = {
						status: "Enviar",
						error : "Ha ocurrido un error, intenta nuevamente"
					}

					if(error.status === 401 && error.statusText === "Unauthorized") {
						lg.login = {
							status: "Enviar",
							error : "Los datos son incorrectos"
						}
						sessionStorage.removeItem('access_token');
					}
				});
			}
		}

	};
	
	LoginController.$inject = ['$scope', 'LoginService','$location'];

	angular.module('login', []).
	controller('LoginController', LoginController);

})();
