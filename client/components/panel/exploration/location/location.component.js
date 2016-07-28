(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function locationDirective(_, $mdDialog, $mdToast, $document, $timeout,  LocationFactory, LocationService, BaseMapFactory, Auth, uiService){
		var _access_token = Auth.getToken();

		return {
			restrict: 'E',
			require: '^panelFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-panel-item" data-ep="location" tooltip-placement="right" uib-tooltip="Mis ubicaciones" tooltip-animation="true">',
						'<img src="./images/functions/locations_icon.png" class="m-list-functions__item-icon" data-icon="locations_icon"/>',
					'</li>',
					'<div class="m-side-panel js-location-side-panel">',
						'<h3 class="m-side-panel__title">Mis ubicaciones</h3>',
						'<div class="m-side-panel__actions pos-relative">',
							'<div layout="row">',
								'<div layout="row" flex="40" layout-align="center center" class="m-side-panel__actions-columns">',
									'<div flex="75">',
										'<h5 class="m-side-panel__subtitle m-side-panel__subtitle--in-locations-actions">Agregar ubicación</h5>',
									'</div>',
									'<div flex="25">',
										'<md-button class="md-fab md-mini md-primary" ng-click="addLocation()">',
											'<md-icon>add</md-icon>',
										'</md-button>',
									'</div>',
								'</div>',
								'<div layout="row" flex="60" layout-align="center center" class="m-side-panel__actions-columns">',
									'<div flex="80" layout-align="center end">',
										'<h5 class="m-side-panel__subtitle m-side-panel__subtitle--in-locations-actions">Mostrar/ocultar Capas activas</h5>',
									'</div>',
									'<div flex="20">',
										'<div layout-align="center center" >',
											'<md-switch class="md-primary md-hue-2" aria-label="all-locations" ng-model="all" ng-change="toggleGral(location)"></md-switch>',
										'</div>',
									'</div>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="m-side-panel__search">',
							'<md-input-container>',
								'<label>Buscar en mis ubicaciones</label>',
								'<input ng-model="search_location">',
							'</md-input-container>',
						'</div>',
						'<div class="m-side-panel__header">',
							'<h4 class="m-side-panel__subtitle m-side-panel__subtitle--in-location-list">Mis ubicaciones</h4>',
								'<ul class="m-side-panel__list-titles">',
									'<div layout="row">',
										'<p flex="10" class="m-side-panel__list-titles__column-name">Icono</p>',
										'<p flex="35" class="m-side-panel__list-titles__column-name">Nombre Ubicación</p>',
										'<p flex="20" class="m-side-panel__list-titles__column-name"># Sucursales</p>',
										'<p flex="10" class="m-side-panel__list-titles__column-name">Acciones</p>',
										'<p flex="10" class="m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="m-side-panel__list-titles__column-name"></p>',
									'</div>',
								'</ul>',
						'</div>',
						'<div layout="row" class="layout-align-space-around-stretch layout-row" ng-if="location_list">',
							'<md-progress-circular md-diameter="70" md-mode="indeterminate"></md-progress-circular>',
						'</div>',
						'<div class="m-side-panel__list">',
							'<ul class="m-side-panel__list-content">',
								'<li class="m-side-panel__list-content__item js-location-item" ng-repeat="location in locations | filter: search_location">',
									'<div flex="10">',
										'<img ng-src="'+BaseMapFactory.API_URL+'/ws/icon?nm={{location.pin_url}}&access_token='+_access_token.access_token+'" width="30" class="m-side-panel__list-content__item-single-img"/>',
									'</div>',
									'<p flex="35" class="m-side-panel__list-content__item-single">{{location.name_layer}}</p>',
									'<p flex="20" class="m-side-panel__list-content__item-single">{{location.num_features}}</p>',
									'<md-switch ng-disabled="is_toggle_gral" ng-model="layer" flex="10" md-no-ink aria-label="location.id_layer" ng-change="turnOnOffLayer(layer, location)" class="md-primary md-hue-1 m-side-panel__list-content__item-single"></md-switch>',
									'<md-button data-id-location="location.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single" ng-click="zoomToLocationLayer(location.id_layer, location.name_layer)" ng-init="disabled" ng-disabled="layer !== true">',
										'<md-icon>zoom_in</md-icon>',
									'</md-button>',
									'<md-button data-id-location="location.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single" ng-click="editLayerLocation($parent, location, $index)">',
										'<md-icon>create</md-icon>',
									'</md-button>',
									'<md-button data-id-layer="location.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single" ng-click="removeLocation(location, location.id_layer, location.name_layer, $index)">',
										'<md-icon>delete</md-icon>',
									'</md-button>',
								'</li>',
							'</ul>',
						'</div>',
					'</div>',
				'</div>'
			].join(''),
			link: function(scope, element, attr, parentCtrl){
				var remove_panel = angular.element(document.getElementsByClassName('js-location-side-panel'));
				var remove_exploration_item = angular.element(document.getElementsByClassName('js-exploration-item'));
				var _this = null,
				_removeLocationItem = null,
				_changeLocationIcon = null,
				_thisLocationIsTrue = null;

				if (!scope.toggleLocations) {
					scope.toggleLocations = [];
				}

				scope.addLocation = function(ev){
					$mdDialog.show({
						controller: 'AddLocationController',
						templateUrl: './components/panel/exploration/location/add_locations/add-locations.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
					.then(function(newLocations) {
						if (newLocations) {
							LocationService.getLocations().then(function(res){
								if(res.data && res.data.places){
									var lastLocationLayer = res.data.places[res.data.places.length -1];
									var idLocationLayer = lastLocationLayer.id_layer+'-'+lastLocationLayer.name_layer.replace(' ','_');
									scope.locations.push(lastLocationLayer);
									BaseMapFactory.addLocation({
										name: idLocationLayer,
										data: lastLocationLayer.data,
										extend: lastLocationLayer.extend
									});
								}
							});
						}
					}, function(failAdding) {
						console.log(failAdding);
					});
				};

				scope.editLayerLocation = function(this_item, location_item, index){
					var id = location_item.id_layer +'-'+ location_item.name_layer.replace(' ','_');
					$mdDialog.show({
						controller: 'EditLayerLocationController',
						templateUrl: './components/panel/exploration/location/edit_layer/edit-layer.location.tpl.html',
						parent: angular.element(document.body),
						targetEvent: location_item.id_layer,
						clickOutsideToClose:true,
						locals: {
							layer_id: location_item.id_layer
						},
					})
					.then(function(updateLayer) {
						if (updateLayer.success === true) {
							if (updateLayer.icon) {
								scope.locations[index].pin_url = updateLayer.icon;
							}
							if (updateLayer.nom) {
								scope.locations[index].name_layer = updateLayer.nom;
							}
							_.map(scope.toggleLocations, function(layerOn){
								if (layerOn) {
									if (layerOn.location.location.id_layer === location_item.id_layer && layerOn.location.layer === true) {
										BaseMapFactory.updateLocationID(location_item.id_layer);
										BaseMapFactory.addLayerIfTurnedOn(location_item.id_layer);
									}
								}
								else {
									BaseMapFactory.updateLocationID(location_item.id_layer);
									BaseMapFactory.hideLocation(id)
								}
							});
						}
					}, function(failAdding) {
						console.log(failAdding);
					});
				}

				scope.zoomToLocationLayer = function(id_layer, name_layer) {
					var n_l = name_layer.replace(' ','_');
					var id = id_layer +'-'+ n_l;
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

				scope.removeLocation = function(indexItem, id_layer, name, index) {
					var id = id_layer +'-'+ name.replace(' ','_');
					_removeLocationItem = scope.locations.indexOf(indexItem);
					if (_removeLocationItem !== -1) {
						BaseMapFactory.hideLocation(id);
						scope.locations.splice(_removeLocationItem, 1);
						LocationService.delLocation( id_layer )
						.then(function(res){
							_deleteMessage("Se eliminó " + name);
						}, function(){
							_deleteMessage("Error al eliminar " + name + ", intente nuevamente");
						});

						for (var i=0; i<scope.toggleLocations.length; i++){
							if (scope.toggleLocations[i].index === index){
								scope.toggleLocations.splice(i,1);
								break;
							}
						}
					}
				}

				scope.toggleGral = function() {
					scope.at_least_one = false;
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
					if (scope.toggleLocations.length === 0) {
						scope.is_toggle_gral = false;
					}
				}

				var _deleteMessage = function(msg) {
					$mdToast.show(
						$mdToast.simple({
							textContent: msg,
							position: 'top right',
							hideDelay: 1500,
							parent: $document[0].querySelector('.js-location-side-panel'),
							autoWrap: true
						})
					);
				}

			}
		};
	}

	locationDirective.$inject = ['_', '$mdDialog', '$mdToast', '$document', '$timeout', 'LocationFactory', 'LocationService', 'BaseMapFactory', 'Auth', 'uiService'];

	angular.module('location.directive', [])
		.directive('location', locationDirective);
})();
