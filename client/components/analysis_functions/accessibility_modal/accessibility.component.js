(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function accessibilityDirective(BaseMapService, BaseMapFactory){

		var _$js_accessibility_side_panel = null,
		_$js_accessibility_item = null,
		_map = null,
		_editableLayers = null,
		_currentFeature = null,
		_toolDraw = {
			'line':null,
			'polygon':null,
			'circle':null
		};

		var _$contentCount = {
			vehi:undefined,
			trns:undefined
		};

		return {
			restrict: 'E',
			replace: true,
			require: '^analysisFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-analysis-item" data-ep="accessibility" tooltip-placement="right" uib-tooltip="Potencial" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-accessibility"></i>',
					'</li>',
					'<div class="m-side-panel js-accessibility-side-panel" style="height: 400px;">',
						'<h3 class="m-side-panel__title">Accesibilidad</h3>',
						'<span class="accessibility-tools">',
							'<div class="leaflet-draw-toolbar leaflet-bar leaflet-draw-toolbar-top">',
								'<button class="leaflet-draw-draw-polyline" href="#" title="Dibujar Líneas" ng-click="drawInMap($event,\'line\')">',
									'<i class="demo demo-line line-tool"></i>',
								'</button>',
								'<button class="leaflet-draw-draw-polygon" href="#" title="Dibujar Poligono" ng-click="drawInMap($event,\'polygon\')">',
									'<i class="demo demo-area polygon-tool"></i>',
								'</button>',
								'<button class="leaflet-draw-draw-circle" href="#" title="Dibujar Radio"  ng-click="drawInMap($event,\'circle\')">',
									'<i class="demo demo-radio area-tool"></i>',
								'</button>',
							'</div>',
						'</span>',
						'<div>',
						'<p>Vías de acceso vehicular</p>',
						'<div id="access_car_content"></div>',
						'<p>Vías de acceso en transporte</p>',
						'<div id="access_trans_content"></div>',
						'</div>',
					'</div>',
				'</div>'
			].join(''),
			link: function(scope, element, attr, potencialCtrl){

				_$contentCount = {
					vehi : angular.element(document.getElementById('access_car_content')),
					trns : angular.element(document.getElementById('access_trans_content'))
				};

				BaseMapService.map.then(function (map) {
					_map = map;
					_editableLayers = new L.FeatureGroup();
					_map.addLayer(_editableLayers);
					var opst = {
						shapeOptions: {
							color: '#81A1C1'
					}};
					_toolDraw.line = new L.Draw.Polyline(_map);
					_toolDraw.polygon = new L.Draw.Polygon(_map);
					_toolDraw.circle = new L.Draw.Circle(_map);

					_toolDraw.line.setOptions(opst);
					_toolDraw.polygon.setOptions(opst);
					_toolDraw.circle.setOptions(opst);

					_map.on('draw:created', scope.drawComplete);
					_editableLayers.on('layeradd', scope.startAccessibilityAnalysis);

				});

				scope.drawInMap = function($event, tip){
					$event.preventDefault();
					_.each(_toolDraw,function(o){
						if(o.enabled() === true){
							o.disable();
						}
					});
					scope.isDrawAccessibility = true;
					_toolDraw[tip].enable();
				};

				scope.drawComplete = function(e){
					if(scope.isDrawAccessibility){
						scope.isDrawAccessibility = false;
						console.log(e.target);
						_currentFeature = e;
						_editableLayers.clearLayers();
						if(BaseMapFactory.LAYERS.USER.inter15_vias !== undefined){
							BaseMapFactory.LAYERS.USER.inter15_vias.clearLayers();
						}
						_editableLayers.addLayer( _currentFeature.layer );
					}
				};

				scope.startAccessibilityAnalysis = function(e){
					console.log(e);
					console.log(_currentFeature);
					var geo_wkt = BaseMapFactory.geom2wkt(_currentFeature);

					var opts = {
							s:'inegi',
							t: 'inter15_vias',
							c: 'tipovial',
							w:'',
							wkt: geo_wkt.wkt,
							mts: geo_wkt.mts
						};
					BaseMapService.intersect(opts).then(function(res){
						if(res && res.data){
							var info = res.data.info;
							var geojson = res.data.geojson;

							//Count tipo de features
							var tips = _.map(geojson.features,function(o){
								return o.properties;
							});
							var cnts = _.countBy(tips,'tipovial');
							_$contentCount.vehi.html('');
							_.each(cnts,function(v, i){
								_$contentCount.vehi.append('<br/>'+i+':'+v);
							});
							
							BaseMapFactory.addGeoJSON2Map(geojson, 'inter15_vias');
						}
					}, function(error){
						console.log(error);
					});
					_currentFeature = null;
				};

			},
			controller: function($scope) {
			}
		};
	}

	accessibilityDirective.$inject = ['BaseMapService', 'BaseMapFactory'];
	angular.module('accessibility.directive', [])
		.directive('accessibility', accessibilityDirective);
})();
