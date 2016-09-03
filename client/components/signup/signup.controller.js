(function(){
	/*
	* Login Controller
	*/
	'use strict';

	function RegistroController($scope, $timeout, loginService, Auth, uiService, messagesService){
		var rg = this,
		_$js_login_form = null,
		_data = null,
		_session = null,
		_$buttonForm = null,
		_$inputsInForm = null,
		_$js_signup_error = null,
		_signupProcess = null;

		_$js_signup_error = angular.element(document.getElementsByClassName('js-signup-error'));
		_$inputsInForm = angular.element(document.getElementsByName('signupForm')).find('input');
		_$buttonForm = angular.element(document.getElementsByName('signupForm')).find('[type=submit]');

		rg.submitSignup = function(signupForm, data){
			uiService.addLogginIsLoading(_$buttonForm, messagesService.addMessageSignup);
			if(signupForm.$valid) {
				_signupProcess = loginService.signupRequest(data);
				_signupProcess.then(function(result){
					if(result.status === 200 && result.data.user_exist === 1) {
						rg.error = true;
						_.each(_$inputsInForm, function(_inputs){
							uiService.cleanInputs(_inputs);
						});
						rg.message = messagesService.userExists();
						$timeout(function(){
							rg.error = false;
						}, 2500);
						uiService.removeLogginIsLoading(_$buttonForm, messagesService.removeMessageSignup);
					}
					if(result.status === 200 && result.data.user_exist === 0) {
						rg.signup_success = true;
						uiService.addLogginIsLoading(_$buttonForm, messagesService.redireccionandoToLogin);
						$timeout(function(){
							$location.path("/login").replace();
						}, 2500);
					}
				}, function(error){
					rg.error = true;
					uiService.removeLogginIsLoading(_$buttonForm, messagesService.removeMessageSignup);
					_.each(_$inputsInForm, function(_inputs){
						uiService.cleanInputs(_inputs);
					});
					if(error.status === 500){
						rg.message = messagesService.serverErrorRequest();
						$timeout(function(){
							rg.error = false;
						}, 2500);
					}
				});
			}
			else {
				rg.error = true;
				rg.message = messagesService.fieldsRequired();
				$timeout(function(){
					rg.error = false;
				}, 2500);
				uiService.removeLogginIsLoading(_$buttonForm, messagesService.removeMessageSignup);
			}
		};

	}
	
	RegistroController.$inject = ['$scope', '$timeout', 'loginService', 'Auth', 'uiService', 'messagesService'];

	angular.module('walmex').controller('RegistroController', RegistroController);

})();
