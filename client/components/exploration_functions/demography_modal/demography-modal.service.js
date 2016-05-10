(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	function DemographyJsonService($q, $http){
		var deferred = null,
		_demographyJsonRequest = null,
		_this = null;

		this.demographyJsonRequest = function(data){
			deferred = $q.defer();

			_demographyJsonRequest = $http({
				url: './catalogs/demography.json',
				method: 'GET'
			});

			_demographyJsonRequest.then(function(result){
				deferred.resolve(result);
			}, function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		};

	}
	DemographyJsonService.$inject = ['$q', '$http'];
	angular.module('demograhpy.json.service', []).
		service('DemographyJsonService', DemographyJsonService);

}());
