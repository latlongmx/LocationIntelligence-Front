(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function BaseMap($rootScope, $timeout, BaseMapService, Auth, uiService, token){
		return {
			restrict: 'E',
			replace:true,
			template: [
				'<div id="basemap" class="m-basemap">',
					'<label type="button" aria-label="" style="position: absolute;top: 135px;right: 10px;bottom: initial;z-index: 800;background: #828189;width: 35px;text-align: center;color:#ffffff;">',
						'<span id="zoom" class="bold" style="font-size:18px;"></span>',
					'</label>',
				'</div>',
			].join(''),
			link:function(scope, element){
				var newZoom = angular.element(document.getElementById('zoom')),
				_this = null,
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
				
				var _map = BaseMapService.map(element[0]);
				_featureGroup = BaseMapService.featureGroup.addTo(_map);
				_drawControl = BaseMapService.drawControl(_featureGroup);
				_drawControl.addTo(_map);
				
				_google_roadmap = new L.Google('ROADMAP');
				_google_satellite = new L.Google();
				_mapbox_streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + token, {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="http://mapbox.com">Mapbox</a>',
					id: BaseMapService.mapId
				});
				_mapbox_relieve = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + token, {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="http://mapbox.com">Mapbox</a>',
					id: 'caarloshugo1.lnipn7db'
				});
				_mapbox_satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + token, {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="http://mapbox.com">Mapbox</a>',
					id: 'mapbox.satellite'
				});
				/**
				 * [Add layers to custom control]
				 */
				_map.addControl(new L.Control.Layers( {
					'Mapbox Streets': _mapbox_streets.addTo(_map),
					'Mapbox Relieve': _mapbox_relieve,
					'Mapbox Satellite': _mapbox_satellite,
					'Google Roadmap': _google_roadmap,
					'Google Satellite': _google_satellite
				}, {}, { position: 'bottomright'}));
				
				
				_map.on('baselayerchange', function(e){
					layerToggle.text("").append('<img src="./images/switcher_map/'+e.name.toLowerCase().replace(' ', '-')+'.jpg" width="120"/>');
				});
				
				
				/**
				 * [Set image name to each layer]
				 * @type {Array}
				 */
				var imagesArray = ['mapbox-streets', 'mapbox-relieve', 'mapbox-satellite', 'google-roadmap', 'google-satellite'];
				var layerToggle = angular.element(document.getElementsByClassName('leaflet-control-layers-toggle'));
				_label_item = angular.element(document.getElementsByClassName('leaflet-control-layers-base')).children();
				_label = angular.element(document.getElementsByClassName('leaflet-control-layers-toggle'));
				_label.text("");

				/**
				 * [Append image function to each layer item]
				 * @param  {[type]} item   [Label control layer item]
				 * @param  {String} index) [Index from each label control layer]
				 */
				_.forEach(_label_item, function(item, index) {
					angular.element(item).append('<img src="./images/switcher_map/'+imagesArray[index]+'.jpg" width="120"/>');
				});
				
				layerToggle.text("").append('<img src="./images/switcher_map/'+imagesArray[0]+'.jpg" width="120"/>');
				

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

				
				_map.on('draw:created', function (e) {
					_featureGroup.addLayer(e.layer);
				});

				
				//BaseMapService.map.then(function(map) {
					/* Update zoom */
					newZoom.text(_map.getZoom());
					
					/**
					 * [_getZoom Function to get the current zoom]
					 * @param  {[number]} zoom [get zoom]
					 * @return {[type]}      [new zoom]
					 */
					function _getZoom(zoom){
						newZoom.text(zoom);
					}

					/**
					 * [description]
					 * @param  {[type]} event) [Map event when zoom is changed]
					 * @return {[type]} [Function]
					 */
					_map.on('zoomend', function(event){
						_getZoom(_map.getZoom());
					});

					/**
					 * [description]
					 * @param  {[type]} [Map events when user clicks or dragstart]
					 * @return {[type]} [Service to hide panel]
					 */
					_map.on('click dragstart', function(){
						uiService.changeCurrentPanel(true);
					});
				//});

			}
		};
	}
	
	BaseMap.$inject = ['$rootScope', '$timeout', 'BaseMapService', 'Auth', 'uiService', 'token'];

	angular.module('basemap.directive', [])
		.directive('basemap', BaseMap);
})();