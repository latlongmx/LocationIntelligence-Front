(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function locationDirective($mdDialog, LocationFactory, LocationService, BaseMapFactory){

		return {
			restrict: 'E',
			require: '^explorationFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="location" tooltip-placement="right" uib-tooltip="Mis ubicaciones" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-location"></i>',
					'</li>',
					'<div class="m-side-panel js-location-side-panel">',
						'<h3 class="m-side-panel__title">Mis ubicaciones</h3>',
						'<div class="m-side-panel__actions pos-relative">',
							'<div>',
								'<h5 class="m-side-panel__subtitle">Agregar ubicación</h5>',
								'<md-button class="md-fab md-mini md-primary" ng-click="addLocation()">',
									'<md-icon>add</md-icon>',
								'</md-button>',
								'<h5 class="m-side-panel__subtitle">Listar ubicaciones</h5>',
								'<md-button class="md-fab md-mini md-primary" ng-click="getListLocations()">',
									'<md-icon>get_app</md-icon>',
								'</md-button>',
								'<div class="m-side-panel__switch">',
									'<md-switch class="md-primary md-mode-A200" aria-label="all-locations"></md-switch>',
								'</div>',
							'</div>',
							'<div class="m-side-panel__search">',
								'<md-input-container>',
									'<label>Buscar en mis ubicaciones</label>',
									'<input ng-model="search_location">',
								'</md-input-container>',
							'</div>',
							'<div class="m-side-panel__locations">',
								'<h4 class="m-side-panel__subtitle">Mis ubicaciones</h4>',
								'<div class="m-side-panel__locations-container">',
									'<ul class="m-side-panel__locations-list__container-titles">',
										'<li class="m-side-panel__locations-list__list">',
											'<p flex="10" class="m-side-panel__locations-list__item bold">Icono</p>',
											'<p flex="45" class="m-side-panel__locations-list__item bold">Categoría</p>',
											'<p flex="20" class="m-side-panel__locations-list__item bold"># Sucursales</p>',
											'<p flex="10" class="m-side-panel__locations-list__item bold">Visualizar</p>',
											'<p flex="10" class="m-side-panel__locations-list__item bold"></p>',
										'</li>',
									'</ul>',
									'<ul class="m-side-panel__locations-list__container">',
										'<li class="m-side-panel__locations-list__list js-location-item" ng-repeat="location in locations | filter: search_location">',
											'<md-icon flex="10" class="m-side-panel__locations-list__item m-side-panel__locations-list__item__add js-add-icon-location" id="{{location.id_layer}}" ng-click="addIconLocation(location.id_ubicacion)">{{new_icon}}</md-icon>',
											'<p flex="45" class="m-side-panel__locations-list__item">{{location.name_layer}}</p>',
											'<p flex="20" class="m-side-panel__locations-list__item">{{location.data.length}}</p>',
											'<md-switch ng-model="layer" flex="10" md-no-ink aria-label="location.id_layer" ng-change="turnOnOffLayer(layer, location.id_layer, location.name_layer)" class="md-primary m-side-panel__locations-list__item" aria-label=""></md-switch>',
											'<md-button data-id-location="location.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="zoomToLayer(location.id_layer, location.name_layer)" ng-init="disabled" ng-disabled="layer === false">',
												'<md-icon>zoom_in</md-icon>',
											'</md-button>',
											'<md-button data-id-location="location.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="removeLocation(location, location.id_layer, location.name_layer)">',
												'<md-icon>delete</md-icon>',
											'</md-button>',
											'<md-divider></md-divider>',
										'</li>',
										
									'</ul>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			].join(''),
			link: function(scope, element, attr){
				var _this = null,
				_removeLocationItem = null,
				_changeLocationIcon = null;
				scope.fileObj = {};
				scope.new_icon = "add";
				scope.layer = false;

				scope.addLocation = function(ev){
					$mdDialog.show({
						controller: 'AddLocationController',
						templateUrl: './components/exploration_functions/location/add-locations.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
					.then(function(newLocations) {
						if (newLocations === true) {
							
							LocationService.getLocations().then(function(res){
								if(res.data && res.data.places){
									scope.locations = res.data.places;
									_.each(res.data.places,function(o){
										var id = o.id_layer+'-'+o.name_layer.replace(' ','_');
										BaseMapFactory.addLocation({
											name: id,
											data: o.data
										});
									});
								}
							});
						}
					}, function(failAdding) {
						console.log(failAdding);
					});
				}
				
				scope.getListLocations = function() {
					LocationService.getLocations().then(function(res){
						if(res.data && res.data.places){
							scope.locations = res.data.places;
							_.each(res.data.places,function(o){
								var id = o.id_layer+'-'+o.name_layer.replace(' ','_');
								BaseMapFactory.addLocation({
									name: id,
									data: o.data
								});
							});
						}
					});
				}
				
				scope.addIconLocation = function(ev) {
					$mdDialog.show({
						controller: 'AddIconLocationController',
						templateUrl: './components/exploration_functions/location/add_icon/add-icon-location.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
					.then(function(newIcon) {
						_changeLocationIcon = angular.element(document.getElementById(ev));
						console.log(_changeLocationIcon)
						_changeLocationIcon[0].textContent = newIcon;
						
					}, function(failAddingIcon) {
						console.log(failAddingIcon)
					});
				}
				
				scope.zoomToLayer = function(id_layer, name_layer) {
					var id = id_layer +'-'+ name_layer.replace(' ','_');
					BaseMapFactory.zoomLocation(id);
				}
				
				scope.turnOnOffLayer = function(layer, id_layer, name_layer) {
					var id = id_layer +'-'+ name_layer.replace(' ','_');
					layer === true ? BaseMapFactory.showLocation(id) : BaseMapFactory.hideLocation(id);
				}
				
				scope.removeLocation = function(indexItem, id_layer, name_layer) {
					var id = id_layer +'-'+ name_layer.replace(' ','_');
					_removeLocationItem = scope.locations.indexOf(indexItem);
					if (_removeLocationItem !== -1) {
						scope.locations.splice(_removeLocationItem, 1);
						LocationService.delLocation( id )
						.then(function(res){
							console.log(res);
						});
					}
				}
			}
		};
	}

	locationDirective.$inject = ['$mdDialog','LocationFactory', 'LocationService', 'BaseMapFactory'];

	angular.module('location.directive', [])
		.directive('location', locationDirective);
})();
