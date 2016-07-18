(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function LoginController($scope, LoginService, $location, $timeout, Auth, BaseMapService, uiService, messagesService){
		var lg = this,
		_$js_login_form = null,
		_data = null,
		_session = null,
		_buttonForm = null,
		_inputsInForm = null,
		_$js_login_error = null;

		_$js_login_error = angular.element(document.getElementsByClassName('js-login-error'));
		_inputsInForm = angular.element(document.getElementsByName('loginForm')).find('input');
		
		lg.submitLogin = function(loginForm, data){
			_buttonForm = angular.element(document.getElementsByName('loginForm')).find('[type=submit]');
			uiService.addLogginIsLoading(_buttonForm, messagesService.addMessageLoggin);
			if(loginForm.$valid) {
				var loginProcess = LoginService.loginRequest(data);
				
				loginProcess.then(function(result){
					if(result.status === 200 && result.statusText === "OK") {
						Auth.login(result.data);
					}
				}, function(error){
					lg.error = true;
					uiService.removeLogginIsLoading(_buttonForm, messagesService.removeMessageLoggin);
					_.each(_inputsInForm, function(_inputs){
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
				uiService.removeLogginIsLoading(_buttonForm, messagesService.removeMessageLoggin);
			}
		};

	}
	
	LoginController.$inject = ['$scope', 'LoginService','$location', '$timeout', 'Auth', 'BaseMapService', 'uiService', 'messagesService'];

	angular.module('login', []).
	controller('LoginController', LoginController);

})();
