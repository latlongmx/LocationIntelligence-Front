(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function odDirective(BaseMapService, BaseMapFactory, Auth, AccessibilityService, $compile){
		var cityPolygons = null,
		cityData = null,
		color_x = null;
		return {
			restrict: 'E',
			replace: true,
			require: '^panelFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-panel-item" data-ep="od" tooltip-placement="right" uib-tooltip="Origen Destino" tooltip-animation="true">',
						'<img src="./images/functions/od_icon.png" class="m-list-functions__item-icon" data-icon="od_icon"/>',
					'</li>',
					'<div class="m-side-panel js-od-side-panel">',
					'<h3 class="m-side-panel__title">Gasto Origen-Destino</h3>',
					'<div class="m-side-panel__actions pos-relative">',
						'<h4 class="m-side-panel__subtitle">Código Postal: <span>11320</span></h4>',
						'<md-divider></md-divider>',
						'<span class="m-side-panel__title-action">Información a consultar</span>',
						'<div layout="row">',
							'<div layout="column" flex="50" layout-align="center center">',
								'<h6 class="m-side-panel__subtitle" style="margin:auto;">Promedio de pago</h6>',
								'<md-button class="md-fab md-mini md-primary" ng-click="">',
									'<md-icon>format_list_bulleted</md-icon>',
								'</md-button>',
							'</div>',
							'<div layout="column" flex="50" layout-align="center center">',
								'<h6 class="m-side-panel__subtitle" style="margin:auto;">Número de pagos</h6>',
								'<md-button class="md-fab md-mini md-primary" ng-click="">',
									'<md-icon>add</md-icon>',
								'</md-button>',
							'</div>',
							'<div layout="column" flex="50" layout-align="center center">',
								'<h6 class="m-side-panel__subtitle" style="margin:auto;">Número de tarjetas por día</h6>',
								'<md-button class="md-fab md-mini md-primary" ng-click="">',
									'<md-icon>zoom_in</md-icon>',
								'</md-button>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="m-side-panel__list m-side-panel__list--in-od-panel">',
						'<gender class="m-graphic"></gender>',
						'<age class="m-graphic"></age>',
					'</div>',
				'</div>'
			].join(''),
			link: function(scope, element, attr){
			},
			controller: function($scope) {

				function onEachFeature(feature, layer) {
					// layer.on('click', function(e) {
					// 	map.removeLayer(sMarker);	
					// 	sMarker = L.marker([e.latlng.lat, e.latlng.lng], { ZipCode : feature.properties.ZipCode }).addTo(map);
					// 	sMarker.bindPopup("Código postal: " + feature.properties.ZipCode)/*.openPopup()*/;
						
					// 	getBasicStats(feature.properties.ZipCode);
					// });
				}
				
				// function _geojsonFunction(map) {
				// 	map.setView([19.4313054168727, -99.1347885131836], 12);
				// }
				
			}
		};
	}

	odDirective.$inject = ['BaseMapService', 'BaseMapFactory', 'Auth', 'AccessibilityService', '$compile'];
	angular.module('od.directive', [])
		.directive('od', odDirective);
})();
