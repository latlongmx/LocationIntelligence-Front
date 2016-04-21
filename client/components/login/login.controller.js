(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function LoginController($scope, LoginService){
		var _$js_login_form = null;

	_$js_login_form = document.getElementsByClassName('js-login-form');
		this.submitLogin = function(loginForm, data){
			if(loginForm.$valid) {
				LoginService.loginRequest(data);
				//console.log()
			}
		}
	};
	
	LoginController.$inject = ['$scope', 'LoginService'];
	
	angular.module('login', []).
	controller('LoginController', LoginController);

})();
