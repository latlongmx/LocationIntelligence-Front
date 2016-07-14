(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	function HeatmapVarJsonService($q, $http){
		var deferred = null,
		_heatmapVarJsonRequest = null,
		_this = null;

		this.heatmapVarJsonRequest = function(data){
			deferred = $q.defer();

			_heatmapVarJsonRequest = $http({
				url: './catalogs/denue.json',
				method: 'GET'
			});

			_heatmapVarJsonRequest.then(function(result){
				deferred.resolve(result);
			}, function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		};

	}
	HeatmapVarJsonService.$inject = ['$q', '$http'];
	angular.module('add.heatmap.service', []).
		service('HeatmapVarJsonService', HeatmapVarJsonService);

})();
