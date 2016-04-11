(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function MapSwitcher($window,$rootScope){
		// var  _this = null,
		// _google_map = null,
		// _basemap_container = null,
		// _$js_basemap = null,
		// _$js_basemap_container = null,
		// _basemap_options = null,
		// _$js_switcher_options = null,
		// _$js_switcher_options_item = null,
		// _map_type = null;

		// return {
		// 	restrict: 'E',
		// 	templateUrl: './components/basemap/switcher/mapswitcher.tpl.html',
		// 	link: function(scope, element){
		// 		element.on('click', function(e){
		// 			e.isImmediatePropagationStopped();
		// 		_$js_switcher_options = angular.element(document.getElementsByClassName('js-switcher-options'));
		// 		_$js_switcher_options_item = angular.element(document.getElementsByClassName('js-switcher-options-item'));

		// 			_$js_switcher_options.toggleClass('is-switcher-showed');
					
		// 			_mapsSelected(_$js_switcher_options_item);
		// 			//element.unbind('click');
		// 		});
		// 	}
		// };
		
		// function _mapsSelected(option){
		// 	option.on('click', function(e){
		// 		e.isImmediatePropagationStopped();
		// 		_this = this;
		// 		if (_this.getAttribute('data-basemap') === "g-normal") {
		// 			_map_type = google.maps.MapTypeId.ROADMAP;
		// 			_switchToGoogle();
		// 		}
				
		// 		else if (_this.getAttribute('data-basemap') === "g-satelite") {
		// 			_map_type = google.maps.MapTypeId.SATELLITE;
		// 			_switchToGoogle();
		// 		}
				
		// 		else {
		// 			_switchToMapbox();
		// 		}
		// 	});
		// }
		
		// function _switchToGoogle() {

		// 	_basemap_container = document.getElementById('basemap');
		// 	_basemap_options = {
		// 		center: {lat: 19.432711775616433, lng: -99.13325428962708},
		// 		zoom: 12,
		// 		mapTypeId: _map_type,
		// 		mapTypeControl: true,
		// 		mapTypeControlOptions: {
		// 			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		// 			position: google.maps.ControlPosition.TOP_CENTER
		// 		},
		// 		zoomControl: true,
		// 		zoomControlOptions: {
		// 			position: google.maps.ControlPosition.TOP_RIGHT
		// 		},
		// 		scaleControl: true,
		// 		streetViewControl: false
		// 	};

		// 	// _$js_basemap = angular.element(document.getElementsByClassName('js-basemap'));
		// 	// _$js_basemap.attr("data-basemap-type", "google");

		// 	_google_map = new google.maps.Map(_basemap_container, _basemap_options);
		// }

		// function _switchToMapbox() {
		// 	var map = $rootScope.$root.map._container;
		// 	var empty_map = angular.element($rootScope.$root.map._container);
		// 	var existsMap = angular.element(document.getElementById('basemap'));
		// 	console.log(existsMap)
		// 		empty_map.empty();
		// 		map.remove();
		// 		_$js_basemap_container = angular.element(document.getElementsByClassName('js-basemap-container'));
		// 		_$js_basemap_container.append('<div id="basemap" class="m-basemap"></div>');
		// 		map = L.mapbox.map('basemap', 'pokaxperia.pk657nfi').setView([19.432711775616433, -99.13325428962708], 12);

		// 	//empty_map.empty();
		// 	//map.remove();
		// 	//_$js_basemap_container = angular.element(document.getElementsByClassName('js-basemap-container'));
		// 	//_$js_basemap_container.append('<div id="basemap" class="m-basemap"></div>');
		// 	//map = L.mapbox.map('basemap', 'pokaxperia.pk657nfi').setView([19.432711775616433, -99.13325428962708], 12);
		// 	//L.mapbox.accessToken = 'pk.eyJ1IjoicG9rYXhwZXJpYSIsImEiOiJjaW1xd2M5djcwMHBjdnFsdW9laXNwMncwIn0.-YH-fsODXv7uREKNU7Xj4Q';
		// 	//
		// }
		

	}
	

	MapSwitcher.$inject = ['$window','$rootScope'];

	angular.module('mapswitcher.directive', [])
		.directive('mapSwitcher', MapSwitcher);
}());