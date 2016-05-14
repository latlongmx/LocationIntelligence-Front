(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	function AuthFactory($location, $window, $rootScope, BaseMapService){
		var _privateRoutes = null,
		_session = null,
		_key = null;

		return {
			login: function(session) {
				_session = JSON.stringify(session);
				sessionStorage.setItem('access_token', _session);
				$location.path("/mapa");
			},
			getToken : function() {
				return JSON.parse(sessionStorage.getItem('access_token'));
			},
			logout: function() {
				sessionStorage.removeItem('access_token');
				// setTimeout(function() {
				// window.location.href = "http://52.8.211.37/walmex.latlong.mx";
				// }, 0);
				$location.path("/login");
			},
			checkStatus : function() {
				var token = this.getToken();
				_privateRoutes = ["/mapa"];
				$location.replace();
				
				if(this.in_array($location.path(), _privateRoutes) && token === null){
					$location.path("/login");
					$location.replace();
					return false;
				}
				
				if($location.path("/login") && token !== null){
					$location.path("/mapa");
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
	AuthFactory.$inject = ['$location','$window', '$rootScope', 'BaseMapService'];
	angular.module('login.factory', []).
		factory('Auth', AuthFactory);
}());
