(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	angular.module('basemap.service', []).
	service('BaseMapService', function(){
		this.mapId = 'pokaxperia.pk657nfi';
		this.accessToken = 'pk.eyJ1IjoicG9rYXhwZXJpYSIsImEiOiJjaW11N3o2N3UwMjk3dm9sdTZwOXJoNDduIn0.pycNbGB_4G68a0RmYTR5Sg';
		this.mapElement = L.map('basemap').setView([19.432711775616433, -99.13325428962708], 12);
		
		var featureGroup = L.featureGroup().addTo(this.mapElement);
		var drawControl = new L.Control.Draw({
		    edit: {
		      featureGroup: featureGroup
		    }
		  }).addTo(this.mapElement);
		
		// this.mapElement.on('draw:drawvertex', function (e) {
		// 	var arreglo = null;
		// 	var count = 0;
		// 	var myLT = [];

		// 	angular.forEach(e.layers._layers, function(i,a){
		// 		arreglo = i;
		// 		count++
		// 		myLT.push(i._latlng);
		// 		arreglo = {_latlngs: myLT};
		// 		//console.log(arreglo.measuredDistance());
		// 		//console.log(a)
		// 		// if (i._latlng.length >= 2) {
		// 		// 	myLT.push(i._latlng)
		// 		// 	arreglo = {_latlngs: myLT};
		// 		// }
				
		// 		//console.log(myLT.measuredDistance());
				
		// 	})
			
		// 		//console.log(i.measuredDistance());

		// });
		
		this.mapElement.on('draw:created', function (e) {
			var type = e.layerType,
					layer = e.layer;

				//
					// Do marker specific actions

			// Do whatever else you need to. (save to db, add to map etc)
			featureGroup.addLayer(e.layer);
			console.log(layer.measuredDistance());
		});
	});


}());
