(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	var BaseMapController = function($scope, BaseMapService){

		var _this = null,
		_map = null,
		_label = null,
		_label_item = null,
		_ggl = null,
		_mapbox_streets = null,
		_mapbox_relieve = null,
		_mapbox_satellite = null,
		_google_roadmap = null,
		_google_satellite = null,
		_zoom_in = null,
		_zoom_out = null;

		_map = BaseMapService.mapElement;

		_google_roadmap = new L.Google('ROADMAP');
		_google_satellite = new L.Google();
		_mapbox_streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + BaseMapService.accessToken, {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="http://mapbox.com">Mapbox</a>',
					id: BaseMapService.mapId
				});
		_mapbox_relieve = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + BaseMapService.accessToken, {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="http://mapbox.com">Mapbox</a>',
					id: 'caarloshugo1.lnipn7db'
				});
		_mapbox_satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + BaseMapService.accessToken, {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="http://mapbox.com">Mapbox</a>',
					id: 'mapbox.satellite'
				});

		angular.element(document).ready(function(){
			/**
			 * [Add layers to custom control]
			 */
			_map.addControl(new L.Control.Layers( {
				'Mapbox Calles': _mapbox_streets.addTo(_map),
				'Mapbox Relieve': _mapbox_relieve,
				'Mapbox Satellite': _mapbox_satellite,
				'Google Roadmap': _google_roadmap,
				'Google Satellite': _google_satellite
			}, {}, { position: 'bottomright'}));

			/**
			 * [Set image name to each layer]
			 * @type {Array}
			 */
			var imagesArray = ['mapbox-calles', 'mapbox-relieve', 'mapbox-satellite', 'mapbox-satellite', 'mapbox-calles'];
			
			_label_item = angular.element(document.getElementsByClassName('leaflet-control-layers-base')).children();
			_label = angular.element(document.getElementsByClassName('leaflet-control-layers-toggle'));
			_label.text("Mapa Base");

			/**
			 * [Append image function to each layer item]
			 * @param  {[type]} item   [Label control layer item]
			 * @param  {String} index) [Index from each label control layer]
			 */
			angular.forEach(_label_item, function(item, index) {
				angular.element(item).append('<img src="./images/switcher_map/'+imagesArray[index]+'.jpg" width="120"/>');
			});

		});
		
		_zoom_in = angular.element(document.getElementsByClassName('leaflet-control-zoom-in'));
		_zoom_in.text("");
		_zoom_in.append('<i class="demo demo-zoom-in leaflet-zoom-in"></i>')
		
		_zoom_out = angular.element(document.getElementsByClassName('leaflet-control-zoom-out'));
		_zoom_out.text("");
		_zoom_out.append('<i class="demo demo-zoom-out leaflet-zoom-out"></i>')
	};
	
	BaseMapController.$inject = ['$scope', 'BaseMapService'];
	
	angular.module('basemap', []).
	controller('BaseMapController', BaseMapController);

}());
