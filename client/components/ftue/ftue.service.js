(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function FtueService($q, $http, Auth, baseUrl){
		var deferred = null;
		return {
			apiBaseURL: baseUrl,

			/**
			 * [addNewCompetence Add new competence by Csv to map]
			 * @param {[type]} formData [Serialized data from form]
			 */
			addNewFtue: function(formData){
				var access_token = Auth.getToken();
				deferred = $q.defer();

				$http({
					url: this.apiBaseURL+'/ws/ftue',
					method: "POST",
					data: formData,
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined,
						'Authorization': 'Bearer '+access_token.access_token
					}
				})
				.then(function(result){
					deferred.resolve(result);
				}, function(err){
					deferred.reject(err);
				});
				return deferred.promise;
			}
		};
	}
	FtueService.$inject = ['$q', '$http', 'Auth', 'baseUrl'];
	angular.module('walmex').service('FtueService', FtueService);

})();
