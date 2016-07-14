(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	function CompetenceVarJsonService($q, $http){
		var deferred = null,
		_competenceVarJsonRequest = null,
		_this = null;

		this.competenceVarJsonRequest = function(data){
			deferred = $q.defer();

			_competenceVarJsonRequest = $http({
				url: './catalogs/denue.json',
				method: 'GET'
			});

			_competenceVarJsonRequest.then(function(result){
				deferred.resolve(result);
			}, function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		};

	}
	CompetenceVarJsonService.$inject = ['$q', '$http'];
	angular.module('add.competence.var.service', []).
		service('CompetenceVarJsonService', CompetenceVarJsonService);

})();
