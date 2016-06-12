(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function LocationService($q, $http, Auth){
		var deferred = $q.defer(),
		_testRequest = null;
		return {
      apiBaseURL: 'http://52.8.211.37/api.walmex.latlong.mx',

      addNewLocation:  function(formData){
        var access_token = Auth.getToken();

				$http.post(this.apiBaseURL+'/ws/places', formData, {
            transformRequest: angular.identity,
            headers: {
							'Content-Type': undefined,
							'Authorization': 'Bearer '+access_token.access_token
						}
        })
        .success(function(dat){
					console.log(dat);
					deferred.resolve(dat);
        })
        .error(function(err){
					console.log(err);
					deferred.reject(err);
        });

        /*var _addNewLoc = $http({
					url: this.apiBaseURL + '/ws/places',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+access_token
					},
					params: opts
				});
				_addNewLoc.then(function(result){
					deferred.resolve(result);
				}, function(error){
					if(error.status===401 && error.statusText==='Unauthorized'){
						//Actualizar token
					}
					deferred.reject(error);
				});*/
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
			}
    };
  }
  LocationService.$inject = ['$q', '$http', 'Auth'];
  angular.module('location.service', []).
    service('LocationService', LocationService);

})();
