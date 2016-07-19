(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function BaseMapService($q, $http, Auth){
		var deferred = $q.defer(),
		_testRequest = null;
		return {
			apiBaseURL: 'http://52.8.211.37/api.walmex.latlong.mx',
			map: deferred.promise,
			featureGroup : L.featureGroup(),
			mapId : 'pokaxperia.pk657nfi',
			accessToken : 'pk.eyJ1IjoicG9rYXhwZXJpYSIsImEiOiJjaW13eHJ2NHMwM2Uwdjdra3c1bWF3Nzd6In0.leOLCkHazd_6JAQtdiHOFw',
			resolve: function (element) {
			  deferred.resolve(new L.Map(element).setView([19.432711775616433, -99.13325428962708], 12));
			},

			autoComplete : function(searchInput){
				return new google.maps.places.Autocomplete(searchInput);
			},
			drawControl : function(feature){
				return new L.Control.Draw({
					draw: {
						rectangle: false,
						marker: false,
						polyline: {
							shapeOptions: {
		          	color: '#f06eaa',
								opacity: 1
		          }
		        },
					},
					edit: {
						featureGroup: feature,
						selectedPathOptions: {
				        maintainColor: true
				    }
					}
				});
			},

			/**
	     * [intersect: Solicita e servicio de obtener las geometrias que intersecten WKT sobre el layer solicitado]
			 * @param {[type]} object [element drawed]
	     * @return {Object} http promise
	     */
			intersect: function(opts){
				deferred = $q.defer();
				var access_token = Auth.getToken();
				var _intersect = $http({
					url: this.apiBaseURL + '/dyn/intersect',
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					},
					params: opts
				});
				_intersect.then(function(result){
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
	     * [intersect: Solicita e servicio de obtener las geometrias que intersecten WKT sobre el layer solicitado]
			 * @param {[type]} object [element drawed]
	     * @return {Object} http promise
	     */
			getPlaces: function(opts){
				deferred = $q.defer();
				var access_token = Auth.getToken();
				var _getPlaces = $http({
					url: this.apiBaseURL + '/ws/places',
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					}
				});
				_getPlaces.then(function(result){
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
	     * [intersect: Solicita el servicio de obtener las geometrias que intersecten WKT sobre el layer solicitado]
			 * @param {[type]} object [element drawed]
	     * @return {Object} http promise
	     */
			addPlaces: function(opts){
				deferred = $q.defer();
				var access_token = Auth.getToken();
				var _getPlaces = $http({
					url: this.apiBaseURL + '/ws/places',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					}
				});
				_getPlaces.then(function(result){
					deferred.resolve(result);
				}, function(error){
					if(error.status===401 && error.statusText==='Unauthorized'){
						//Actualizar token
					}
					deferred.reject(error);
				});
				return deferred.promise;
			},

			addCompetenciaQuery: function(opts){
				deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _addCompetenciaQuery = $http({
					url: this.apiBaseURL + '/ws/places',
					method: 'POST',
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined,
						'Authorization': 'Bearer '+access_token
					},
					data: opts
				});
				_addCompetenciaQuery.then(function(result){
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
	     * [setHeatMap: Solicita los datos para crear el heatmap]
			 * @param {[type]} object [element drawed]
	     * @return {Object} http promise
	     */
			getHeatMapData: function(opts){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _heatMap = $http({
					url: this.apiBaseURL + '/dyn/heat',
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					},
					params: opts
				});
				_heatMap.then(function(result){
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
	     * [addUserHeatMap: Agrega un heatmap del usuario]
			 * @param {[type]} object [valores de heatmap a guardar]
	     * @return {Object} http promise
	     */
			addUserHeatMap: function(opts){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _heatMap = $http({
					url: this.apiBaseURL + '/ws/heat',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					},
					params: opts
				});
				_heatMap.then(function(result){
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
	     * [getUserHeatMap: Obtiene los heatmas del usuario]
	     * @return {Object} http promise
	     */
			getUserHeatMap: function(){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _heatMap = $http({
					url: this.apiBaseURL + '/ws/heat',
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					}
				});
				_heatMap.then(function(result){
					deferred.resolve(result);
				}, function(error){
					if(error.status===401 && error.statusText==='Unauthorized'){
						//Actualizar token
					}
					deferred.reject(error);
				});
				return deferred.promise;
			},

			/* [delUserHeatMap: Elimina el heatmap del usuario]
			 * @return {Object} http promise
			*/
			delUserHeatMap: function(layer){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var _heatMap = $http({
					url: this.apiBaseURL + '/ws/heat/'+layer,
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					}
				});
				_heatMap.then(function(result){
					deferred.resolve(result);
				}, function(error){
					if(error.status===401 && error.statusText==='Unauthorized'){
						//Actualizar token
					}
					deferred.reject(error);
				});
				return deferred.promise;
			},
			
			/* [updUserHeatMap: Actualiza el nombre del heatmap]
				* @return {Object} http promise
			*/
			updUserHeatMap: function(layer, name){
				var deferred = $q.defer();
				var access_token = Auth.getToken().access_token;
				var formData = new FormData();
				formData.append("nom", name);
				
				var _heatMap = $http({
					url: this.apiBaseURL + '/ws/heat_u/'+layer,
					method: 'POST',
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined,
						'Authorization': 'Bearer '+access_token
					},
					data: formData
				});
				_heatMap.then(function(result){
					deferred.resolve(result);
				}, function(error){
					if(error.status===401 && error.statusText==='Unauthorized'){
						//Actualizar token
					}
					deferred.reject(error);
				});
				return deferred.promise;
			}

		};
	}
	BaseMapService.$inject = ['$q', '$http', 'Auth'];
	angular.module('basemap.service', []).
		service('BaseMapService', BaseMapService);

})();
