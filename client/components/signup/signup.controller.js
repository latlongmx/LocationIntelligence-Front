(function(){
	/*
	* Login Controller
	*/
	'use strict';

	function RegistroController($scope, $location, $timeout, $mdDialog, loginService, Auth, uiService, messagesService){
		var rg = this,
		_$js_login_form = null,
		_data = null,
		_session = null,
		_$buttonForm = null,
		_$inputsInForm = null,
		_$js_signup_error = null,
		_signupProcess = null,
		_userDataAccess = null;

		_$js_signup_error = angular.element(document.getElementsByClassName('js-signup-error'));
		_$inputsInForm = angular.element(document.getElementsByName('signupForm')).find('input');
		_$buttonForm = angular.element(document.getElementsByName('signupForm')).find('[type=submit]');
		
		rg.success_signup = "¿Ya tienes una cuenta?";

		rg.submitSignup = function(signupForm, data){
			uiService.addLogginIsLoading(_$buttonForm, messagesService.addMessageSignup);
			if(signupForm.$valid) {
				_firstTimeUser(_userDataAccess);
				// _signupProcess = loginService.signupRequest(data);
				// _signupProcess.then(function(result){
				// 	if(result.status === 200 && result.data.user_exist === 1) {
				// 		rg.error = true;
				// 		_.each(_$inputsInForm, function(_inputs){
				// 			uiService.cleanInputs(_inputs);
				// 		});
				// 		rg.message = messagesService.userExists();
				// 		$timeout(function(){
				// 			rg.error = false;
				// 		}, 2500);
				// 		uiService.removeLogginIsLoading(_$buttonForm, messagesService.removeMessageSignup);
				// 	}
				// 	if(result.status === 200 && result.data.user_exist === 0) {
				// 		_userDataAccess = {user: data.user, password: data.password};
				// 		_firstTimeUser(_userDataAccess);
				// 	}
				// }, function(error){
				// 	rg.error = true;
				// 	uiService.removeLogginIsLoading(_$buttonForm, messagesService.removeMessageSignup);
				// 	_.each(_$inputsInForm, function(_inputs){
				// 		uiService.cleanInputs(_inputs);
				// 	});
				// 	if(error.status === 500){
				// 		rg.message = messagesService.serverErrorRequest();
				// 		$timeout(function(){
				// 			rg.error = false;
				// 		}, 2500);
				// 	}
				// });
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
		
		function _firstTimeUser(data) {
			$mdDialog.show({
				controller: 'FirstTimeUserController',
				templateUrl: './components/ftue/ftue.tpl.html',
				parent: angular.element(document.body),
				targetEvent: data,
				clickOutsideToClose:true
			})
			.then(function(result){
				console.log(result)
			});
			// rg.signup_success = true;
			// rg.success_signup = messagesService.loginFirstTime();
			// loginService.loginRequest({user: data.user, password: data.password})
			// .then(function(result){
			// 	if(result.status === 200 && result.statusText === "OK"){
			// 		$timeout(function(){
			// 			rg.success_signup = messagesService.redirectToMap();
			// 		}, 2500);
			// 		$timeout(function(){
			// 			Auth.login(result.data);
			// 		}, 3500);
			// 	}
			// }, function(error){
			// 	messagesService.serverErrorRequest();
			// });
			
			// uiService.addLogginIsLoading(_$buttonForm, messagesService.redireccionandoToLogin);
		}

	}
	
	RegistroController.$inject = ['$scope', '$location', '$timeout', '$mdDialog', 'loginService', 'Auth', 'uiService', 'messagesService'];

	angular.module('walmex').controller('RegistroController', RegistroController);

})();
