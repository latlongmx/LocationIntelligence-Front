(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function LocationService($q, $http, Auth){
		var deferred = null,
		_testRequest = null;
		return {
			apiBaseURL: 'http://52.8.211.37/api.walmex.latlong.mx',

			addNewLocation:  function(formData){
				var access_token = Auth.getToken();
				deferred = $q.defer();

				$http({
					url: this.apiBaseURL+'/ws/places', 
					method: "POST",
					data: formData,
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined,
						'Authorization': 'Bearer '+access_token.access_token
					}
				})
				.then(function(dat){
					deferred.resolve(dat);
				}, function(err){
					deferred.reject(err);
				});
				return deferred.promise;
			},

			getLocations: function(){
				deferred = $q.defer();
				var access_token = Auth.getToken();
				var _locations = $http({
					url: this.apiBaseURL+'/ws/places',
					method: "GET",
					headers: {
						'Content-Type': undefined,
						'Authorization': 'Bearer '+access_token.access_token
					}
				});
				_locations.then(function(result){
					deferred.resolve(result);
				}, function(error){
					if(error.status===401 && error.statusText==='Unauthorized'){
						//Actualizar token
					}
					deferred.reject(error);
				});
				return deferred.promise;
			},

			delLocation: function(id){
				deferred = $q.defer();
				var access_token = Auth.getToken();
				var _locations = $http({
					url: this.apiBaseURL+'/ws/places/'+id,
					method: "DELETE",
					headers: {
						'Content-Type': undefined,
						'Authorization': 'Bearer '+access_token.access_token
					}
				});
				_locations.then(function(result){
					deferred.resolve(result);
				}, function(error){
					if(error.status===401 && error.statusText==='Unauthorized'){
						//Actualizar token
					}
					deferred.reject(error);
				});
				return deferred.promise;
			},

			updateLocationVar:  function(formData, id_layer){
				var access_token = Auth.getToken();
				deferred = $q.defer();

				$http({
					url: this.apiBaseURL+'/ws/places/'+id_layer, 
					method: "PUT",
					data: formData,
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined,
						'Authorization': 'Bearer '+access_token.access_token
					}
				})
				.then(function(dat){
					deferred.resolve(dat);
				}, function(err){
					deferred.reject(err);
				});
				return deferred.promise;
			}
		};
	}
	LocationService.$inject = ['$q', '$http', 'Auth'];
	angular.module('location.service', []).
		service('LocationService', LocationService);

})();
