(function(){
	/*
	* Login Factory
	*/
	'use strict';

	function AuthFactory($location, $window, $rootScope, ROLES){
		var _privateRoutes = null,
		_publicRoutes = null,
		_userType = null,
		_session = null,
		_key = null,
		_token = null;

		return {
			getToken : function() {
				if (JSON.parse(sessionStorage.getItem('access_token'))) {
					return JSON.parse(sessionStorage.getItem('access_token'));
				}
				return console.error("not autorized");
			},
			login: function(session) {
				_token = this.getToken();
				_session = JSON.stringify(session);
				sessionStorage.setItem('access_token', _session);
				$location.path("/mapa").replace();
			},
			logout: function() {
				sessionStorage.removeItem('access_token');
				$location.path("/").replace();
			},
			checkStatus : function() {
				_token = this.getToken();
				_privateRoutes = ["/mapa"];
				_publicRoutes = ["/login", "/registro"];

				if (_token) {
					if (this.status_routes($location.path(), _privateRoutes) || this.status_routes($location.path(), _publicRoutes)) {
						$location.path("/mapa").replace();
						return true;
					}
				}
				if (this.status_routes($location.path(), _publicRoutes)) {
					return true;
				}
				return false;
			},
			status_routes : function(needle, haystack) {
				var key = '';
				for(key in haystack){
					if(haystack[key] === needle){
						return true;
					}
				}
				return false;
			},
			getPermission: function(){
				_token = this.getToken();
				if (_token) {
					for(var key in ROLES){
						if(ROLES[key] === _token.userType){
							_userType = _token.userType;
						}
					}
				}
				else {
					_userType = null;
				}
				return _userType;
			}
		};

	}
	AuthFactory.$inject = ['$location', '$window', '$rootScope', 'ROLES'];
	angular.module('walmex').factory('Auth', AuthFactory);
})();
