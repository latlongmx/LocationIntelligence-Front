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

      addNew:  function(opts){
        var access_token = Auth.getToken();
        var _addNewLoc = $http({
					url: this.apiBaseURL + '/dyn/intersect',
					method: 'GET',
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
				});
      }
    };
  }
  BaseMapService.$inject = ['$q', '$http', 'Auth'];
  angular.module('location.service', []).
    service('LocationService', LocationService);

})();
