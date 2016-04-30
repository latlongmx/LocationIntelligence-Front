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
				console.log(session)
				// _session = JSON.stringify(session);
				// sessionStorage.setItem('access_token', _session);
				// $location.path("/mapa");
			}
		}
		
	}
	AuthFactory.$inject = ['$location'];
	angular.module('login.factory', []).
		factory('Auth', AuthFactory);

}());
