(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function AuthFactory($location, $window, $rootScope){
		var _privateRoutes = null,
		_session = null,
		_key = null;

		return {
			login: function(session) {
				_session = JSON.stringify(session);
				sessionStorage.setItem('access_token', _session);
				$location.path("/mapa").replace();
			},
			getToken : function() {
				return JSON.parse(sessionStorage.getItem('access_token'));
			},
			logout: function() {
				sessionStorage.removeItem('access_token');
				$location.path("/").replace();
			},
			checkStatus : function() {
				var token = this.getToken();
				_privateRoutes = ["/mapa"];

				if(this.in_array($location.path(), _privateRoutes) && token === null){
					$location.path("/login").replace();
					return false;
				}

				if($location.path("/login") && token !== null){
					$location.path("/mapa").replace();
					return true;
				}

				return true;
			},
			in_array : function(needle, haystack) {
				var key = '';
				for(key in haystack){
					if(haystack[key] == needle){
						return true;
					}
				}
				return false;
			}
		};

	}
	AuthFactory.$inject = ['$location', '$window', '$rootScope'];
	angular.module('login.factory', []).
		factory('Auth', AuthFactory);
})();
