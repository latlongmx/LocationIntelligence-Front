(function(){
	/*
	* Login Factory
	*/
	'use strict';

	function AuthFactory($location, $window, $rootScope, ROLES){
		var _privateRoutes = null,
		_userType = null,
		_session = null,
		_key = null;

		return {
			getToken : function() {
				return JSON.parse(sessionStorage.getItem('access_token'));
			},
			login: function(session) {
				var token = this.getToken();
				_session = JSON.stringify(session);
				sessionStorage.setItem('access_token', _session);
				$location.path("/mapa").replace();
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
					if(haystack[key] === needle){
						return true;
					}
				}
				return false;
			},
			getPermission: function(){
				var token = this.getToken();
				if (token) {
					for(var key in ROLES){
						if(ROLES[key] === token.userType){
							_userType = token.userType;
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
