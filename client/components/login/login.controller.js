(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function LoginController($scope, $timeout, loginService, Auth, uiService, messagesService){
		var lg = this,
		_$js_login_form = null,
		_data = null,
		_session = null,
		_$buttonForm = null,
		_$inputsInForm = null,
		_$js_login_error = null,
		_loginProcess = null;

		_$js_login_error = angular.element(document.getElementsByClassName('js-login-error'));
		_$inputsInForm = angular.element(document.getElementsByName('loginForm')).find('input');
		_$buttonForm = angular.element(document.getElementsByName('loginForm')).find('[type=submit]');

		lg.submitLogin = function(loginForm, data){
			uiService.addLogginIsLoading(_$buttonForm, messagesService.addMessageLoggin);
			if(loginForm.$valid) {
				_loginProcess = loginService.loginRequest(data);
				_loginProcess.then(function(result){
					if(result.status === 200 && result.statusText === "OK") {
						Auth.login(result.data);
					}
				}, function(error){
					lg.error = true;
					uiService.removeLogginIsLoading(_$buttonForm, messagesService.removeMessageLoggin);
					_.each(_$inputsInForm, function(_inputs){
						uiService.cleanInputs(_inputs);
					});

					if(error.status === 401 && error.statusText === "Unauthorized") {
						sessionStorage.removeItem('access_token');
						lg.message = messagesService.userNotExists();
						$timeout(function(){
							lg.error = false;
						}, 2500);
					}
					else {
						sessionStorage.removeItem('access_token');
						lg.message = messagesService.serverErrorRequest();
						$timeout(function(){
							lg.error = false;
						}, 2500);
					}
				});
			}
			else {
				lg.error = true;
				lg.message = messagesService.fieldsRequired();
				$timeout(function(){
					lg.error = false;
				}, 2500);
				uiService.removeLogginIsLoading(_$buttonForm, messagesService.removeMessageLoggin);
			}
		};

	}
	
	LoginController.$inject = ['$scope', '$timeout', 'loginService', 'Auth', 'uiService', 'messagesService'];

	angular.module('login', []).
	controller('LoginController', LoginController);

})();
