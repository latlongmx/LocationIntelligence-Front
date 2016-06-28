(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function componentDirective(_, $mdDialog, $mdToast, $document, $timeout,  LocationFactory, LocationService, BaseMapFactory, BaseMapService, Auth, $log){
		var _access_token = Auth.getToken();

		return {
			restrict: 'E',
			require: '^explorationFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="competence" tooltip-placement="right" uib-tooltip="Mis competencias" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-competence"></i>',
					'</li>',
					'<div class="m-side-panel js-competence-side-panel">',
						'<h3 class="m-side-panel__title">Competencia</h3>',
						'<div class="m-side-panel__actions pos-relative">',
							'<div>',
								'<h5 class="m-side-panel__subtitle">Agregar competencia</h5>',
								'<md-button class="md-fab md-mini md-primary" ng-click="addCompetence()">',
									'<md-icon>add</md-icon>',
								'</md-button>',
								'<div class="m-side-panel__switch">',
									'<md-switch class="md-primary md-mode-A200" aria-label="all-competences" ng-model="all" ng-change="competenceToggleGral(competence)"></md-switch>',
								'</div>',
							'</div>',
							'<div class="m-side-panel__search">',
								'<form ng-submit="$event.preventDefault()">',
									'<md-input-container>',
										'<label>Buscar competencia</label>',
										'<input ng-model="search_competence">',
									'</md-input-container>',
								'</form>',
							'</div>',
							'<div class="m-side-panel__locations">',
								'<h4 class="m-side-panel__subtitle">Competencias</h4>',
								'<div class="m-side-panel__locations-container">',
									'<ul class="m-side-panel__locations-list__container-titles">',
									'<div layout="row">',
										'<p flex="10" class="bold">Icono</p>',
										'<p flex="35" class="bold">Categoría</p>',
										'<p flex="20" class="bold"># Negocios</p>',
										'<p flex="10" class="bold">Acciones</p>',
										'<p flex="10" class="bold"></p>',
										'<p flex="5" class="bold"></p>',
										'<p flex="5" class="bold"></p>',
									'</div>',
									'<div layout="row" class="layout-align-space-around-stretch layout-row" ng-if="competence_list">',
										'<md-progress-circular md-diameter="70" md-mode="indeterminate"></md-progress-circular>',
									'</div>',
									'<ul class="m-side-panel__locations-list__container">',
										'<li class="m-side-panel__locations-list__list js-location-item" ng-repeat="competence in competences | filter: search_location">',
											'<div flex="10">',
												'<img ng-src="'+BaseMapFactory.API_URL+'/ws/icon?nm={{competence.data[0].pin_url}}&access_token='+_access_token.access_token+'" width="25"/>',
											'</div>',
											'<p flex="35" class="m-side-panel__locations-list__item">{{competence.name_layer}}</p>',
											'<p flex="20" class="m-side-panel__locations-list__item">{{competence.data.length}}</p>',
											'<md-switch ng-disabled="is_toggle_gral" ng-model="layer" flex="10" md-no-ink aria-label="competence.id_layer" ng-change="turnOnOffLayer(layer, competence)" class="md-primary m-side-panel__locations-list__item"></md-switch>',
											'<md-button data-id-competence="competence.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="zoomToLayer(competence.id_layer, competence.name_layer)" ng-init="disabled" ng-disabled="layer === false">',
												'<md-icon>zoom_in</md-icon>',
											'</md-button>',
											'<md-button data-id-competence="competence.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="editLayerLocation(competence.id_layer)">',
												'<md-icon>create</md-icon>',
											'</md-button>',
											'<md-button data-id-layer="competence.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="removeLocation(competence, competence.id_layer, competence.name_layer, $index)">',
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
			link: function(scope, element, attr){
				var _this = null,
				_removeCompetenceItem = null,
				_changeLocationIcon = null,
				_thisCompetenceIsTrue = null;

				scope.querySearch = function(query) {
					BaseMapService.map.then(function (map) {
						var bounds = map.getBounds();
						var nw = bounds.getNorthWest();
						var se = bounds.getSouthEast();
						var bbox = [nw.lng, se.lat, se.lng, nw.lat].join(',');

						BaseMapService.addCompetenciaQuery({
							qf: query,  /* <--- query a buscar  */
							qb: bbox,  /* <--- bbox del mapa para sacar la entidad que esta visualizando*/
							competence:"1",
							nm: 'Competencia - Testing'  // Nombre del layer
						})
						.then(function(result){
							if (result) {
								LocationService.getLocations({competence: '1'}).then(function(res){
									if(res.data && res.data.places){
										var lastCompetenceLayer = res.data.places[res.data.places.length -1];
										var idCompetenceLayer = lastCompetenceLayer.id_layer+'-'+lastCompetenceLayer.name_layer.replace(' ','_');
										scope.competences.push(lastCompetenceLayer);
										BaseMapFactory.addLocation({
											name: idCompetenceLayer,
											data: lastCompetenceLayer.data
										});
									}
								});
							}
						}, function(error){
							console.log(error);
						});
					});
				}


				if (!scope.toggleCompetence) {
					scope.toggleCompetence = [];
				}

				scope.addCompetence = function(ev){
					$mdDialog.show({
						controller: 'AddCompetenceController',
						templateUrl: './components/exploration_functions/competence/add_competence/add-competence.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
					.then(function(newCompetence) {
						if (newCompetence) {
							LocationService.getLocations({competence: '1'}).then(function(res){
								if(res.data && res.data.places){
									var lastCompetenceLayer = res.data.places[res.data.places.length -1];
									var idCompetenceLayer = lastCompetenceLayer.id_layer+'-'+lastCompetenceLayer.name_layer.replace(' ','_');
									scope.competences.push(lastCompetenceLayer);
									BaseMapFactory.addLocation({
										name: idCompetenceLayer,
										data: lastCompetenceLayer.data
									});
								}
							});
						}
					}, function(failAdding) {
						console.log(failAdding);
					});
				}
				
				scope.editLayerCompetence = function(layer){
					$mdDialog.show({
						controller: 'EditLayerCompetenceController',
						templateUrl: './components/exploration_functions/location/edit_layer/edit-layer.competence.tpl.html',
						parent: angular.element(document.body),
						targetEvent: layer,
						clickOutsideToClose:true,
						locals: {
							layer_id: layer
						},
					})
					.then(function(newLocations) {
						console.log(newLocations)
						// if (newLocations) {
						// 	LocationService.getLocations().then(function(res){
						// 		if(res.data && res.data.places){
						// 			var lastLayer = res.data.places[res.data.places.length -1];
						// 			var idLayer = lastLayer.id_layer+'-'+lastLayer.name_layer.replace(' ','_');
						// 			scope.competences.push(lastLayer);
						// 			BaseMapFactory.addLocation({
						// 				name: idLayer,
						// 				data: lastLayer.data
						// 			});
						// 		}
						// 	});
						//}
					}, function(failAdding) {
						console.log(failAdding);
					});
				}

				scope.zoomToLayer = function(id_layer, name_layer) {
					var id = id_layer +'-'+ name_layer.replace(' ','_');
					BaseMapFactory.zoomLocation(id);
				}

				scope.turnOnOffLayer = function(layer, loc) {
					_thisCompetenceIsTrue = this;
					var id = loc.id_layer +'-'+ loc.name_layer.replace(' ','_');
					if(scope.toggleCompetence.indexOf(_thisCompetenceIsTrue.$index) === -1 && _thisCompetenceIsTrue.layer === true){
						scope.toggleCompetence.push({index: _thisCompetenceIsTrue.$index, competence: _thisCompetenceIsTrue, id_layer: id});
					}
					else{
						for (var i=0; i<scope.toggleCompetence.length; i++){
							if (scope.toggleCompetence[i].index === _thisCompetenceIsTrue.$index){
								scope.toggleCompetence.splice(i,1);
								break;
							}
						}
					}
					layer === true ? BaseMapFactory.showLocation(id) : BaseMapFactory.hideLocation(id);
				}

				scope.removeLocation = function(indexItem, id_layer, name, index) {
					var id = id_layer +'-'+ name.replace(' ','_');
					_removeCompetenceItem = scope.competences.indexOf(indexItem);
					if (_removeCompetenceItem !== -1) {
						BaseMapFactory.hideLocation(id);
						scope.competences.splice(_removeCompetenceItem, 1);
						LocationService.delLocation( id_layer )
						.then(function(res){
							_deleteMessage("Se eliminó " + name);
						}, function(){
							_deleteMessage("Error al eliminar " + name + ", intente nuevamente");
						});

						for (var i=0; i<scope.toggleCompetence.length; i++){
							if (scope.toggleCompetence[i].index === index){
								scope.toggleCompetence.splice(i,1);
								break;
							}
						}
					}
				}

				scope.competenceToggleGral = function() {
					if (scope.toggleCompetence.length === 0) {
						scope.is_toggle_gral = false;
					}
					if(this.all === true) {
						_.each(scope.toggleCompetence, function(loc){
							loc.location.layer = false;
							scope.is_toggle_gral = true;
							BaseMapFactory.hideLocation(loc.id_layer);
						});
					}
					else {
						_.each(scope.toggleCompetence, function(loc){
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
							parent: $document[0].querySelector('.js-location-side-panel'),
							autoWrap: true
						})
					);
				}
			}
		};
	}

	componentDirective.$inject = ['_', '$mdDialog', '$mdToast', '$document', '$timeout', 'LocationFactory', 'LocationService', 'BaseMapFactory','BaseMapService', 'Auth', '$log'];

	angular.module('competence.directive', [])
		.directive('competence', componentDirective);
})();
