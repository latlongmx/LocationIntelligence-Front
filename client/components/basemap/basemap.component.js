(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	var BaseMapController = function(_, $scope, BaseMapFactory, BaseMapService){

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
		
		_map = BaseMapService.map_layer();


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
	};

	BaseMapController.$inject = ['_', '$scope', 'BaseMapFactory', 'BaseMapService'];

	angular.module('basemap', []).
	controller('BaseMapController', BaseMapController);

})();
