(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function odService(_, $q, $http, Auth){
		
		this.loadMap = function(layer){
			var items = [],
			cityLayer = null,
			test = null,
			ranges = null,
			color_x = new Array ('#FFD4C4', '#FF8069', '#E84E3D', '#E63629'),
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
				style: function(feature) {
					//console.log(feature)
					return { fillOpacity: 0.6, opacity: 0.7, weight: 1.2, color: "#fff", fillColor: color_x[getClass(feature.properties[propertySelected], ranges)] };
				}
			});
			return cityLayer;
		}
	}

	odService.$inject = ['_', '$q', '$http', 'Auth'];
	angular.module('od.service', []).
		service('odService', odService);

})();
