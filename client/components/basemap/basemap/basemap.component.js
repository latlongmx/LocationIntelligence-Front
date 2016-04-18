(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	var BaseMapController = function($scope, BaseMapService){

		var _this = null,
		_map = null,
		_label = null,
		_label_item = null,
		_ggl = null,
		_mapbox_streets = null,
		_mapbox_relieve = null,
		_mapbox_satellite = null,
		_google_roadmap = null,
		_google_satellite = null,
		_zoom_in = null,
		_zoom_out = null,
		_line_tool = null,
		_polygon_tool = null,
		_area_tool = null,
		_actions_tool = null,
		_edit_tool = null,
		_delete_tool = null,
		_drawControl = null,
		_drawType = null,
		_featureGroup = null,
		_colorLine = null,
		_autocomplete = null;

		_map = BaseMapService.mapElement();
		_featureGroup = BaseMapService._featureGroup.addTo(_map);
		_drawControl = BaseMapService.drawControl(_featureGroup);
		_drawControl.addTo(_map);
		// _map.on('baselayerchange', function(e){
		// 	console.log(e)
		// 	if(e.name === "Google Roadmap"){
		// 		_drawControl.setDrawingOptions({
		// 		    polyline: {
		// 		        shapeOptions: {
		// 		            color: '#000000'
		// 		        }
		// 		    }
		// 		});
		// 	}
		// });
		
		//var _searchInput = document.getElementById('search');
		//console.log(_searchInput)

		//_autocomplete = new google.maps.places.Autocomplete(_searchInput);
		//_autocomplete.bindTo('bounds', _map);
		angular.element(document).ready(function(){
			/**
			 * [Add layers to custom control]
			 */
			_map.addControl(new L.Control.Layers( {
				'Mapbox Calles': BaseMapService.mapbox_streets.addTo(_map),
				'Mapbox Relieve': BaseMapService.mapbox_relieve(),
				'Mapbox Satellite': BaseMapService.mapbox_satellite(),
				'Google Roadmap': BaseMapService.google_roadmap,
				'Google Satellite': BaseMapService.google_satellite
			}, {}, { position: 'bottomright'}));

			/**
			 * [Set image name to each layer]
			 * @type {Array}
			 */
			var imagesArray = ['mapbox-calles', 'mapbox-relieve', 'mapbox-satellite', 'mapbox-satellite', 'mapbox-calles'];
			
			_label_item = angular.element(document.getElementsByClassName('leaflet-control-layers-base')).children();
			_label = angular.element(document.getElementsByClassName('leaflet-control-layers-toggle'));
			_label.text("Mapa Base");

			/**
			 * [Append image function to each layer item]
			 * @param  {[type]} item   [Label control layer item]
			 * @param  {String} index) [Index from each label control layer]
			 */
			angular.forEach(_label_item, function(item, index) {
				angular.element(item).append('<img src="./images/switcher_map/'+imagesArray[index]+'.jpg" width="120"/>');
			});

		});
		
		

		
		_map.on('draw:created', function (e) {
				_drawType = e.layerType;
				
				//     layer = e.layer;
				// Do whatever else you need to. (save to db, add to map etc)
				_featureGroup.addLayer(e.layer);
		});
		
				
		_zoom_in = angular.element(document.getElementsByClassName('leaflet-control-zoom-in'));
		_zoom_in.text("");
		_zoom_in.append('<i class="demo demo-zoom-in leaflet-zoom-in"></i>');
		
		_zoom_out = angular.element(document.getElementsByClassName('leaflet-control-zoom-out'));
		_zoom_out.text("");
		_zoom_out.append('<i class="demo demo-zoom-out leaflet-zoom-out"></i>');
		
		_line_tool = angular.element(document.getElementsByClassName('leaflet-draw-draw-polyline'));
		_line_tool.text("");
		_line_tool.append('<i class="demo demo-line line-tool"></i>');
		
		_polygon_tool = angular.element(document.getElementsByClassName('leaflet-draw-draw-polygon'));
		_polygon_tool.text("");
		_polygon_tool.append('<i class="demo demo-area polygon-tool"></i>');
		
		_area_tool = angular.element(document.getElementsByClassName('leaflet-draw-draw-circle'));
		_area_tool.text("");
		_area_tool.append('<i class="demo demo-radio area-tool"></i>');
		
		_actions_tool = angular.element(document.getElementsByClassName('leaflet-draw-actions'));
		_actions_tool.text("");
		_actions_tool.css({
			display: "block",
			left: "0px",
			top: "40px"
		});
		
		_edit_tool = angular.element(document.getElementsByClassName('leaflet-draw-edit-edit'));
		_edit_tool.text("");
		_edit_tool.append('<i class="demo demo-edit edit-tool"></i>');
		
		_delete_tool = angular.element(document.getElementsByClassName('leaflet-draw-edit-remove'));
		_delete_tool.text("");
		_delete_tool.append('<i class="demo demo-delete delete-tool"></i>');

	};
	
	BaseMapController.$inject = ['$scope', 'BaseMapService'];
	
	angular.module('basemap', []).
	controller('BaseMapController', BaseMapController);

}());
