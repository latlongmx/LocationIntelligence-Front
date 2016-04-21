(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	function LoginService($q, $http){
		var deferred = $q.defer();

		var _lginRequest = null,
		_user = null,
		_password = null,
		_grant_type = "password",
		_client_id = null,
		_client_secret = null,
		_data = {};

		return {
			loginRequest : function(data){
				_user = data.user;
				_password = md5(data.password);
				_client_id = md5(_user);
				_client_secret = sha256(_password).substr(0,40);

				_data.user = _user;
				_data.password = _password;
				_data.grant_type = _grant_type;
				_data.client_id = _client_id;
				_data.client_secret = _client_secret;

				_lginRequest = $http({
					url: 'http://52.8.211.37/api.walmex.latlong.mx/oa/accesstk',
					method: 'POST',
					data: _data
				});
				
				_lginRequest.then(function(result){
					console.log(result)
				}, function(error){
					console.log(error)
				});
			}
		}
		// this.BindToAutocomplete = function(){
			// return this.AutoComplete(bindTo('bounds', this.mapElement()));
		// }
	}
	LoginService.$inject = ['$q', '$http'];
	angular.module('login.service', []).
		service('LoginService', LoginService);

}());
