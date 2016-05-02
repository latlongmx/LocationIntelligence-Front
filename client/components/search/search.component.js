(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function Search($window, $timeout, BaseMapService){

		return {
			restrict: 'E',
			template: [
				'<div class="m-search js-search-form">',
					'<input class="m-search__input js-search-input" id="search" type="text" ng-model="search" placeholder="buscar" map="map"/>',
					'<i class="demo demo-search m-search__icon js-search"></i>',
				'</div>'
			].join(''),
			scope: {
				id: '=map'
			},
			controller: function($scope){
				var _searchForm = angular.element(document.getElementsByClassName('js-search-form'));
				var _searchButton = angular.element(document.getElementsByClassName('js-search'));
				var _searchInput = angular.element(document.getElementsByClassName('js-search-input'));
				var _searchInputId = document.getElementById('search');
				var autocomplete = null;
				var place = null;
				var _lat = null;
				var _lon = null;
				var _map = null;
				var _locationMarker = null;
				var _markerGroup = new L.LayerGroup();
				
				/**
				 * [Get map element]
				 * @param  {[type]} map
				 */
				BaseMapService.map.then(function (map) {
					_searchFunction(map);
				});

				/**
				 * [_searchFunction Search Address]
				 * @param  {[type]} map [Map]
				 */
				var _searchFunction = function(map) {
					_map = map;
					autocomplete = new google.maps.places.Autocomplete(_searchInputId);
					google.maps.event.addListener(autocomplete, 'place_changed', _onPlaceChanged);
				};
				
				/**
				 * [_onPlaceChanged Place marker]
				 */
				var _onPlaceChanged = function() {
					_markerGroup.clearLayers();
					place = autocomplete.getPlace();
					_lat = place.geometry.location.lat();
					_lon = place.geometry.location.lng();
					_locationMarker = L.marker([_lat, _lon]);
					_markerGroup.addLayer(_locationMarker);
					_markerGroup.addTo(_map);
					_map.setView([_lat, _lon], 16);
				};

				/**
				 * [Bind event to hide input search]
				 */
				// $window.addEventListener('mouseup', function(e){
				// 	e.preventDefault();
				// 	if (e.target !== _searchButton && e.target.parentNode !== _searchButton) {
				// 		_searchForm.removeClass('is-showed-form');
				// 		_searchInput.removeClass('is-showed-input');

				// 	}
				// });
			}
			// controller: function($scope){
			// }
		};
	}
	
	Search.$inject = ['$window', '$timeout', 'BaseMapService'];

	angular.module('search.directive', [])
		.directive('search', Search);
}());