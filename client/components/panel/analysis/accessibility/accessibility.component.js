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
					'<div class="m-side-panel js-accessibility-side-panel">',
					'<h3 class="m-side-panel__title">Métricas Accesibilidad</h3>',
					'<span class="accessibility-tools">',
						'<section layout="row" layout-align="center center">',
							'<label class="groupX left">Crear un área:</label>',
							//'<md-button class="groupX left leaflet-draw-draw-polyline" title="Dibujar Líneas" ng-click="drawInMap($event,\'line\')">',
							//	'<i class="demo demo-line line-tool"></i>',
							//'</md-button>',
							'<md-button class="groupX middle leaflet-draw-draw-polygon" title="Dibujar Poligono" ng-click="drawInMap($event,\'polygon\')">',
								'<i class="demo demo-area polygon-tool"></i>',
							'</md-button>',
							'<md-button class="groupX right leaflet-draw-draw-circle" title="Dibujar Radio" ng-click="drawInMap($event,\'circle\')">',
								'<i class="demo demo-radio area-tool"></i>',
							'</md-button>',
						'</section>',
					'</span>',
					'<div>',
						'<div id="access_car_content">',
							'<div class="m-side-panel__header">',
								'<h4 class="m-side-panel__subtitle m-side-panel__subtitle--in-location-list">',
									'Vías de acceso vehicular',
								'</h4>',
							'</div>',
							'<md-list>',
								'<md-list-item>',
									'<img ng-src="images/accessibility/highway.png"></img>',
									'<p>Primarias</p>',
									'<p id="accessNumP">0</p>',
								'</md-list-item>',
								'<md-list-item>',
									'<img ng-src="images/accessibility/road-with-broken-line.png"></img>',
									'<p>Secundarias</p>',
									'<p id="accessNumS">0</p>',
								'</md-list-item>',
								'<md-list-item>',
									'<img ng-src="images/accessibility/speedometer.png"></img>',
									'<p>Terciarias</p>',
									'<p id="accessNumT">0</p>',
								'</md-list-item>',
							'</md-list>',
							'<div class="m-side-panel__header" id="contAccesTrans" style="display:none">',
								'<h4 class="m-side-panel__subtitle m-side-panel__subtitle--in-location-list">',
									'Vías de acceso en transporte',
								'</h4>',
							'</div>',
							'<md-list id="listAccessTrans">',
							'</md-list>',
						'</div>',
						'<p></p>',
						'<div id="access_trans_content"></div>',

						'<div class="divider"></div>',
						'<h4 class="m-side-panel__title">Datos de transporte público</h4>',
						'<div class="m-side-panel__header">',
							'<h4 class="m-side-panel__subtitle m-side-panel__subtitle--in-location-list">',
								'Transporte público',
							'</h4>',
						'</div>',
						'<md-list id="viasListWMS">',
							'<md-list-item>',
								'<md-button class="btnTransWMS" ng-click="vialToggleWMS($event)" data-tipo="METRO">Metro</md-button>',
								'<md-button class="btnTransWMS" ng-click="vialToggleWMS($event)" data-tipo="MB">Metrobus</md-button>',
								'<md-button class="btnTransWMS" ng-click="vialToggleWMS($event)" data-tipo="">Colectivo</md-button>',
								'<md-button class="btnTransWMS" ng-click="vialToggleWMS($event)" data-tipo="SUB">Tren Subur</md-button>',
							'</md-list-item>',
							'<md-list-item>',
								'<md-button class="btnTransWMS" ng-click="vialToggleWMS($event)" data-tipo="STE">Trolebus</md-button>',
								'<md-button class="btnTransWMS" ng-click="vialToggleWMS($event)" data-tipo="">Ecobici</md-button>',
								'<md-button class="btnTransWMS" ng-click="vialToggleWMS($event)" data-tipo="RTP">Ruta Camión</md-button>',
								'<md-button class="btnTransWMS" ng-click="vialToggleWMS($event)" data-tipo="">Microbus</md-button>',
							'</md-list-item>',
						'</md-list>',
						'<div class="divider"></div>',
						'<h4 class="m-side-panel__title">Areas de análisis</h4>',
						'<div class="m-side-panel__header">',
							'<h4 class="m-side-panel__subtitle m-side-panel__subtitle--in-location-list">',
								'Transporte público',
							'</h4>',
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

					_map.on('draw:created', _drawComplete);
					_editableLayers.on('layeradd', _startAccessibilityAnalysis);

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

				scope.vialToggleWMS = function($event){
					var $btn = angular.element($event.target);
					if($event.target.nodeName==='SPAN'){
						$btn = angular.element($event.target.parentNode);
					}
					var lay = $btn.data('tipo');
					if( !$btn.hasClass('md-primary')  ){
						$btn.addClass('md-raised');
						$btn.addClass('md-primary');
					}else{
						$btn.removeClass('md-raised');
						$btn.removeClass('md-primary');
					}
					scope.callWMSpublicTrans();
				};

				scope.callWMSpublicTrans = function(){
					var activeBtns = angular.element(document.getElementsByClassName('btnTransWMS'));
					var layers = "";
					var layersP = "";
					_.each(activeBtns, function(btn){
						var $btn = angular.element(btn);
						if($btn.hasClass('md-primary') && $btn.data('tipo') !== ''){
							layers = layers+$btn.data('tipo')+'_l,';
							layersP = layersP+$btn.data('tipo')+'_p,';
						}
					});
					layers = layers.substr(0, layers.length-1);
					layersP = layersP.substr(0, layersP.length-1);
					if(layers !== ''){
						if(_layers.transpWMS !== undefined){
							_map.removeLayer( _layers.transpWMS );
						}
						if(_layers.transpWMS_P !== undefined){
							_map.removeLayer( _layers.transpWMS_P );
						}
						var access_token = Auth.getToken().access_token;

						//Lineas
						_layers.transpWMS = L.tileLayer.wms(
							BaseMapFactory.API_URL+"/ws_transp?access_token="+access_token,
							{
								layers: layers,
								format: 'image/png',
								minZoom: 10,
								transparent: true
						});
						_layers.transpWMS.options.crs = L.CRS.EPSG4326;
						_layers.transpWMS.addTo(_map);

						//PUNTOS
						_layers.transpWMS_P = new L.nonTiledLayer.wms(
							BaseMapFactory.API_URL+"/ws_transp?access_token="+access_token,
							{
								layers: layersP,
								format: 'image/png',
								minZoom: 10,
								transparent: true,
								info_format: 'text/plain'
						});
						_layers.transpWMS_P.options.crs = L.CRS.EPSG4326;
						_layers.transpWMS_P.addTo(_map);
					}else{
						_map.removeLayer( _layers.transpWMS );
						_map.removeLayer( _layers.transpWMS_P );
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

				var _drawComplete = function(e){
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

				var _startAccessibilityAnalysis = function(e){
					var geo_wkt = BaseMapFactory.geom2wkt(_currentFeature);
					var listAccessTrans = angular.element('#listAccessTrans');
					listAccessTrans.html('');
					angular.element('#accessNumP').html('0');
					angular.element('#accessNumS').html('0');
					angular.element('#accessNumT').html('0');
					angular.element('#contAccesTrans').hide();
					var opts = {
						WKT: geo_wkt.wkt,
						MTS: geo_wkt.mts
					};
					AccessibilityService.viasInfo(opts).then(function(res){
						if(res && res.data){
							var info = res.data.info;
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
							angular.element('#accessNumP').html(p);
							angular.element('#accessNumS').html(s);
							angular.element('#accessNumT').html(t);

							var trans = _.countBy(res.data.transp,'agency_id');
							t = 0;
							_.each(trans, function(v,k){
								t++;
								listAccessTrans.append([
									'<md-list-item>',
										'<img ng-src=""></img>',
										'<p>'+k+'</p>',
										'<p id="accessNumT">'+v+'</p>',
									'</md-list-item>'
								].join(''));
							});
							if(t >0){
								angular.element('#contAccesTrans').show();
							}

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
