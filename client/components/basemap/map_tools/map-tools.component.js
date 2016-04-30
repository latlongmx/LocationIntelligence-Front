(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	var MapToolsContainer = function(){
		var _this = null,
		_$js_maptools_item = null,
		_js_maptools_item_attribute = null;
		
		function _maptoolsItem() {
			_js_maptools_item_attribute = this.getAttribute('data-maptool');
			
			if(_js_maptools_item_attribute === "line") {
				_drawLine();
			}
			
			if(_js_maptools_item_attribute === "area") {
				_drawArea();
			}
			
			if(_js_maptools_item_attribute === "radio") {
				_drawRadio();
			}
		}
		
		function _drawLine() {
			//var map = L.map('basemap');
			map.on('draw:created', function (e) {
			    var type = e.layerType,
			        layer = e.layer;

			    if (type === 'marker') {
			        // Do marker specific actions
			    }

			    // Do whatever else you need to. (save to db, add to map etc)
			    map.addLayer(layer);
			});
		}
		
		function _drawArea() {
			console.log("area");
		}
		
		function _drawRadio() {
			console.log("radio");
		}
		
		return {
			restrict: 'E',
			template: '<div class="m-map-tools"><ul class="m-list m-list-maptools"><li class="m-list__item m-list-maptools__item js-maptools-item" data-maptool="line">Línea</li><li class="m-list__item m-list-maptools__item js-maptools-item" data-maptool="area">Área</li><li class="m-list__item m-list-maptools__item js-maptools-item" data-maptool="radio">Radio</li></ul></div>',
			controller: function() {
				_$js_maptools_item = angular.element(document.getElementsByClassName('js-maptools-item'));
				_$js_maptools_item.bind('click', _maptoolsItem);
			}
		};
		
	};
	
	//MapToolsContainer.$inject = ['BaseMapService'];

	angular.module('maptools', [])
		.directive('mapTools', MapToolsContainer);

}());
