(function(){

	'use strict';

	angular.module('walmex',[
			'basemap',
			'basemap.service',
			'routes',
			'mapswitcher.directive',
			'maptools',
			'exploration.directive',
			'analysis.directive',
			'historical.directive',
			'ui.router'
		]
	)
	.run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {

		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		return $rootScope;

	}]);

}());
(function(){
	'use strict';
	
	angular.module('routes', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('root', {
				url: '/',
				templateUrl: './components/basemap/basemap/basemap.component.html',
				controller: 'BaseMapController'
			});
	}]);

}());
(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function AnalysisFunctions(){
		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-accessibility1"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-origin-destiny"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-heatmap"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-rings"></i>',
					'</li>',
				'</ul>',
			].join('')
		};
	}
	
	//AnalysisFunctions.$inject = [];

	angular.module('analysis.directive', [])
		.directive('analysisFunctions', AnalysisFunctions);
}());
(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function ExplorationFunctions(){
		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-locations"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-competence"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-demography"></i>',
					'</li>',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-potencial-location"></i>',
					'</li>',
				'</ul>',
			].join('')
		};
	}
	
	//ExplorationFunctions.$inject = [];

	angular.module('exploration.directive', [])
		.directive('explorationFunctions', ExplorationFunctions);
}());
(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function HistoricalFunctions(){
		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<li class="m-list-functions__item">',
						'<i class="m-list-functions__item-icon demo demo-historic"></i>',
					'</li>',
				'</ul>',
			].join('')
		};
	}
	
	//HistoricalFunctions.$inject = [];

	angular.module('historical.directive', [])
		.directive('historicalFunctions', HistoricalFunctions);
}());
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
		_google_satellite = null;

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
		
		// var ourCustomControl = L.Control.extend({

		// 	options: {
		// 		position: 'topleft' 
		// 		//control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
		// 	},

		// 	onAdd: function (map) {
		// 		var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

		// 		container.style.backgroundColor = 'white';
		// 		container.style.width = '30px';
		// 		container.style.height = '30px';

		// 		container.onclick = function(){
		// 		 console.log('buttonClicked');
		// 		}
				
		// 		return container;
		// 	},

		// });
		// _map.addControl(new ourCustomControl());
		// $scope.callback = function (map) {
		// 	map.setView([19.432711775616433, -99.13325428962708], 12);
		// }
	};
	
	BaseMapController.$inject = ['$scope', 'BaseMapService'];
	
	angular.module('basemap', []).
	controller('BaseMapController', BaseMapController);

}());

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
(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	angular.module('basemap.service', []).
	service('BaseMapService', function(){
		this.mapId = 'pokaxperia.pk657nfi';
		this.accessToken = 'pk.eyJ1IjoicG9rYXhwZXJpYSIsImEiOiJjaW13eHJ2NHMwM2Uwdjdra3c1bWF3Nzd6In0.leOLCkHazd_6JAQtdiHOFw';
		this.mapElement = L.map('basemap').setView([19.432711775616433, -99.13325428962708], 12);
		
		var featureGroup = L.featureGroup().addTo(this.mapElement);
		var drawControl = new L.Control.Draw({
		    edit: {
		      featureGroup: featureGroup
		    }
		  }).addTo(this.mapElement);
	});


}());

/*
 * Google layer using Google Maps API
 */

/* global google: true */

