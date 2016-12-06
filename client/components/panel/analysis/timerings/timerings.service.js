(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function TimeRingsService($q, $http, Auth, baseUrl){
		var deferred = null;
    var _service = {
			apiBaseURL: baseUrl,

			getUserRings: function(id){
				var obs = {};
				if(id!==undefined){
					obs = {
						id: id
					};
				}else{
					id = '';
				}
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _http = $http({
					url: this.apiBaseURL + '/ws/rings/'+id,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					},
					params: obs
				});
				_http.then(function(result){
					deferred.resolve(result);
				}, function(error){
					if(error.status===401 && error.statusText==='Unauthorized'){
						//Actualizar token
					}
					deferred.reject(error);
				});
				return deferred.promise;
			},

			addUserRings: function(opts){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _http = $http({
					url: this.apiBaseURL + '/ws/rings',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					},
					params: opts
				});
				_http.then(function(result){
					deferred.resolve(result);
				}, function(error){
					if(error.status===401 && error.statusText==='Unauthorized'){
						//Actualizar token
					}
					deferred.reject(error);
				});
				return deferred.promise;
			},

			updateUserRings: function(id, nm){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _http = $http({
					url: this.apiBaseURL + '/ws/rings_u/'+id,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					},
					params: {
						nom:nm
					}
				});
				_http.then(function(result){
					deferred.resolve(result);
				}, function(error){
					if(error.status===401 && error.statusText==='Unauthorized'){
						//Actualizar token
					}
					deferred.reject(error);
				});
				return deferred.promise;
			},

			delUserRings: function(id){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _http = $http({
					url: this.apiBaseURL + '/ws/rings/'+id,
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					}
				});
				_http.then(function(result){
					deferred.resolve(result);
				}, function(error){
					if(error.status===401 && error.statusText==='Unauthorized'){
						//Actualizar token
					}
					deferred.reject(error);
				});
				return deferred.promise;
			},

		};
		return _service;
	}
	TimeRingsService.$inject = ['$q', '$http', 'Auth', 'baseUrl'];
	angular.module('walmex').service('TimeRingsService', TimeRingsService);

})();