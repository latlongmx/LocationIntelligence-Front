(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function locationDirective(_, $mdDialog, $mdToast, $document, $timeout,  LocationFactory, LocationService, BaseMapFactory){

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
								'<div class="m-side-panel__switch">',
									'<md-switch class="md-primary md-mode-A200" aria-label="all-locations" ng-model="all" ng-change="toggleGral(location)"></md-switch>',
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
									'<div layout="row">',
										'<p flex="10" class="bold">Icono</p>',
										'<p flex="45" class="bold">Categoría</p>',
										'<p flex="20" class="bold"># Sucursales</p>',
										'<p flex="10" class="bold">Visualizar</p>',
										'<p flex="10" class="bold"></p>',
										'<p flex="10" class="bold"></p>',
									'</div>',
									'<div layout="row" layout-sm="column" layout-align="space-around" ng-if="location_list">',
										'<md-progress-circular md-mode="indeterminate"></md-progress-circular>',
									'</div>',
									'<ul class="m-side-panel__locations-list__container">',
										'<li class="m-side-panel__locations-list__list js-location-item" ng-repeat="location in locations | filter: search_location">',
											'<md-icon flex="10" class="m-side-panel__locations-list__item m-side-panel__locations-list__item__add js-add-icon-location" id="{{location.id_layer}}" ng-click="addIconLocation(location.id_ubicacion)">{{new_icon}}</md-icon>',
											'<p flex="45" class="m-side-panel__locations-list__item">{{location.name_layer}}</p>',
											'<p flex="20" class="m-side-panel__locations-list__item">{{location.data.length}}</p>',
											'<md-switch ng-disabled="is_toggle_gral" ng-model="layer" flex="10" md-no-ink aria-label="location.id_layer" ng-change="turnOnOffLayer(layer, location)" class="md-primary m-side-panel__locations-list__item"></md-switch>',
											'<md-button data-id-location="location.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="zoomToLayer(location.id_layer, location.name_layer)" ng-init="disabled" ng-disabled="layer === false">',
												'<md-icon>zoom_in</md-icon>',
											'</md-button>',
											'<md-button data-id-location="location.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="removeLocation(location, location.id_layer, location.name_layer)">',
												'<md-icon>delete</md-icon>',
											'</md-button>',
										'</li>',
									'</ul>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>'
			].join(''),
			link: function(scope, element, attr, parentCtrl){
				var _this = null,
				_removeLocationItem = null,
				_changeLocationIcon = null,
				_thisLocationIsTrue = null;
				scope.fileObj = {};
				scope.new_icon = "add";
				scope.layer = false;
				
				if (!scope.toggleLocations) {
					scope.toggleLocations = [];
				}

				scope.addLocation = function(ev){
					$mdDialog.show({
						controller: 'AddLocationController',
						templateUrl: './components/exploration_functions/location/add-locations.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
					.then(function(newLocations) {
						if (newLocations) {
							LocationService.getLocations().then(function(res){
								if(res.data && res.data.places){
									var lastLayer = res.data.places[res.data.places.length -1];
									var idLayer = lastLayer.id_layer+'-'+lastLayer.name_layer.replace(' ','_');
									scope.locations.push(lastLayer);
									BaseMapFactory.addLocation({
										name: idLayer,
										data: lastLayer.data
									});
								}
							});
						}
					}, function(failAdding) {
						console.log(failAdding);
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
				
				scope.turnOnOffLayer = function(layer, loc) {
					_thisLocationIsTrue = this;
					var id = loc.id_layer +'-'+ loc.name_layer.replace(' ','_');
					if(scope.toggleLocations.indexOf(_thisLocationIsTrue.$index) === -1 && _thisLocationIsTrue.layer === true){
						scope.toggleLocations.push({index: _thisLocationIsTrue.$index, location: _thisLocationIsTrue, id_layer: id});
					}
					else{
						for (var i=0; i<scope.toggleLocations.length; i++){
							if (scope.toggleLocations[i].index === _thisLocationIsTrue.$index){
								scope.toggleLocations.splice(i,1);
								break;
							}
						}
					}
					layer === true ? BaseMapFactory.showLocation(id) : BaseMapFactory.hideLocation(id);
				}

				scope.removeLocation = function(indexItem, id_layer, name) {
					var id = id_layer +'-'+ name.replace(' ','_');
					_removeLocationItem = scope.locations.indexOf(indexItem);
					if (_removeLocationItem !== -1) {
						BaseMapFactory.hideLocation(id);
						
						//$timeout(function(){
							scope.locations.splice(_removeLocationItem, 1);
							LocationService.delLocation( id_layer )
							.then(function(res){
								_deleteMessage("Se eliminó " + name);
							}, function(){
								_deleteMessage("Error al eliminar " + name + ", intente nuevamente");
							});
						//}, 1500);

					}
				}
				
				scope.toggleGral = function() {
					if(this.all === true) {
						_.each(scope.toggleLocations, function(loc){
							loc.location.layer = false;
							scope.is_toggle_gral = true;
							BaseMapFactory.hideLocation(loc.id_layer);
						});
					}
					else {
						_.each(scope.toggleLocations, function(loc){
							loc.location.layer = true;
							scope.is_toggle_gral = false;
							BaseMapFactory.showLocation(loc.id_layer);
						});
					}
				}
				
				var _deleteMessage = function(msg) {
					$mdToast.show(
						$mdToast.simple({
							textContent: msg,
							position: 'top right',
							hideDelay: 1500,
							parent: $document[0].querySelector('.m-side-panel__locations'),
							autoWrap: true
						})
					);
				}
			}
		};
	}

	locationDirective.$inject = ['_', '$mdDialog', '$mdToast', '$document', '$timeout', 'LocationFactory', 'LocationService', 'BaseMapFactory'];

	angular.module('location.directive', [])
		.directive('location', locationDirective);
})();
