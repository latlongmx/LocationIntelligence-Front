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
			login: function(session) {
				_session = JSON.stringify(session);
				sessionStorage.setItem('access_token', _session);
				$location.path("/mapa");
			},
			logout: function() {
				sessionStorage.removeItem('access_token');
				$location.path("/login");
				//console.log(sessionStorage.getItem('access_token').access_token);
			},
			// checkStatus : function() {
			// 	_privateRoutes = ["/mapa"];
			// 	if(this.in_array($location.path(),rutasPrivadas) && typeof(JSON.parse(sessionStorage.getItem('access_token').access_token)) == "undefined"){
			// 		console.log("funciona")
			// 			//$location.path("/");
			// 	}

				// if(this.in_array("/",rutasPrivadas) && typeof($cookies.username) != "undefined"){
				// 	$location.path("/mapa");
				// }
				
			// },
			// in_array : function(needle, haystack) {
			// 	var key = '';
			// 	for(key in haystack){
			// 		if(haystack[key] == needle)
			// 		{
			// 				return true;
			// 		}
			// 	}
			// 	return false;
			// }
		};
		
	}
	AuthFactory.$inject = ['$location'];
	angular.module('login.factory', []).
		factory('Auth', AuthFactory);

}());
