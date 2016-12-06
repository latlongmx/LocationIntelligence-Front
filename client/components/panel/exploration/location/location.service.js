(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function LocationService($q, $http, Auth, baseUrl){
		var deferred = null,
		access_token = Auth.getToken();
		return {
			apiBaseURL: baseUrl,

			/**
			 * [addNewLocation Add new locations to map]
			 * @param {[type]} formData [Serialized data from form]
			 */
			addNewLocation: function(formData){ 
				if (access_token) {
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
				}
			},

			/**
			 * [getLocations Get all locations to map]
			 * @param  {[type]} opts [Only for competence locations]
			 */
			getLocations: function(opts){
				deferred = $q.defer();
				if (access_token) {
					var _locations = $http({
						url: this.apiBaseURL+'/ws/places',
						method: "GET",
						headers: {
							'Content-Type': undefined,
							'Authorization': 'Bearer '+access_token.access_token
						},
						params: opts?opts:''
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
				}
			},
			getSingleLocation: function(id){
				console.log(id)
				deferred = $q.defer();
				var access_token = Auth.getToken();
				var _locations = $http({
					url: this.apiBaseURL+'/ws/places/' + id,
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
			
			/**
			 * [updateLayer Update a layer from Map and Database]
			 * @param  {[type]} id [Id of layer to remove]
			 */
			updateLocationLayer: function(id){
				deferred = $q.defer();
				if (access_token) {
					var _locations = $http({
						url: this.apiBaseURL+'/ws/places/' + id,
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
				}
			},

			delLocation: function(id){
				deferred = $q.defer();
				if (access_token) {
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
				}
			},

			/**
			 * [updateLocationVar Update name and/or icon from an item list]
			 * @param  {[type]} formData [Serialized data from form]
			 * @param  {[type]} id_layer [description]
			 */
			updateLocationVar: function(formData, id_layer){
				deferred = $q.defer();
				if (access_token) {
					$http({
						url: this.apiBaseURL+'/ws/places_u/'+id_layer,
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
				}
			}
		};
	}
	LocationService.$inject = ['$q', '$http', 'Auth', 'baseUrl'];
	angular.module('walmex').service('LocationService', LocationService);

})();
