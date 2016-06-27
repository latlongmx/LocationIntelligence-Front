(function(){
	L.TileLayer.DynamicWMS = L.TileLayer.WMS.extend({
		dinamicWmsParams: {
		},
		setDynamicParam: function(params){
			L.extend(this.dinamicWmsParams, params);
		},
		getTileUrl: function (coords) {
			var params = L.TileLayer.WMS.prototype.getTileUrl.call(this, coords);
			for(var o in this.dinamicWmsParams){
				if(typeof this.dinamicWmsParams[o] === 'function'){
					params += "&"+o+"="+this.dinamicWmsParams[o]();
				}
			}
			return params;
		}
	});
	L.tileLayer.dynamicWms = function (url, options) {
	return new L.TileLayer.DynamicWMS(url, options);
};
}());
(function(){
	/*
	* BaseMap Factory
	* factory para leer
	*/
	'use strict';

	function BaseMapFactory(BaseMapService, chroma, _, Auth) { //_, chroma, $http
		var factory = {};
		var _factory = factory;

		factory.LAYERS = {
			USER: {}
		};

		factory.API_URL = 'http://52.8.211.37/api.walmex.latlong.mx';

		/**
		 * [getCoords: Lee las coordenas de una geometria y regresa un arreglo]
		 * @param {[type]} layer [layer de la geometria]
		 * @param {[type]} String [Tipo de geometria dibujada]
		 * @return {[type]} Array [Arreglo de coordenadas]
		 */
		factory.getCoords = function(layer, geomtype){
			var coors = "";
			var latlngs = layer.getLatLngs();
			for (var i=0; i<latlngs.length; i++){
				if (i !== 0){
					coors += ',';
				}
			 coors += latlngs[i].lng+' '+latlngs[i].lat;
			}
			if(geomtype ==='polygon'){
				coors += ','+latlngs[0].lng+' '+latlngs[0].lat;
			}
			return coors;
		};

		/**
		 * [geom2wkt: Lee la geometria dibujada y regresa WKT]
		 * @param {[type]} geom [element drawed]
		 * @return {Object} [wkt:{String},mts:{Integer}]
		 */
		factory.bounds2polygonWKT = function(bounds){
			var center = bounds.getCenter();
			var latlngs = [];
			latlngs.push(bounds.getSouthWest());//bottom left
			latlngs.push({ lat: bounds.getSouth(), lng: center.lng });//bottom center
			latlngs.push(bounds.getSouthEast());//bottom right
			latlngs.push({ lat: center.lat, lng: bounds.getEast() });// center right
			latlngs.push(bounds.getNorthEast());//top right
			latlngs.push({ lat: bounds.getNorth(), lng: bounds.getCenter().lng });//top center
			latlngs.push(bounds.getNorthWest());//top left
			latlngs.push({ lat: bounds.getCenter().lat, lng: bounds.getWest() });//center left
			return "POLYGON(("+this.getCoords(new L.polygon(latlngs), 'polygon')+"))";
		},
		/**
		 * [geom2wkt: Lee la geometria dibujada y regresa WKT]
		 * @param {[type]} geom [element drawed]
		 * @return {Object} [wkt:{String},mts:{Integer}]
		 */
		factory.geom2wkt = function(geom){
			var wkt = false;
			var latlng = null;
			var mts = 0;
			var layer = geom.layer;
			var i =0;
			switch (geom.layerType) {
				case 'polygon':
					wkt = "POLYGON(("+this.getCoords(layer, geom.layerType)+"))";
					break;
				case 'polyline':
					wkt = "LINESTRING("+this.getCoords(layer, geom.layerType)+")";
					break;
				case 'circle':
					latlng = layer.getLatLng();
					wkt = "POINT("+latlng.lng+" "+latlng.lat+")";
					mts = parseInt(layer.getRadius());
					break;
				default:
					break;
			}
			return {
				wkt: wkt,
				mts: mts
			};
		};


		/*STYLES*/

		factory.eachFeature = function(feature, layer) {
			var popupContent = "";
			for (var k in feature.properties) {
				var v = String(feature.properties[k]);
				popupContent += '<strong>' + k + '</strong>  <span style="font-style: italic;">  ' + v + '</span><br/>';
			}
			layer.bindPopup('<div class="popInfo">' + popupContent + '</div>');
		};
		/**
		 * [addLayer: Agrega capa a leaflet]
		 * @param {[type]} map [element drawed]
		 * @param {[type]} String [Nombre del layer a agregar]
		 * @param {[type]} data [geojson]
		 */
		factory.addLayer = function(map, layer, GeoJSON){
			var opts = {
				onEachFeature: this.eachFeature,
				style: {
					"color": "#ff7800",
					"weight": 5,
					"opacity": 0.65
				}
			};
			if(layer==='denue_2016'){
				opts.style = {
					radius: 8,
					fillColor: "#4bb917",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				};
				opts.pointToLayer = function(feature, latlng) {
					return L.circleMarker(latlng, function(){
						return {
							radius: 8,
							fillColor: "#4bb917",
							color: "#000",
							weight: 1,
							opacity: 1,
							fillOpacity: 0.8
						};
					});
				};
			}else if(layer==='competencia'){
				delete opts.onEachFeature;
				opts.style = {
					radius: 8,
					fillColor: "#ff0000",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				};
				opts.pointToLayer = function(feature, latlng) {
					return L.circleMarker(latlng, function(){
						return {
							radius: 10,
							fillColor: "#ff0000",
							color: "#000",
							weight: 1,
							opacity: 1,
							fillOpacity: 0.8
						};
					});
				};
			}else if(layer==='inter15_vias'){
				opts.style = {
					"color": "#0029d6",
					"weight": 3,
					"opacity": 0.65
				};
			}else if(layer==='pobviv2010'){
				opts.style = {
					weight: 1,
					opacity: 0.2,
					color: '#f7614b',
					dashArray: '3',
					fillOpacity: 0.1,
					fillColor: '#8cb502'
				};
			}else if(layer==='other_table'){
			}
			var myLayer = L.geoJson(GeoJSON, opts).addTo(map);
		};
		/**
		 * [addGeoJSON: Lee la geometria dibujada y regresa WKT]
		 * @param {[type]} geom [element drawed]
		 * @return {Object} [wkt:{String},mts:{Integer}]
		 */
		factory.addGeoJSON2Map = function(GeoJSON, typeLayer){
			var self = this;
			BaseMapService.map.then(function (map) {
				self.addLayer(map, typeLayer, GeoJSON);
			});
		};

		factory.addCompetencia = function(GeoJSON){
			var self = this;
			BaseMapService.map.then(function (map) {
				self.addLayer(map, 'competencia', GeoJSON);
			});
		};

		factory.cleanColorPletMap = function(){
			this.LAYERS.heatMap.clearLayers();
		};

		factory.addColorPletMap = function(GeoJSON, column){
			var self = this;

			if(self.LAYERS.heatMap !== undefined){
				self.LAYERS.heatMap.clearLayers();
				self.LAYERS.heatMap.addData(GeoJSON);
				return;
			}

			BaseMapService.map.then(function (map) {

				var SCALE = 10;
				var vals = GeoJSON.features.map(function(o){return parseInt(o.properties[column]) || 0;});
				var dmax = window._.max(vals);
				//var dmin = _.min(vals)
				//var scaleColor = chroma.chroma.bezier(['lightyellow', 'orange', 'deeppink', 'darkred']);
				var scaleColor = chroma.chroma.bezier(['Aqua', 'Blue']);
				scaleColor = chroma.chroma.scale(scaleColor).domain([1,SCALE], 1 ).correctLightness(true);
				var opts = {
					onEachFeature: self.eachFeature,
					style: function(feature){
						var p = feature.properties;
						var color = scaleColor( (   ((parseInt(p[column])*SCALE)/dmax) || 0) ).hex();
						return {
							fillOpacity: 0.65,
							fillColor: color,
							stroke: 0
						};
					}
				};
				self.LAYERS.heatMap = L.geoJson(GeoJSON, opts).addTo(map);
			});
		};

		factory._curVar = '';
		factory.setPobVivWMS = function(variable){
			var self = this;
			self._curVar = variable;
			BaseMapService.map.then(function (map) {
					self.LAYERS.pobvivWMS = L.tileLayer.dynamicWms("http://52.8.211.37/api.walmex.latlong.mx/dyn/pb_wms?", {
							layers: 'Manzanas',
							format: 'image/png',
							minZoom: 13,
							transparent: true
					});
					self.LAYERS.pobvivWMS.setDynamicParam({
						col: function(){
							return self._curVar;
						}
					});
					self.LAYERS.pobvivWMS.options.crs = L.CRS.EPSG4326;
					self.LAYERS.pobvivWMS.addTo(map);
					self.LAYERS.pobvivWMS.setZIndex(9);
			});
		};

		factory.setHeatWMS = function(variable){
			var self = this;
			self._curVar = variable;
			BaseMapService.map.then(function (map) {
				self.LAYERS.heatWMS = L.tileLayer.dynamicWms("http://52.8.211.37/cgi-bin/mapserv?map=/var/www/laravel-storage/ms_file_heat.map", {
					layers: 'heatmap',
					format: 'image/png',
					minZoom: 13,
					transparent: true
				});
				self.LAYERS.heatWMS.setDynamicParam({
					col: function(){
						return self._curVar;
					}
				});
				self.LAYERS.heatWMS.options.crs = L.CRS.EPSG4326;
				self.LAYERS.heatWMS.addTo(map);
				self.LAYERS.heatWMS.setZIndex(10);
			});
		};

		factory.delPobVivWMS = function(){
			if(this.LAYERS.pobvivWMS){
					var self = this;
				BaseMapService.map.then(function (map) {
					map.removeLayer( self.LAYERS.pobvivWMS );
				});
			}
		};

		factory.addLocation = function(obj){
			BaseMapService.map.then(function (map) {
				var access_token = Auth.getToken();
				var points = [];
				_.each(obj.data,function(p){
					var url = factory.API_URL+'/icons/supermarket.png';
					if(p.pin_url && p.pin_url !== ''){
						url = factory.API_URL+ '/ws/icon?nm=' +p.pin_url+'&access_token='+access_token.access_token;
					}
					var icon = new L.icon({
						iconUrl: url,
						iconSize:[32, 32]
					});
					var data = p.data_values;
					var html = '';
					for(var o in data){
					  for(var r in data[o]){
							html += '<strong>'+r+'</strong>: '+data[o][r]+'<br>';
					  }
					}
					points.push( L.marker([p.y, p.x], {icon: icon}).bindPopup(html) );
				});
				_factory.LAYERS.USER[obj.name] = L.featureGroup(points);
			});
		};
		factory.hideLocation = function(name){
			BaseMapService.map.then(function (map) {
				map.removeLayer( _factory.LAYERS.USER[name] );
			});
		};
		factory.showLocation = function(name){
			BaseMapService.map.then(function (map) {
				map.addLayer( _factory.LAYERS.USER[name] );
			});
		};
		factory.zoomLocation = function(name){
			BaseMapService.map.then(function (map) {
				map.fitBounds( _factory.LAYERS.USER[name].getBounds() );
			});
		};
		factory.addHeatMap = function(options){
			BaseMapService.map.then(function (map) {
				options.wkt = _factory.bounds2polygonWKT(map.getBounds());
				BaseMapService.getHeatMapData(options).then(function(res){
					if(res.data){
						var data = res.data.data.map(function (p) {
							 return [p[0], p[1]];
						});
						if(_factory.LAYERS.USER['heatmap']===undefined){
							_factory.LAYERS.USER['heatmap'] =
									/*L.heatLayer(res.data.data, {
										radius: 55
									}).addTo(map);*/
									L.heatLayer(data).addTo(map);
						}else{
							_factory.LAYERS.USER['heatmap'].setLatLngs(data);
						}

					}
				});
			});
		};


		factory.addHeatMap2Layer = function(layer, cods, reload){
			if(_factory.LAYERS.USER[layer]===undefined || reload === true){
				BaseMapService.map.then(function (map) {
					var wkt = _factory.bounds2polygonWKT(map.getBounds());
					var options = {
						cod: cods,
						wkt: wkt
					};
					if(reload===false && _factory.LAYERS.USER[layer] !== undefined){
						_factory.LAYERS.USER[layer].addTo(map);
					}else{
						_factory.addHeatMap2Data(options,function(data){
							if(_factory.LAYERS.USER[layer] === undefined){
								_factory.LAYERS.USER[layer] = L.heatLayer(data).addTo(map);
							}else{
								_factory.LAYERS.USER[layer].setLatLngs(data);
							}
						});
					}
				});
			}
		};
		factory.addHeatMap2Data = function(options, callback){
			BaseMapService.getHeatMapData(options).then(function(res){
				if(res.data){
					var data = res.data.data.map(function (p) {
						 return [p[0], p[1]];
					});
					callback(data);
				}
			});
		};

		factory.hideHeatMapCategory = function(category){
			var categ = category.toLowerCase();
			BaseMapService.map.then(function (map) {
				var layer = '';
				switch (categ) {
					case 'food':
						layer = 'heatmapFood';
						break;
					case 'tourims':
						layer = 'heatmapTourims';
						break;
					case 'shop':
						layer = 'heatmapShop';
						break;
				}
				map.removeLayer( _factory.LAYERS.USER[layer] );
			});

		};
		factory.addHeatMapCategory = function(category, reload){
			var categ = category.toLowerCase();
			switch (categ) {
				case 'food':
					_factory.addHeatMap2Layer('heatmapFood','722',reload);
					break;
				case 'tourims':
					_factory.addHeatMap2Layer('heatmapTourims','721,712',reload);
					break;
				case 'shop':
					_factory.addHeatMap2Layer('heatmapShop','46',reload);
					break;
			}
		};

		return factory;
	}


	BaseMapFactory.$inject = ['BaseMapService', 'chroma','_', 'Auth'];
	angular.module('basemap.factory',[])
		.factory('BaseMapFactory', BaseMapFactory);

})();
