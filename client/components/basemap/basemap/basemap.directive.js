(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function BaseMap($rootScope, $timeout, BaseMapService){
		return {
			restrict: 'E',
			replace:true,
			scope: '=curent_zoom',
			template: [
				'<div id="basemap" class="m-basemap">',
					'<label class=" md-fab md-fab-top-right md-button md-primary" type="button" aria-label="" style="position: absolute;top: 154px;right: 0;top:initial;bottom:90px;z-index: 10;">',
						'<span id="zoom" class="bold" style="font-size:18px;"></span><div class="md-ripple-container"></div>',
					'</label>',
				'</div>',
			].join(''),
			link:function(scope, element){
				var newZoom = angular.element(document.getElementById('zoom'));
				BaseMapService.resolve(element[0]);
				BaseMapService.map.then(function(map) {
					newZoom.text(map.getZoom());
					map.on('zoomend', function(event){
						_getZoom(map.getZoom());
					});
				});
				
				function _getZoom(zoom){
					newZoom.text(zoom);
				}
				
			}
		};
	}
	
	BaseMap.$inject = ['$rootScope', '$timeout', 'BaseMapService'];

	angular.module('basemap.directive', [])
		.directive('basemap', BaseMap);
})();