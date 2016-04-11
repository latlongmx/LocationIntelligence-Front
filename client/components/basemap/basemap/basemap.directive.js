(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function BaseMap($rootScope, $timeout){
		// var  _this = null,
		// _label = null,
		// _label_item = null,
		// _ggl = null,
		// _google_roadmap = null,
		// _google_satellite = null;

		// _google_roadmap = new L.Google('ROADMAP');
		// _google_satellite = new L.Google();

		// return {
		// 	restrict: 'E',
		// 	scope: {
		// 		callback: '='
		// 	},
		// 	template: '<div id="basemap" class="m-basemap"></div>',
		// 	controller:['$scope', function(scope, element){
		// 		L.mapbox.accessToken = 'pk.eyJ1IjoicG9rYXhwZXJpYSIsImEiOiJjaW1yd21hZ2owMTkydXdtNGxxeGMweGZkIn0.SftIiLD3MaCzLKMZsKau9g';
		// 		var map = L.mapbox.map('basemap');
		// 		scope.callback(map);

		// 		angular.element(document).ready(function(){

		// 			map.addControl(new L.Control.Layers( {
		// 				'Mapbox Calles': L.mapbox.tileLayer('pokaxperia.pk657nfi').addTo(map),
		// 				'Mapbox Relieve': L.mapbox.tileLayer('caarloshugo1.lnipn7db'),
		// 				'Mapbox Satellite': L.mapbox.tileLayer('mapbox.satellite'),
		// 				'Google Roadmap': _google_roadmap,
		// 				'Google Satellite': _google_satellite
		// 			}, {}, { position: 'bottomright'}));
					
		// 			var imagesArray = ['mapbox-calles', 'mapbox-relieve', 'mapbox-satellite', 'mapbox-satellite', 'mapbox-calles'];
		// 			_label_item = angular.element(document.getElementsByClassName('leaflet-control-layers-base')).children();
		// 			_label = angular.element(document.getElementsByClassName('leaflet-control-layers-toggle'));
		// 			_label.text("Mapa Base");
					
		// 			angular.forEach(_label_item, function(item, index) {
		// 				angular.element(item).append('<img src="./images/switcher_map/'+imagesArray[index]+'.jpg" width="120"/>');
		// 			});

		// 		});

		// 	}]
			
		// };

	}
	
	BaseMap.$inject = ['$rootScope', '$timeout'];

	angular.module('basemap.directive', [])
		.directive('basemap', BaseMap);
}());