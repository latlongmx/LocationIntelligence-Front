(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	function LoginService($q, $http, $httpParamSerializer){
		var deferred = null;

		var _loginRequest = null,
		username = null,
		password = null,
		grant_type = "password",
		client_id = null,
		client_secret = null,
		_data = null,
		_session = null;

			// encodeData : function(encode){

			// 	return _data;
			// },

		this.loginRequest = function(data){
			deferred = $q.defer();
			_data = "";
			username = data.user;
			password = md5(data.password);
			client_id = md5(username);
			client_secret = sha256(password).substr(0,40);
			_data = {username: username, password: password, grant_type: grant_type, client_id: client_id, client_secret: client_secret};
			
			_loginRequest = $http({
				url: 'http://52.8.211.37/api.walmex.latlong.mx/oa/accesstk',
				method: 'POST',
				data: $httpParamSerializer(_data),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
				}
			});

			_loginRequest.then(function(result){
				deferred.resolve(result);
			}, function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		};

		// this.BindToAutocomplete = function(){
			// return this.AutoComplete(bindTo('bounds', this.mapElement()));
		// }
	}
	LoginService.$inject = ['$q', '$http', '$httpParamSerializer'];
	angular.module('login.service', []).
		service('LoginService', LoginService);

}());
