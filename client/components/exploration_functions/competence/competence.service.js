(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function CompetenceService($q, $http, Auth){
		var deferred = null;
		return {
			apiBaseURL: 'http://52.8.211.37/api.walmex.latlong.mx',

			/**
			 * [addNewCompetence Add new competence by Csv to map]
			 * @param {[type]} formData [Serialized data from form]
			 */
			addNewCompetence: function(formData){
				var access_token = Auth.getToken();
				deferred = $q.defer();

				$http({
					url: this.apiBaseURL+'/ws/places?competence=1',
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

			/**
			 * [getLocations Get all locations to map]
			 * @param  {[type]} opts [Only for competence locations]
			 */
			getCompetences: function(opts){
				deferred = $q.defer();
				var access_token = Auth.getToken();
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
			},
			
			/**
			 * [updateLayer Update a layer from Map and Database]
			 * @param  {[type]} id [Id of layer to remove]
			 */
			updateCompetenceLayer: function(id){
				var access_token = Auth.getToken();
				deferred = $q.defer();

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

			delCompetence: function(id){
				deferred = $q.defer();
				var access_token = Auth.getToken();

				var _competences = $http({
					url: this.apiBaseURL+'/ws/places/'+id,
					method: "DELETE",
					headers: {
						'Content-Type': undefined,
						'Authorization': 'Bearer '+access_token.access_token
					}
				});
				_competences.then(function(result){
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
			 * [updateLocationVar Update name and/or icon from an item list]
			 * @param  {[type]} formData [Serialized data from form]
			 * @param  {[type]} id_layer [description]
			 */
			updatCompetenceVar: function(formData, id_layer){
				var access_token = Auth.getToken();
				deferred = $q.defer();

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
		};
	}
	CompetenceService.$inject = ['$q', '$http', 'Auth'];
	angular.module('competence.service', []).
		service('CompetenceService', CompetenceService);

})();
