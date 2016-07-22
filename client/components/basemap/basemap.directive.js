(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function BaseMap($rootScope, $timeout, BaseMapService, Auth, uiService){
		return {
			restrict: 'E',
			replace:true,
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
					/* Update zoom */
					newZoom.text(map.getZoom());
					
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
					map.on('zoomend', function(event){
						_getZoom(map.getZoom());
					});

					/**
					 * [description]
					 * @param  {[type]} [Map events when user clicks or dragstart]
					 * @return {[type]} [Service to hide panel]
					 */
					map.on('click dragstart', function(){
						uiService.changeCurrentPanel(true);
					});
				});

			}
		};
	}
	
	BaseMap.$inject = ['$rootScope', '$timeout', 'BaseMapService', 'Auth', 'uiService'];

	angular.module('basemap.directive', [])
		.directive('basemap', BaseMap);
})();