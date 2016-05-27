(function(){
	/*
	* BaseMap Factory
	* factory para leer
	*/
	'use strict';

	function BaseMapFactory(BaseMapService, chroma, _) { //_, chroma, $http
		var factory = {};

		factory.LAYERS = {};

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
				var scaleColor = chroma.chroma.bezier(['lightyellow', 'orange', 'deeppink', 'darkred']);
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

		return factory;
	}

	BaseMapFactory.$inject = ['BaseMapService', 'chroma','_'];
	angular.module('basemap.factory',[])
		.factory('BaseMapFactory', BaseMapFactory);

}());
