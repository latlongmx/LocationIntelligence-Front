(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function LoginController($scope, LoginService){
		var _$js_login_form = null,
		_data = null;

		this.submitLogin = function(loginForm, data){
			if(loginForm.$valid) {
				_data = LoginService.encodeData(data);
				LoginService.loginRequest(_data).
				then(function(data){
					//console.log(data)
				}, function(error){
					//console.log(error)
				});
			}
		}

	};
	
	LoginController.$inject = ['$scope', 'LoginService'];
	
	angular.module('login', []).
	controller('LoginController', LoginController);

})();
