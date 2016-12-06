(function(){
	/*
	* User Service Module
	*/
	'use strict';

	function UserService($q, $http, Auth, baseUrl){
		var deferred = null;
		return {
			apiBaseURL: baseUrl,

			getOptions: function(){
				deferred = $q.defer();
				var access_token = Auth.getToken();
				var _locations = $http({
					url: this.apiBaseURL+'/ws/options',
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


			setOptions: function(formData){
				var access_token = Auth.getToken();
				deferred = $q.defer();

				$http({
					url: this.apiBaseURL+'/ws/options',
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
	UserService.$inject = ['$q', '$http', 'Auth', 'baseUrl'];
	angular.module('walmex').service('UserService', UserService);

})();
