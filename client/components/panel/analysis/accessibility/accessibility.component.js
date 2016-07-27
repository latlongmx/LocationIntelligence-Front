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
		var _$userDraws = null;
		var _$userDrawsGeoms = [];

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
							'<md-button id="btnAddNewPoly" class="groupX middle leaflet-draw-draw-polygon" title="Dibujar Poligono" ng-click="drawInMap($event,\'polygon\')">',
								'<i class="demo demo-area polygon-tool"></i>',
							'</md-button>',
							'<md-button id="btnAddNewRadio" class="groupX right leaflet-draw-draw-circle" title="Dibujar Radio" ng-click="drawInMap($event,\'circle\')">',
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
							'<div class="m-side-panel__header" id="contAccesTrans">',
								'<h4 class="m-side-panel__subtitle m-side-panel__subtitle--in-location-list">',
									'Vías de acceso en transporte',
								'</h4>',
							'</div>',
							'<md-list id="listAccessTrans" style="overflow-y: auto; height: 140px;">',
							'</md-list>',
						'</div>',
						'<p></p>',
						'<div id="access_trans_content"></div>',

						'<div class="divider"></div>',
						'<h4 class="m-side-panel__title">Datos de transporte público</h4>',
						'<div class="m-side-panel__header">',
							/*'<h4 class="m-side-panel__subtitle m-side-panel__subtitle--in-location-list">',
								'Transporte público',
							'</h4>',*/
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
							'<ul class="m-side-panel__list-titles">',
								'<div layout="row">',
									'<p flex="50" class="m-side-panel__list-titles__column-name">Nombre</p>',
									'<p flex="20" class="m-side-panel__list-titles__column-name">Tipo</p>',
									'<p flex="10" class="m-side-panel__list-titles__column-name">Visible</p>',
									'<p flex="10" class="m-side-panel__list-titles__column-name"></p>',
									'<p flex="10" class="m-side-panel__list-titles__column-name"></p>',
								'</div>',
							'</ul>',
						'</div>',

						'<div class="m-side-panel__list" style="height: 100px; position: absolute;top:685px; overflow-y: auto; left:15px;right:15px;">',
							'<ul id="accessPanelUserDraws" class="m-side-panel__list-content">',
								'<li ng-repeat="draw in userDraws" class="m-side-panel__list-content__item js-location-item li">',
									'<p flex="50" class="m-side-panel__list-content__item-single">{{draw.name}}</p>',
									'<p flex="20" class="m-side-panel__list-content__item-single">{{draw.icon}}</p>',
									'<md-switch data-iddraw="draw.id" ng-model="draw.isActive" flex="10" data-iddraw="draw.id" ng-change="turnOnOffDraw(draw.id)" ng-model="layer" md-no-ink class="md-primary md-hue-1 m-side-panel__list-content__item-single"></md-switch>',
									'<md-button flex="10" data-iddraw="draw.id" ng-click="zoomToUserDraw(draw.id)" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single">',
										'<md-icon>zoom_in</md-icon>',
									'</md-button>',
									// ng-click="removeLocation(location, location.id_layer, location.name_layer, $index)"
									'<md-button flex="10" data-iddraw="draw.id" ng-click="delUserDraw(draw.id)" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single">',
										'<md-icon>delete</md-icon>',
									'</md-button>',
								'</li>',
							'</ul>',
						'</div>',

					'</div>',
				'</div>'
			].join(''),
			link: function(scope, element, attr, potencialCtrl){

				scope.userDraws =[];

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
						scope.addUserDraw2Panel(-1,'Mi dibujo',_currentFeature);
						scope.activateViasWMS(_currentFeature);
						_editableLayers.clearLayers();
						_editableLayers.addLayer( _currentFeature.layer );
					}
				};

				scope.activateViasWMS = function( geom ){
					var access_token = Auth.getToken().access_token;
					var geo_wkt = "";
					geo_wkt = BaseMapFactory.geom2wkt( geom );

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
				};

				var _startAccessibilityAnalysis = function(e){
					var geo_wkt = BaseMapFactory.geom2wkt(_currentFeature);
					var listAccessTrans = angular.element('#listAccessTrans');
					listAccessTrans.html('');
					angular.element('#accessNumP').html('0');
					angular.element('#accessNumS').html('0');
					angular.element('#accessNumT').html('0');
					//angular.element('#contAccesTrans').hide();
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
						}
					}, function(error){
						console.log(error);
					});
					_currentFeature = null;
				};


				_$userDraws= angular.element(document.getElementById('accessPanelUserDraws'));
				scope.addUserDraw2Panel = function(id, name, draw){
					var isActive = false;
					if(id===-1){
						id = (scope.userDraws.length+1)*-1;
						isActive = true;
					}
					if(isActive){
						_.each(scope.userDraws, function(o){
							o.isActive = false;
						});
					}
					scope.userDraws.push({
						id:id,
						name:name,
						icon:'',
						isActive:isActive,
						draw:draw
					});

					var Obj = {
						nm: name,
						typ: draw.layerType,
						geo: {}
					};
					if(draw.layerType === 'polygon'){
						var latlngs = draw.layer.getLatLngs();
						Obj.geo = {
							latlngs: _.map(latlngs[0],function(o){
							  return { lat: o.lat, lng: o.lng };
							})
						};
					}else{
						Obj.geo = {
							radius: draw.layer.getRadius(),
							lat: draw.layer.getLatLng().lat,
							lng: draw.layer.getLatLng().lng
						};
					}

					AccessibilityService.addUserDraws(Obj).then(function(data){
						console.log(Obj);
						console.log(data);
					});
					scope.verifyLimitDraws();
				};

				scope.verifyLimitDraws = function(){
					var _$btnAddNewPoly = angular.element(document.getElementById('btnAddNewPoly'));
					var _$btnAddNewRadio = angular.element(document.getElementById('btnAddNewRadio'));
					if( scope.userDraws.length>=2){
						_$btnAddNewPoly.attr('disabled',true);
						_$btnAddNewRadio.attr('disabled',true);
					}else{
						_$btnAddNewPoly.attr('disabled',false);
						_$btnAddNewRadio.attr('disabled',false);
					}
				};

				scope.getUserDraws = function(){
					AccessibilityService.getUserDraws().then(function(res){
						_.each(res.data.draws, function(o){
							var geo;
							if(o.type_draw==='circle'){
								geo = {
										layerType: o.type_draw,
										layer: L.circle([o.gjson.lat, o.gjson.lng], o.gjson.radius, {
											color: '#81A1C1'
										})
									};
							}else{
								var coords = _.map(o.gjson.latlngs,function(o){
									return [o.lat, o.lng];
								});
								geo = {
										layerType: o.type_draw,
										layer: L.polygon(coords, {
											color: '#81A1C1'
										})
									};
							}
							scope.userDraws.push({
								id: o.id_draw,
								name: o.name_draw,
								icon:'',
								isActive: false,
								draw: geo
							});
						});
						scope.verifyLimitDraws();
					});
				};

				scope.getUserDraws();

				scope.delUserDraw = function(id){
					scope.userDraws = _.filter(scope.userDraws, function(o) { return o.id !== id; });
					_editableLayers.clearLayers();
					_currentFeature = null;
					if(_layers.viasUserWMS !== undefined){
						_map.removeLayer( _layers.viasUserWMS );
					}
					AccessibilityService.delUserDraws(id);
					scope.verifyLimitDraws();
				};
				scope.zoomToUserDraw = function(id){
					var d = _.findWhere( scope.userDraws ,{id:id});
					_map.fitBounds(d.draw.layer.getBounds());
				};
				scope.turnOnOffDraw = function(id){
					_editableLayers.clearLayers();
					var d = _.findWhere( scope.userDraws ,{id:id});
					if(d.isActive){
						_.each(scope.userDraws, function(o){
							if(o.id!==d.id){
								o.isActive = false;
							}
						});
						_currentFeature = d.draw;
						scope.activateViasWMS( _currentFeature );
						_editableLayers.addLayer( _currentFeature.layer );
					}else{
						if(_layers.viasUserWMS !== undefined){
							_map.removeLayer( _layers.viasUserWMS );
						}
					}

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
