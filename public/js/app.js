(function(){

	'use strict';

	angular.module('walmex',[
			'basemap',
			'basemap.service',
			'routes',
			'mapswitcher.directive',
			'maptools',
			'menu.directive',
			'exploration.directive',
			'location.modal.controller',
			'competence.modal.controller',
			'demography.modal.controller',
			'potential.modal.controller',
			'analysis.directive',
			'accessibility.modal.controller',
			'heatmap.modal.controller',
			'od.modal.controller',
			'rings.modal.controller',
			'historical.directive',
			'search.directive',
			'ui.router',
			'ui.bootstrap'
		]
	)
	.run(["$rootScope", "$state", "$stateParams", function ($rootScope, $state, $stateParams) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

		L.drawLocal.draw.toolbar.actions.text = "Cancelar";
		L.drawLocal.draw.toolbar.actions.title = "Cancelar Dibujo";
		L.drawLocal.draw.toolbar.finish.text = "Terminar";
		L.drawLocal.draw.toolbar.finish.title = "Terminar Dibujo";
		L.drawLocal.draw.toolbar.buttons.polyline = "Dibujar Líneas";
		L.drawLocal.draw.toolbar.buttons.polygon = "Dibujar Poligono";
		L.drawLocal.draw.toolbar.buttons.circle = "Dibujar Radio";
		L.drawLocal.draw.toolbar.undo.text = "Borrar último punto";
		L.drawLocal.draw.toolbar.undo.title = "Borrar el último punto dibujado";
		L.drawLocal.draw.handlers.polyline.tooltip.start = "Click para empezar a trazar líneas";
		L.drawLocal.draw.handlers.polyline.tooltip.cont = "Click para continuar trazando líneas";
		L.drawLocal.draw.handlers.polyline.tooltip.end = "Click en el último punto para temrinar";
		L.drawLocal.draw.handlers.polygon.tooltip.start = "Click para empezar a dibujar un polígono";
		L.drawLocal.draw.handlers.polygon.tooltip.cont = "Click para continuar dibujando el polígono";
		L.drawLocal.draw.handlers.polygon.tooltip.end = "Click en el primer punto para cerrar el polígono";
		L.drawLocal.draw.handlers.circle.radius = "Radio";
		L.drawLocal.draw.handlers.circle.tooltip.start = "Click y arrastrar para dibujar un radio";
		L.drawLocal.draw.handlers.simpleshape.tooltip.end = "Suelte el ratón para completar el radio";
		
		L.drawLocal.edit.handlers.edit.tooltip.subtext = "click en Cancelar para deshacer los cambios";
		L.drawLocal.edit.handlers.edit.tooltip.text = "Control de arrastre, o marcador para editar dibujo";
		L.drawLocal.edit.handlers.remove.tooltip.text = "Click en un dibujo para eliminar";
		
		L.drawLocal.edit.toolbar.actions.cancel.text = "Cancelar";
		L.drawLocal.edit.toolbar.actions.cancel.title = "Cancelar editar, deshacer todos los cambios";
		L.drawLocal.edit.toolbar.actions.save.text = "Guardar";
		L.drawLocal.edit.toolbar.actions.save.title = "Guardar cambios";
		
		L.drawLocal.edit.toolbar.buttons.edit = "Editar dibujo";
		L.drawLocal.edit.toolbar.buttons.editDisabled = "No hay dibujos para editar";
		L.drawLocal.edit.toolbar.buttons.remove = "Eliminar dibujos";
		L.drawLocal.edit.toolbar.buttons.removeDisabled = "No hay dibujos para eliminar";
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

	function AnalysisFunctions($uibModal){
		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<li class="m-list-functions__item js-analysis-item" data-af="accessibility" tooltip-placement="right" uib-tooltip="Accessibilidad" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-accessibility1"></i>',
					'</li>',
					'<li class="m-list-functions__item js-analysis-item" data-af="od" tooltip-placement="right" uib-tooltip="Origen Destino" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-origin-destiny"></i>',
					'</li>',
					'<li class="m-list-functions__item js-analysis-item" data-af="heatmap" tooltip-placement="right" uib-tooltip="Mapa de Calor" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-heatmap"></i>',
					'</li>',
					'<li class="m-list-functions__item js-analysis-item" data-af="rings" tooltip-placement="right" uib-tooltip="Rangos de alcance" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-rings"></i>',
					'</li>',
				'</ul>',
			].join(''),
			controller: function($scope){
				var _$js_analysis_item = angular.element(document.getElementsByClassName('js-analysis-item'));
				var _data_af = null;
				_$js_analysis_item.on('click', function(e){
					e.preventDefault();
					$scope.analysisId = this.getAttribute('data-af');
					_data_af = this.getAttribute('data-af');
					$uibModal.open({
						controller: _data_af+'ModalController',
						templateUrl: './components/analysis_functions/'+_data_af+'_modal/'+_data_af+'.tpl.html',
						animation: true,
						resolve: {
							analysisId: function () {
								return $scope.analysisId;
							}
						}
					});
				});
				
			}
		};
	}
	
	AnalysisFunctions.$inject = ['$uibModal'];

	angular.module('analysis.directive', [])
		.directive('analysisFunctions', AnalysisFunctions);
}());
(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function explorationFunctions($uibModal){

		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<li class="m-list-functions__item js-exploration-item" data-ep="location" tooltip-placement="right" uib-tooltip="Mis ubicaciones" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-locations"></i>',
					'</li>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="competence" tooltip-placement="right" uib-tooltip="Competencia" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-competence"></i>',
					'</li>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="demography" tooltip-placement="right" uib-tooltip="Demografía" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-demography"></i>',
					'</li>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="potential" tooltip-placement="right" uib-tooltip="Potencial de ubicación" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-potencial-location"></i>',
					'</li>',
				'</ul>',
			].join(''),
			controller: function($scope){
				var _$js_exploration_item = angular.element(document.getElementsByClassName('js-exploration-item'));
				var _data_ep = null;
				_$js_exploration_item.on('click', function(e){
					e.preventDefault();
					$scope.epId = this.getAttribute('data-ep');
					_data_ep = this.getAttribute('data-ep');
					$uibModal.open({
						controller: _data_ep+'ModalController',
						templateUrl: './components/exploration_functions/'+_data_ep+'_modal/'+_data_ep+'.tpl.html',
						animation: true,
						resolve: {
							epId: function () {
								return $scope.epId;
							}
						}
					});
				});
				
			}
		};
	}
	
	explorationFunctions.$inject = ['$uibModal'];

	angular.module('exploration.directive', [])
		.directive('explorationFunctions', explorationFunctions);
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
					'<li class="m-list-functions__item" tooltip-placement="right" uib-tooltip="Históricos" tooltip-animation="true">',
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
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function MenuController($window){
		return {
			restrict: 'E',
			template: [
				'<div class="m-burger-menu js-menu-button" data-module="burger-menu">',
					'<div data-container="line">',
						'<div data-line="top"></div>',
						'<div data-line="middle"></div>',
						'<div data-line="bottom"></div>',
					'</div>',
				'</div>',
				'<ul class="m-list-navigation js-list-navigation">',
					'<li class="m-list-navigation__item js-menu-item"><a>Menu 1</a></li>',
					'<li class="m-list-navigation__item js-menu-item"><a>Menu 2</a></li>',
					'<li class="m-list-navigation__item js-menu-item"><a>Menu 3</a></li>',
				'</ul>',
			].join(''),
			controller: function(){
				var _$js_menu_button = angular.element(document.getElementsByClassName('js-menu-button'));
				var _$js_list_navigation = angular.element(document.getElementsByClassName('js-list-navigation'));
				
				
				
				_$js_menu_button.on('click', function(e){
					e.preventDefault();
					angular.element(this).toggleClass('is-menu-active')
					_$js_list_navigation.toggleClass('is-menu-opened');
					return false;
				});
				
				// $window.addEventListener('mouseup', function(e){
				// 	e.preventDefault();
				// 	// if (_$js_menu_button.hasClass('is-menu-active')) {
				// 	// 	_$js_menu_button.removeClass('is-menu-active');
				// 	// 	_$js_list_navigation.removeClass('is-menu-opened');
				// 	// }
				// 	// console.log(e);
				// 	console.log(_$js_list_navigation.find(_$js_list_navigation))
				// 	// if (e.target !== _$js_list_navigation && _$js_list_navigation.eq(e.target).length === 0 && e.target !== _$js_menu_button) {
				// 	// 	_$js_menu_button.removeClass('is-menu-active')
				// 	// 	_$js_list_navigation.removeClass('is-menu-opened');
				// 	// }
				// });
			}
		};
	}
	
	MenuController.$inject = ['$window'];

	angular.module('menu.directive', [])
		.directive('menu', MenuController);
}());
(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function Search($window, $timeout){
		return {
			restrict: 'E',
			template: [
				'<div class="m-search js-search-form">',
					'<input class="m-search__input js-search-input" type="text" ng-model="search" placeholder="buscar"/>',
					'<i class="demo demo-search m-search__icon js-search"></i>',
				'</div>'
			].join(''),
			controller: function($scope){
				var searchForm = angular.element(document.getElementsByClassName('js-search-form'));
				var searchButton = angular.element(document.getElementsByClassName('js-search'));
				var searchInput = angular.element(document.getElementsByClassName('js-search-input'));
				
				/**
				 * [Click to show input search]
				 */
				searchForm.on('click', function(){
					$timeout(function(){
						$scope.search = "";
					}, 0);
					searchForm.addClass('is-showed-form');
					searchInput.addClass('is-showed-input');
				});
				
				/**
				 * [Bind event to hide input search]
				 */
				$window.addEventListener('mouseup', function(e){
					e.preventDefault();
					if (e.target !== searchButton && e.target.parentNode !== searchButton) {
						searchForm.removeClass('is-showed-form');
						searchInput.removeClass('is-showed-input');

					}
				});
			}
			// controller: function($scope){
			// }
		};
	}
	
	Search.$inject = ['$window', '$timeout'];

	angular.module('search.directive', [])
		.directive('search', Search);
}());
(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var accessibilityModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

		var _this = null;
		init();

		function init(){
			console.log("modal")
		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	accessibilityModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('accessibility.modal.controller', [])
		.controller('accessibilityModalController', accessibilityModalController);

}());
(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var heatmapModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

		var _this = null;
		init();

		function init(){
			console.log("modal")
		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	heatmapModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('heatmap.modal.controller', [])
		.controller('heatmapModalController', heatmapModalController);

}());
(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var odModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

		var _this = null;
		init();

		function init(){
			console.log("modal")
		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	odModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('od.modal.controller', [])
		.controller('odModalController', odModalController);

}());
(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var ringsModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

		var _this = null;
		init();

		function init(){
			console.log("modal")
		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	ringsModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('rings.modal.controller', [])
		.controller('ringsModalController', ringsModalController);

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
		_google_satellite = null,
		_zoom_in = null,
		_zoom_out = null,
		_line_tool = null,
		_polygon_tool = null,
		_area_tool = null,
		_actions_tool = null,
		_edit_tool = null,
		_delete_tool = null,
		_drawControl = null,
		_drawType = null,
		_featureGroup = null,
		_colorLine = null;

		_map = BaseMapService.mapElement;
		_featureGroup = L.featureGroup().addTo(_map);

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
		
		// _map.on('baselayerchange', function(e){
		// 	console.log(e)
		// 	if(e.name === "Google Roadmap"){
		// 		_drawControl.setDrawingOptions({
		// 		    polyline: {
		// 		        shapeOptions: {
		// 		            color: '#000000'
		// 		        }
		// 		    }
		// 		});
		// 	}
		// });
		_drawControl = new L.Control.Draw({
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
				featureGroup: _featureGroup,
				selectedPathOptions: {
		        maintainColor: true
		    }
			}
		}).addTo(_map);


		
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
		
		

		
		_map.on('draw:created', function (e) {
				_drawType = e.layerType;
				
				//     layer = e.layer;
				// Do whatever else you need to. (save to db, add to map etc)
				_featureGroup.addLayer(e.layer);
		});
		
				
		_zoom_in = angular.element(document.getElementsByClassName('leaflet-control-zoom-in'));
		_zoom_in.text("");
		_zoom_in.append('<i class="demo demo-zoom-in leaflet-zoom-in"></i>');
		
		_zoom_out = angular.element(document.getElementsByClassName('leaflet-control-zoom-out'));
		_zoom_out.text("");
		_zoom_out.append('<i class="demo demo-zoom-out leaflet-zoom-out"></i>');
		
		_line_tool = angular.element(document.getElementsByClassName('leaflet-draw-draw-polyline'));
		_line_tool.text("");
		_line_tool.append('<i class="demo demo-line line-tool"></i>');
		
		_polygon_tool = angular.element(document.getElementsByClassName('leaflet-draw-draw-polygon'));
		_polygon_tool.text("");
		_polygon_tool.append('<i class="demo demo-area polygon-tool"></i>');
		
		_area_tool = angular.element(document.getElementsByClassName('leaflet-draw-draw-circle'));
		_area_tool.text("");
		_area_tool.append('<i class="demo demo-radio area-tool"></i>');
		
		_actions_tool = angular.element(document.getElementsByClassName('leaflet-draw-actions'));
		_actions_tool.text("");
		_actions_tool.css({
			display: "block",
			left: "0px",
			top: "40px"
		});
		
		_edit_tool = angular.element(document.getElementsByClassName('leaflet-draw-edit-edit'));
		_edit_tool.text("");
		_edit_tool.append('<i class="demo demo-edit edit-tool"></i>');
		
		_delete_tool = angular.element(document.getElementsByClassName('leaflet-draw-edit-remove'));
		_delete_tool.text("");
		_delete_tool.append('<i class="demo demo-delete delete-tool"></i>');

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
(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var competenceModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

		var _this = null;
		init();

		function init(){
			console.log("modal")
		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	competenceModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('competence.modal.controller', [])
		.controller('competenceModalController', competenceModalController);

}());
(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var demographyModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

		var _this = null;
		init();

		function init(){
			console.log("modal")
		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	demographyModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('demography.modal.controller', [])
		.controller('demographyModalController', demographyModalController);

}());
(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var locationModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

		var _this = null;
		init();

		function init(){
			console.log("modal")
		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	locationModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('location.modal.controller', [])
		.controller('locationModalController', locationModalController);

}());
(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var potentialModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope){

		var _this = null;
		init();

		function init(){
			console.log("modal")
		}

		$scope.ok = function(){
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.close('cancel');
		};
	};

	potentialModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope'];

	angular.module('potential.modal.controller', [])
		.controller('potentialModalController', potentialModalController);

}());
angular.module("walmex").run(["$templateCache", function($templateCache) {$templateCache.put("./components/analysis_functions/accessibility_modal/accessibility.tpl.html","<div class=modal-header><h3 class=modal-title>I\'m a modal!</h3></div><div class=modal-body><h3>{{analysisId}}</h3></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=ok()>OK</button> <button class=\"btn btn-warning\" type=button ng-click=cancel()>Cancel</button></div>");
$templateCache.put("./components/analysis_functions/heatmap_modal/heatmap.tpl.html","<div class=modal-header><h3 class=modal-title>I\'m a modal!</h3></div><div class=modal-body><h3>{{analysisId}}</h3></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=ok()>OK</button> <button class=\"btn btn-warning\" type=button ng-click=cancel()>Cancel</button></div>");
$templateCache.put("./components/analysis_functions/od_modal/od.tpl.html","<div class=modal-header><h3 class=modal-title>I\'m a modal!</h3></div><div class=modal-body><h3>{{analysisId}}</h3></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=ok()>OK</button> <button class=\"btn btn-warning\" type=button ng-click=cancel()>Cancel</button></div>");
$templateCache.put("./components/analysis_functions/rings_modal/rings.tpl.html","<div class=modal-header><h3 class=modal-title>I\'m a modal!</h3></div><div class=modal-body><h3>{{analysisId}}</h3></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=ok()>OK</button> <button class=\"btn btn-warning\" type=button ng-click=cancel()>Cancel</button></div>");
$templateCache.put("./components/basemap/basemap/basemap.component.html","<div id=basemap class=m-basemap></div>");
$templateCache.put("./components/basemap/switcher/mapswitcher.tpl.html","<div class=m-switcher><button class=m-switcher__button>Mapa Base</button><div class=m-switcher__base></div><ul class=\"m-switcher__options-list js-switcher-options\"><li class=m-switcher__options-list__item><span class=js-switcher-options-item data-map-id=mbx data-basemap=mapbox>Mapbox</span></li><li class=m-switcher__options-list__item><span class=js-switcher-options-item data-map-id=gg data-basemap=g-satelite>Google Satélite</span></li><li class=m-switcher__options-list__item><span class=js-switcher-options-item data-map-id=gg data-basemap=g-normal>Google RoadMap</span></li></ul></div>");
$templateCache.put("./components/exploration_functions/competence_modal/competence.tpl.html","<div class=modal-header><h3 class=modal-title>I\'m a modal!</h3></div><div class=modal-body><h3>{{epId}}</h3></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=ok()>OK</button> <button class=\"btn btn-warning\" type=button ng-click=cancel()>Cancel</button></div>");
$templateCache.put("./components/exploration_functions/demography_modal/demography.tpl.html","<div class=modal-header><h3 class=modal-title>I\'m a modal!</h3></div><div class=modal-body><h3>{{epId}}</h3></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=ok()>OK</button> <button class=\"btn btn-warning\" type=button ng-click=cancel()>Cancel</button></div>");
$templateCache.put("./components/exploration_functions/location_modal/location.tpl.html","<div class=modal-header><h3 class=modal-title>I\'m a modal!</h3></div><div class=modal-body><h3>{{epId}}</h3></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=ok()>OK</button> <button class=\"btn btn-warning\" type=button ng-click=cancel()>Cancel</button></div>");
$templateCache.put("./components/exploration_functions/potential_modal/potential.tpl.html","<div class=modal-header><h3 class=modal-title>I\'m a modal!</h3></div><div class=modal-body><h3>{{epId}}</h3></div><div class=modal-footer><button class=\"btn btn-primary\" type=button ng-click=ok()>OK</button> <button class=\"btn btn-warning\" type=button ng-click=cancel()>Cancel</button></div>");}]);