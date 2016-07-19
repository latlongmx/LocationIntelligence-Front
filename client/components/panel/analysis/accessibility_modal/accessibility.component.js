(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function accessibilityDirective(BaseMapService, BaseMapFactory, Auth, AccessibilityService, $compile){

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
		var _layers = {};

		var _$contentCount = {
			vehi:undefined,
			trns:undefined
		};

		return {
			restrict: 'E',
			replace: true,
			require: '^panelFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-panel-item" data-ep="accessibility" tooltip-placement="right" uib-tooltip="Accesibilidad" tooltip-animation="true">',
						'<img src="./images/functions/accessibility_icon.png" class="m-list-functions__item-icon" data-icon="accessibility_icon"/>',
					'</li>',
					'<div id="accessibilityContent" ng-include src="\'./components/panel/analysis/accessibility_modal/accessibility.component.tpl.html\'"',
					'class="m-side-panel js-accessibility-side-panel" >', //style="height: 400px;"
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

				scope.openViasWMS = function(){
					if(_layers.viasWMS === undefined){
						_layers.viasWMS = L.tileLayer.dynamicWms(
							"http://52.8.211.37/cgi-bin/mapserv?map=/var/www/sites/api.walmex.latlong.mx/api/storage/MAPS/vias.map&", {
								layers: 'VIAS',
								format: 'image/png',
								minZoom: 10,
								transparent: true
						});
						_layers.viasWMS.options.crs = L.CRS.EPSG4326;
						_layers.viasWMS.addTo(_map);
					}else{
						_map.removeLayer(_layers.viasWMS);
						_layers.viasWMS = undefined;
					}

				};

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

						var access_token = Auth.getToken().access_token;
						var geo_wkt = "";
						geo_wkt = BaseMapFactory.geom2wkt(_currentFeature);

						if(_layers.viasUserWMS !== undefined){
							_map.removeLayer( _layers.viasUserWMS );
						}

						_layers.viasUserWMS = L.tileLayer.dynamicWms(
							BaseMapFactory.API_URL+"/ws_wms?access_token="+access_token,
							//"http://52.8.211.37/cgi-bin/mapserv?map=/var/www/sites/api.walmex.latlong.mx/api/storage/MAPS/vias.map&",
							{
								layers: 'VIAS_USR',
								format: 'image/png',
								minZoom: 10,
								transparent: true
						});
						_layers.viasUserWMS.setDynamicParam({
							WKT: function(){
								return geo_wkt.wkt;
							},
							MTS: function(){
								return geo_wkt.mts;
							}
						});
						_layers.viasUserWMS.options.crs = L.CRS.EPSG4326;
						_layers.viasUserWMS.addTo(_map);
						_editableLayers.clearLayers();
						_editableLayers.addLayer( _currentFeature.layer );
					}
				};

				scope.startAccessibilityAnalysis = function(e){
					var geo_wkt = BaseMapFactory.geom2wkt(_currentFeature);
					var listAccessTrans = angular.element('#listAccessTrans');
					listAccessTrans.html('');
					angular.element('#accessNumP').html('0');
					angular.element('#accessNumS').html('0');
					angular.element('#accessNumT').html('0');
					var opts = {
							WKT: geo_wkt.wkt,
							MTS: geo_wkt.mts
						};
					AccessibilityService.viasInfo(opts).then(function(res){
						if(res && res.data){
							var info = res.data.info;

							//Count tipo de features
							var p = 0;
							var s = 0;
							var t = 0;
							var pP = ["Carretera","Autopista","Periférico","Circuito"];
							var pS = ["Avenida","Viaducto","Eje vial","Circunvalación","Boulevard","Calzada"];
							var pT = ["Calle","Continuación","Corredor","Prolongación","Pasaje","Diagonal","Retorno","Andador","Cerrada","Privada","Plaza","Ampliación","Callejón"];
							var noms = [];
							_.each(info,function(o){
								var tipoVial = o.tipovial;
								if(pP.indexOf(tipoVial)!==-1){
									p++;
								}else if(pS.indexOf(tipoVial)!==-1){
									s++;
								}else if(pT.indexOf(tipoVial)!==-1){
									t++;
								}
							});
							_$contentCount.vehi.html('');
							angular.element('#accessNumP').html(p);
							angular.element('#accessNumS').html(s);
							angular.element('#accessNumT').html(t);

							var trans = _.countBy(res.data.transp,'agency_id');
							_.each(trans, function(v,k){
								listAccessTrans.append([
									'<md-list-item>',
						        '<img ng-src=""></img>',
						        '<p>'+k+'</p>',
						        '<p id="accessNumT">'+v+'</p>',
						      '</md-list-item>'
								].join(''));
							});

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

	accessibilityDirective.$inject = ['BaseMapService', 'BaseMapFactory', 'Auth', 'AccessibilityService', '$compile'];
	angular.module('accessibility.directive', [])
		.directive('accessibility', accessibilityDirective);
})();
