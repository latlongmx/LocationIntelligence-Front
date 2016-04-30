(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	function AuthFactory($location){
		var _privateRoutes = null,
		_session = null,
		_key = null;

		return {
			login : function(session) {
				_session = JSON.stringify(session);
				sessionStorage.setItem('access_token', _session);
				$location.path("/mapa");
			},
			logout : function() {
				sessionStorage.removeItem('access_token');
				$location.path("/login");
			}
		};
		
	}
	AuthFactory.$inject = ['$location'];
	angular.module('login.factory', []).
		factory('Auth', AuthFactory);

}());
