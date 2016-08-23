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
					'<input class="m-search__input js-search-input" id="search" type="text" ng-model="search_address" placeholder="buscar" map="map" ng-change="isSearching()"/>',
					'<i class="fa fa-search m-search__icon js-search"></i>',
				'</div>'
			].join(''),
			scope: {
				id: '=map'
			},
			controller: function($scope){
				var _searchForm = angular.element(document.getElementsByClassName('js-search-form'));
				var _searchIcon = angular.element(document.getElementsByClassName('js-search'));
				var _searchInput = angular.element(document.getElementsByClassName('js-search-input'));
				var _searchInputId = document.getElementById('search');
				var autocomplete = null;
				var place = null;
				var _lat = null;
				var _lon = null;
				var _map = null;
				var _locationMarker = null;
				var _markerGroup = new L.LayerGroup();
				
				_map = BaseMapService.map_layer();
				/**
				 * [Get map element]
				 * @param  {[type]} map
				 */
				// BaseMapService.map.then(function (map) {
				// 	_searchFunction(map);
				// });

				/**
				 * [_searchFunction Search Address]
				 * @param  {[type]} map [Map]
				 */
				//var _searchFunction = function(map) {
					autocomplete = new google.maps.places.Autocomplete(_searchInputId);
					google.maps.event.addListener(autocomplete, 'place_changed', _onPlaceChanged);

					$scope.isSearching = function(){
						this.search_address ? _searchingMethods(): _searchIcon.removeClass('fa-times').addClass('fa-search');
					}
				//};

				/**
				 * [_searchingMethods Function to clean input]
				 */
				function _searchingMethods(){
					_searchIcon.removeClass('fa-search').addClass('fa-times');
					_searchIcon.bind('click', function(){
						_searchInput[0].value = "";
						_searchIcon.removeClass('fa-times').addClass('fa-search');
						_markerGroup.clearLayers();
					});
				}

				/**
				 * [_onPlaceChanged Place marker]
				 */
				function _onPlaceChanged() {
					_markerGroup.clearLayers();
					place = autocomplete.getPlace();
					_lat = place.geometry.location.lat();
					_lon = place.geometry.location.lng();
					_locationMarker = L.marker([_lat, _lon]);
					_markerGroup.addLayer(_locationMarker);
					_markerGroup.addTo(_map);
					_map.setView([_lat, _lon], 16);
				};

			}
		};
	}
	
	Search.$inject = ['$window', '$timeout', 'BaseMapService'];

	angular.module('search.directive', [])
		.directive('search', Search);
})();