L.Google = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		minZoom: 0,
		maxZoom: 18,
		tileSize: 256,
		subdomains: 'abc',
		errorTileUrl: '',
		attribution: '',
		opacity: 1,
		continuousWorld: false,
		noWrap: false,
		mapOptions: {
			backgroundColor: '#dddddd'
		}
	},

	// Possible types: SATELLITE, ROADMAP, HYBRID, TERRAIN
	initialize: function(type, options) {
		L.Util.setOptions(this, options);

		this._ready = google.maps.Map !== undefined;
		if (!this._ready) L.Google.asyncWait.push(this);

		this._type = type || 'SATELLITE';
	},

	onAdd: function(map, insertAtTheBottom) {
		this._map = map;
		this._insertAtTheBottom = insertAtTheBottom;

		// create a container div for tiles
		this._initContainer();
		this._initMapObject();

		// set up events
		map.on('viewreset', this._resetCallback, this);

		this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
		map.on('move', this._update, this);

		map.on('zoomanim', this._handleZoomAnim, this);

		//20px instead of 1em to avoid a slight overlap with google's attribution
		map._controlCorners.bottomright.style.marginBottom = '20px';

		this._reset();
		this._update();
	},

	onRemove: function(map) {
		map._container.removeChild(this._container);

		map.off('viewreset', this._resetCallback, this);

		map.off('move', this._update, this);

		map.off('zoomanim', this._handleZoomAnim, this);

		map._controlCorners.bottomright.style.marginBottom = '0em';
	},

	getAttribution: function() {
		return this.options.attribution;
	},

	setOpacity: function(opacity) {
		this.options.opacity = opacity;
		if (opacity < 1) {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	setElementSize: function(e, size) {
		e.style.width = size.x + 'px';
		e.style.height = size.y + 'px';
	},

	_initContainer: function() {
		var tilePane = this._map._container,
			first = tilePane.firstChild;

		if (!this._container) {
			this._container = L.DomUtil.create('div', 'leaflet-google-layer leaflet-top leaflet-left');
			this._container.id = '_GMapContainer_' + L.Util.stamp(this);
			this._container.style.zIndex = 'auto';
		}

		tilePane.insertBefore(this._container, first);

		this.setOpacity(this.options.opacity);
		this.setElementSize(this._container, this._map.getSize());
	},

	_initMapObject: function() {
		if (!this._ready) return;
		this._google_center = new google.maps.LatLng(0, 0);
		var map = new google.maps.Map(this._container, {
			center: this._google_center,
			zoom: 0,
			tilt: 0,
			mapTypeId: google.maps.MapTypeId[this._type],
			disableDefaultUI: true,
			keyboardShortcuts: false,
			draggable: false,
			disableDoubleClickZoom: true,
			scrollwheel: false,
			streetViewControl: false,
			styles: this.options.mapOptions.styles,
			backgroundColor: this.options.mapOptions.backgroundColor
		});

		var _this = this;
		this._reposition = google.maps.event.addListenerOnce(map, 'center_changed',
			function() { _this.onReposition(); });
		this._google = map;

		google.maps.event.addListenerOnce(map, 'idle',
			function() { _this._checkZoomLevels(); });
		//Reporting that map-object was initialized.
		this.fire('MapObjectInitialized', { mapObject: map });
	},

	_checkZoomLevels: function() {
		//setting the zoom level on the Google map may result in a different zoom level than the one requested
		//(it won't go beyond the level for which they have data).
		// verify and make sure the zoom levels on both Leaflet and Google maps are consistent
		if (this._google.getZoom() !== this._map.getZoom()) {
			//zoom levels are out of sync. Set the leaflet zoom level to match the google one
			this._map.setZoom( this._google.getZoom() );
		}
	},

	_resetCallback: function(e) {
		this._reset(e.hard);
	},

	_reset: function(clearOldContainer) {
		this._initContainer();
	},

	_update: function(e) {
		if (!this._google) return;
		this._resize();

		var center = this._map.getCenter();
		var _center = new google.maps.LatLng(center.lat, center.lng);

		this._google.setCenter(_center);
		this._google.setZoom(Math.round(this._map.getZoom()));

		this._checkZoomLevels();
	},

	_resize: function() {
		var size = this._map.getSize();
		if (this._container.style.width === size.x &&
				this._container.style.height === size.y)
			return;
		this.setElementSize(this._container, size);
		this.onReposition();
	},


	_handleZoomAnim: function (e) {
		var center = e.center;
		var _center = new google.maps.LatLng(center.lat, center.lng);

		this._google.setCenter(_center);
		this._google.setZoom(Math.round(e.zoom));
	},


	onReposition: function() {
		if (!this._google) return;
		google.maps.event.trigger(this._google, 'resize');
	}
});

L.Google.asyncWait = [];
L.Google.asyncInitialize = function() {
	var i;
	for (i = 0; i < L.Google.asyncWait.length; i++) {
		var o = L.Google.asyncWait[i];
		o._ready = true;
		if (o._container) {
			o._initMapObject();
			o._update();
		}
	}
	L.Google.asyncWait = [];
};
(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	var MapToolsContainer = function(){
		var _this = null,
		_$js_maptools_item = null,
		_js_maptools_item_attribute = null;
		
		function _maptoolsItem() {
			_js_maptools_item_attribute = this.getAttribute('data-maptool');
			
			if(_js_maptools_item_attribute === "line") {
				_drawLine();
			}
			
			if(_js_maptools_item_attribute === "area") {
				_drawArea();
			}
			
			if(_js_maptools_item_attribute === "radio") {
				_drawRadio();
			}
		}
		
		function _drawLine() {
			//var map = L.map('basemap');
			map.on('draw:created', function (e) {
			    var type = e.layerType,
			        layer = e.layer;

			    if (type === 'marker') {
			        // Do marker specific actions
			    }

			    // Do whatever else you need to. (save to db, add to map etc)
			    map.addLayer(layer);
			});
		}
		
		function _drawArea() {
			console.log("area")
		}
		
		function _drawRadio() {
			console.log("radio")
		}
		
		return {
			restrict: 'E',
			template: '<div class="m-map-tools"><ul class="m-list m-list-maptools"><li class="m-list__item m-list-maptools__item js-maptools-item" data-maptool="line">Línea</li><li class="m-list__item m-list-maptools__item js-maptools-item" data-maptool="area">Área</li><li class="m-list__item m-list-maptools__item js-maptools-item" data-maptool="radio">Radio</li></ul></div>',
			controller: function() {
				_$js_maptools_item = angular.element(document.getElementsByClassName('js-maptools-item'));
				_$js_maptools_item.bind('click', _maptoolsItem);
			}
		};
		
	};
	
	//MapToolsContainer.$inject = ['BaseMapService'];

	angular.module('maptools', [])
		.directive('mapTools', MapToolsContainer);

}());

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
angular.module("walmex").run(["$templateCache", function($templateCache) {$templateCache.put("./components/basemap/basemap/basemap.component.html","<div id=basemap class=m-basemap></div>");
$templateCache.put("./components/basemap/switcher/mapswitcher.tpl.html","<div class=m-switcher><button class=m-switcher__button>Mapa Base</button><div class=m-switcher__base></div><ul class=\"m-switcher__options-list js-switcher-options\"><li class=m-switcher__options-list__item><span class=js-switcher-options-item data-map-id=mbx data-basemap=mapbox>Mapbox</span></li><li class=m-switcher__options-list__item><span class=js-switcher-options-item data-map-id=gg data-basemap=g-satelite>Google Satélite</span></li><li class=m-switcher__options-list__item><span class=js-switcher-options-item data-map-id=gg data-basemap=g-normal>Google RoadMap</span></li></ul></div>");}]);