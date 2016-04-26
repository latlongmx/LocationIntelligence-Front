(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	function LoginService($q, $http, $httpParamSerializer){
		var deferred = $q.defer();

		var _lginRequest = null,
		username = null,
		password = null,
		grant_type = "password",
		client_id = null,
		client_secret = null,
		_data = null,
		_session = null;

		return {
			encodeData : function(encode){
				username = encode.user;
				password = md5(encode.password);
				client_id = md5(username);
				client_secret = sha256(password).substr(0,40);
				_data = {username: username, password: password, grant_type: grant_type, client_id: client_id, client_secret: client_secret};
				return _data;
			},

			loginRequest : function(data){
				_lginRequest = $http({
					url: 'http://52.8.211.37/api.walmex.latlong.mx/oa/accesstk',
					method: 'POST',
					data: $httpParamSerializer(data),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
					}
				});

				_lginRequest.then(function(result){
					deferred.resolve(result);
				}, function(error){
					deferred.reject(error);
				});
				return deferred.promise;
			}
		}

		// this.BindToAutocomplete = function(){
			// return this.AutoComplete(bindTo('bounds', this.mapElement()));
		// }
	}
	LoginService.$inject = ['$q', '$http', '$httpParamSerializer'];
	angular.module('login.service', []).
		service('LoginService', LoginService);

}());
