(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function odService(_, $q, $http, Auth, BaseMapService, $rootScope){
		var _sMarker = new L.LayerGroup(),
		_markersCustZC = new L.LayerGroup(),
		_polylinesGroup = new L.LayerGroup(),
		_polygonsGroup = new L.LayerGroup(),
		zcMarker = null,
		deferred = null,
		baseURL = null,
		_zip_code = null,
		_geometry = [],
		cityLayer = null;

		baseURL = 'http://bbva-api.appdata.mx/basic-stats/';

		var clearLayer = function (layer) {
			layer.clearLayers();
			_markersCustZC.clearLayers();
			_polylinesGroup.clearLayers();
			_polygonsGroup.clearLayers();
		};
		
		var getClass = function(val, a) {
			var separator = ' - ';
			for(var i= 0; i < a.length; i++) {
				if(a[i].indexOf(separator) != -1) {
					var item = a[i].split(separator);
					if(val <= parseFloat(item[1])) {return i;}
				} else {
					if(val == a[i]) {
						return i;
					}
				}
			}
		}
		
		var setZcGeometry = function(geometry){
			_geometry.push(geometry);
		}
		
		var getZcGeometry = function(){
			return _geometry;
		}

		this.removeMarker = function(){
			return clearLayer(_sMarker);
		}

		this._map = BaseMapService.map.then(function (map) {
			return map;
		});

		this.loadMap = function(layer, panel){
			var items = [],
			test = null,
			ranges = null,
			color_x = new Array ('#ffffff', '#ffffff', '#ffffff', '#ffffff'),
			propertySelected = "Sum_POB1",
			serie = new geostats();

			_.each(layer.features, function(val, i) {
				setZcGeometry(val);
				items.push(val.properties[propertySelected]);
			});

			serie.setSerie(items);
			test = serie.getClassJenks(4);
			ranges = serie.ranges;
			serie.setColors(color_x);
			
			cityLayer = L.geoJson(layer, {
				onEachFeature: this.onEachFeature,
				style: function(feature) {
					return { fillOpacity: 0.6, weight: 1.2, color: "#828189", fillColor: color_x[getClass(feature.properties[propertySelected], ranges)] };
				}
			});
			return cityLayer;
		}

		this.onEachFeature = function(feature, layer) {
			layer.on('click', function(e) {
				clearLayer(_sMarker);
				zcMarker = L.marker([e.latlng.lat, e.latlng.lng], { ZipCode : feature.properties.ZipCode });
				_sMarker.addLayer(zcMarker);
				_sMarker.addTo(this._map);
				zcMarker.bindPopup("Código postal: " + feature.properties.ZipCode);

				$rootScope.$emit('zc_event', feature.properties.ZipCode)
				this._map.setView([zcMarker._latlng.lat, zcMarker._latlng.lng, this._map._zoom]);
			});
		}
		
		this.getBasicStats = function(zc) {
			deferred = $q.defer();
			var _intersect = $http({
				url: baseURL + zc,
				method: 'GET',
				cache: true
			});

			_intersect.then(function(result){
				deferred.resolve(result);
			}, function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		}

		this.setMarkers = function(d, zip_code) {
			var serie = new geostats(),
			color_x = new Array('#22ac9b', '#82c341', '#acd08c', '#cbdf7d'),
			test = null,
			ranges = null,
			_point1 = null,
			_marker = null,
			_countLine = 0,
			_items = [],
			_geometry_Zc = [],
			_point1 = new L.LatLng(zcMarker._latlng.lat, zcMarker._latlng.lng);

			_.map(getZcGeometry(), function(valor, i){
				if(d.zcs[valor.properties.ZipCode]) {
					if ( zip_code !== valor.properties.ZipCode) {
						_geometry_Zc.push(valor.geometry);
					}
				}
			});

			_.each(d.zcs, function(val, i){
				_items.push(val.incomes)
			});

			serie.setSerie(_items);
			test = serie.getClassQuantile(4);
			ranges = serie.ranges;
			serie.setColors(color_x);
			
			_.each(d.zcs, function(data, zp) {
				var lat = 0,
				lng = 0,
				marker = null,
				_point2 = null,
				_pointList = null,
				_polyline = null,
				_popupContent = null,
				_colorLine = null,
				_weightLine = null;
				
				var testing = L.geoJson(DFGeoJson , {
					filter: function(feature, layer) {
						if(feature.properties.ZipCode == zp) {
							lat = feature.properties.Lat;
							lng = feature.properties.Lon;
							return feature.properties.ZipCode;
						}
					}
				});

				if(lat !== 0) {
					_countLine++;
					_marker = L.circle([lat, lng], 200, {
						data : data,
						zp : zp,
						fillOpacity: 0.7, 
						opacity: 0.7, weight: 1.2, color: "#828189", fillColor: color_x[getClass(data.incomes, ranges)]
					});

					_popupContent = ['<p><strong>Ingresos</strong><br/><span class="number">' + data.incomes + '</span></p>',
					'<p><strong>Número de tarjetas</strong><br/><span class="number">' + data.num_cards + '</span></p>',
					'<p><strong>Número de pagos</strong><br/><span class="number">' + data.num_payments + '</span></p>'
					];
					_marker.bindPopup(_popupContent.join(''));
					
					_point2 = new L.LatLng(lat, lng);
					_pointList = [_point1, _point2];
					
					if(_countLine % 2 === 0){
						_colorLine = "#22ac9b";
					}
					else {
						_colorLine = "#828189";
					}
					_polyline = new L.Polyline(_pointList, {
						color: _colorLine,
						weight: 1,
						opacity: 0.9,
						smoothFactor: 1,
						clickable: true
					});

					_polygonsGroup = L.geoJson(_geometry_Zc, {
						style: function(feature) {
							return { fillOpacity: 0.75, weight: 1.2, color: "#22ac9b", fillColor: "#22ac9b"};
						}
					});
					_polylinesGroup.addLayer(_polyline);
					_markersCustZC.addLayer(_marker);
				}
			});
			BaseMapService.map.then(function (map) {
				_polylinesGroup.addTo(map);
				_markersCustZC.addTo(map);
				_polygonsGroup.addTo(map).bringToBack();
			});
		}

	}

	odService.$inject = ['_', '$q', '$http', 'Auth' ,'BaseMapService', '$rootScope'];
	angular.module('od.service', []).
		service('odService', odService);

})();
