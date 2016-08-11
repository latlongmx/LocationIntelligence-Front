(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function AccessibilityService($q, $http, Auth){
		var deferred = null;
    var _service = {
			apiBaseURL: 'http://52.8.211.37/api.walmex.latlong.mx',

      /**
	     * [viasInfo: Solicita la informacion de las vias que tocan el dibujo]
			 * @param {[type]} object [element drawed]
	     * @return {Object} http promise
	     */
			viasInfo: function(opts){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _http = $http({
					url: this.apiBaseURL + '/vias',
					method: 'GET',
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

			getUserDraws: function(id){
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
					url: this.apiBaseURL + '/ws/draw/'+id,
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

			addUserDraws: function(opts){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _http = $http({
					url: this.apiBaseURL + '/ws/draw/',
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

			updateUserDraws: function(id, nm){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _http = $http({
					url: this.apiBaseURL + '/ws/draw_u/'+id,
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

			delUserDraws: function(id){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _http = $http({
					url: this.apiBaseURL + '/ws/draw/'+id,
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
	AccessibilityService.$inject = ['$q', '$http', 'Auth'];
	angular.module('accessibility.service', []).
		service('AccessibilityService', AccessibilityService);

})();
