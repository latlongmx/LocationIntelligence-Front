(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function BaseMapService($q, $http){
		var deferred = $q.defer(),
		_testRequest = null;
		return {
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
			testRequest: function(opts){
				deferred = $q.defer();
				_testRequest = $http(opts);

				_testRequest.then(function(result){
					deferred.resolve(result);
				}, function(error){
					deferred.reject(error);
				});
				return deferred.promise;
			}
		};
	}
	BaseMapService.$inject = ['$q', '$http'];
	angular.module('basemap.service', []).
		service('BaseMapService', BaseMapService);

}());
