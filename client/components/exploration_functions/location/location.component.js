(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function locationDirective(_, $mdDialog, $mdToast, $document, $timeout,  LocationFactory, LocationService, BaseMapFactory, Auth){
		var _access_token = Auth.getToken();

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
									'<ul class="m-side-panel__list-titles">',
									'<div layout="row">',
										'<p flex="10" class="bold m-side-panel__list-titles__column-name">Icono</p>',
										'<p flex="35" class="bold m-side-panel__list-titles__column-name">Categoría</p>',
										'<p flex="20" class="bold m-side-panel__list-titles__column-name"># Sucursales</p>',
										'<p flex="10" class="bold m-side-panel__list-titles__column-name">Acciones</p>',
										'<p flex="10" class="bold m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="bold m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="bold m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="bold m-side-panel__list-titles__column-name"></p>',
									'</div>',
									'<div layout="row" class="layout-align-space-around-stretch layout-row" ng-if="location_list">',
										'<md-progress-circular md-diameter="70" md-mode="indeterminate"></md-progress-circular>',
									'</div>',
									'<ul class="m-side-panel__locations-list__container">',
										'<li class="m-side-panel__locations-list__list js-location-item" ng-repeat="location in locations | filter: search_location">',
											'<div flex="10">',
												'<img ng-src="'+BaseMapFactory.API_URL+'/ws/icon?nm={{location.data[0].pin_url}}&access_token='+_access_token.access_token+'" width="25"/>',
											'</div>',
											'<p flex="35" class="m-side-panel__locations-list__item">{{location.name_layer}}</p>',
											'<p flex="20" class="m-side-panel__locations-list__item">{{location.data.length}}</p>',
											'<md-switch ng-disabled="is_toggle_gral" ng-model="layer" flex="10" md-no-ink aria-label="location.id_layer" ng-change="turnOnOffLayer(layer, location)" class="md-primary m-side-panel__locations-list__item"></md-switch>',
											'<md-button data-id-location="location.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="zoomToLayer(location.id_layer, location.name_layer)" ng-init="disabled" ng-disabled="layer === false">',
												'<md-icon>zoom_in</md-icon>',
											'</md-button>',
											'<md-button data-id-location="location.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="editLayerLocation($parent, location)">',
												'<md-icon>create</md-icon>',
											'</md-button>',
											'<md-button data-id-layer="location.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="removeLocation(location, location.id_layer, location.name_layer, $index)">',
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
						templateUrl: './components/exploration_functions/location/add_locations/add-locations.tpl.html',
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
										data: lastLocationLayer.data
									});
								}
							});
						}
					}, function(failAdding) {
						console.log(failAdding);
					});
				}

				scope.editLayerLocation = function(this_item, location_item){
					var id = location_item.id_layer +'-'+ location_item.name_layer.replace(' ','_');
					$mdDialog.show({
						controller: 'EditLayerLocationController',
						templateUrl: './components/exploration_functions/location/edit_layer/edit-layer.location.tpl.html',
						parent: angular.element(document.body),
						targetEvent: location_item.id_layer,
						clickOutsideToClose:true,
						locals: {
							layer_id: location_item.id_layer
						},
					})
					.then(function(updateLayer) {
						if (updateLayer == true) {
							_.map(scope.toggleLocations, function(layerOn){
								if (layerOn.location.location.id_layer === location_item.id_layer && layerOn.location.layer === true) {
									BaseMapFactory.updateLocationID(location_item.id_layer);
								}
								if (layerOn.location.location.id_layer === location_item.id_layer && !layerOn.location.layer) {
									BaseMapFactory.updateLocationID(location_item.id_layer);
									BaseMapFactory.hideLocation(id)
								}

							});
						}
					}, function(failAdding) {
						console.log(failAdding);
					});
				}

				scope.zoomToLayer = function(id_layer, name_layer) {
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

	locationDirective.$inject = ['_', '$mdDialog', '$mdToast', '$document', '$timeout', 'LocationFactory', 'LocationService', 'BaseMapFactory', 'Auth'];

	angular.module('location.directive', [])
		.directive('location', locationDirective);
})();
