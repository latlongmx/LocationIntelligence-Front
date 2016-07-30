(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function odService(_, $q, $http, Auth, BaseMapService, $rootScope){
		var sMarker =  new L.LayerGroup(),
		zcMarker = null,
		deferred = null,
		baseURL = null,
		_zip_code = null,
		cityLayer = null;

		baseURL = 'http://bbva-api.appdata.mx/basic-stats/';

		var clearLayer = function (layer) {
			layer.clearLayers();
		};

		var setLabelZipCode = function(ZipCode) {
			_zip_code = ZipCode;
		}

		this.getLabelZipCode = function(callback) {
			if (_zip_code) {
				return callback(_zip_code);
			}
			else {
				return callback("Sin código postal");
			}
			
		}

		this.removeMarker = function(){
			return clearLayer(sMarker);
		}

		this._map = BaseMapService.map.then(function (map) {
			return map;
		});

		this.loadMap = function(layer){
			var items = [],
			test = null,
			ranges = null,
			color_x = new Array ('#ffffff', '#ffffff', '#ffffff', '#ffffff'),
			propertySelected = "Sum_POB1",
			serie = new geostats();

			_.each(layer.features, function(val, i) {
				items.push(val.properties[propertySelected]);
			});

			serie.setSerie(items);
			test = serie.getClassJenks(4);
			ranges = serie.ranges;
			serie.setColors(color_x);

			function getClass(val, a) {
				var separator = ' - '
				// return 2;
				for(var i= 0; i < a.length; i++) {
					// all classification except uniqueValues
					if(a[i].indexOf(separator) != -1) {
						var item = a[i].split(separator);
						if(val <= parseFloat(item[1])) {return i;}
					} else {
						// uniqueValues classification
						if(val == a[i]) {
							return i;
						}
					}
				}
			}
			
			cityLayer = L.geoJson(layer, {
				onEachFeature: this.onEachFeature,
				style: function(feature) {
					return { fillOpacity: 0.6, weight: 1.2, color: "#00b8b0", fillColor: color_x[getClass(feature.properties[propertySelected], ranges)] };
				}
			});
			return cityLayer;
		}

		this.onEachFeature = function(feature, layer) {
			layer.on('click', function(e) {
				clearLayer(sMarker);
				zcMarker = L.marker([e.latlng.lat, e.latlng.lng], { ZipCode : feature.properties.ZipCode });
				sMarker.addLayer(zcMarker);
				sMarker.addTo(this._map);
				zcMarker.bindPopup("Código postal: " + feature.properties.ZipCode);

				//getBasicStats(feature.properties.ZipCode);
				$rootScope.$emit('zc_event', feature.properties.ZipCode)
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

	}

	odService.$inject = ['_', '$q', '$http', 'Auth', 'BaseMapService', '$rootScope'];
	angular.module('od.service', []).
		service('odService', odService);

})();
