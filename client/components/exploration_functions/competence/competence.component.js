(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function componentDirective(_, $mdDialog, $mdToast, $document, $timeout, CompetenceService, BaseMapFactory, BaseMapService, Auth, $log){
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
							'<h4 class="m-side-panel__subtitle">Agregar ubicaciones de mi competencia:</h4>',
							'<div layout="row">',
								'<div layout="column" flex="50" layout-align="center center">',
									'<h6 class="m-side-panel__subtitle" style="margin:auto;">Por variable</h6>',
									'<md-button class="md-fab md-mini md-primary" ng-click="addCompetenceByVariable()">',
						        '<md-icon>format_list_bulleted</md-icon>',
						      '</md-button>',
								'</div>',
								'<div layout="column" flex="50" layout-align="center center">',
									'<h6 class="m-side-panel__subtitle" style="margin:auto;">Por capa csv</h6>',
									'<md-button class="md-fab md-mini md-primary" ng-click="addCompetenceByCsv()">',
						        '<md-icon>add</md-icon>',
						      '</md-button>',
								'</div>',
								'<div layout="column" flex="50" layout-align="center center">',
									'<h6 class="m-side-panel__subtitle" style="margin:auto;">Por nombre exacto</h6>',
									'<md-button class="md-fab md-mini md-primary" ng-click="addCompetenceByName()">',
									  '<md-icon>zoom_in</md-icon>',
									'</md-button>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="m-side-panel__search m-side-panel__search--in-competence">',
							'<div layout="row">',
								'<div flex="50" layout-align="center center">',
									'<form ng-submit="$event.preventDefault()">',
										'<md-input-container>',
											'<label>Buscar competencia</label>',
											'<input ng-model="search_competence">',
										'</md-input-container>',
									'</form>',
								'</div>',
								'<div flex="50" layout="row" layout-align="center center" class="m-side-panel__actions-columns">',
									'<div layout="row" layout-align="center center">',
										'<div flex="75">',
											'<h5 class="m-side-panel__subtitle m-side-panel__subtitle--in-locations-actions">Mostrar/ocultar Capas activas</h5>',
										'</div>',
										'<div flex="25">',
												'<md-switch class="md-primary md-mode-A200" aria-label="all-locations" ng-model="all" ng-change="toggleGralCompetences(competence)"></md-switch>',
										'</div>',
									'</div>',
									
								'</div>',
							'</div>',
						'</div>',
						'<div class="m-side-panel__list">',
							'<h4 class="m-side-panel__subtitle m-side-panel__subtitle--in-location-list">Mis ubicaciones</h4>',
							'<div class="m-side-panel__locations-container">',
								'<ul class="m-side-panel__list-titles">',
									'<div layout="row">',
										'<p flex="10" class="bold m-side-panel__list-titles__column-name">Icono</p>',
										'<p flex="35" class="bold m-side-panel__list-titles__column-name">Categoría</p>',
										'<p flex="20" class="bold m-side-panel__list-titles__column-name"># Negocios</p>',
										'<p flex="10" class="bold m-side-panel__list-titles__column-name">Acciones</p>',
										'<p flex="10" class="bold m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="bold m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="bold m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="bold m-side-panel__list-titles__column-name"></p>',
									'</div>',
								'</ul>',
								'<div layout="row" class="layout-align-space-around-stretch layout-row" ng-if="competence_list">',
									'<md-progress-circular md-diameter="70" md-mode="indeterminate"></md-progress-circular>',
								'</div>',
								'<ul class="m-side-panel__locations-list__container">',
									'<li class="m-side-panel__locations-list__list js-competence-item" ng-repeat="competence in save_competence_variable_list | filter: search_competence">',
										'<div flex="10">',
											'<img ng-src="'+BaseMapFactory.API_URL+'/ws/icon?nm={{competence.pin_url}}&access_token='+_access_token.access_token+'" width="25"/>',
										'</div>',
										'<p flex="35" class="m-side-panel__locations-list__item">{{competence.name_layer}}</p>',
										'<p flex="20" class="m-side-panel__locations-list__item">{{competence.num_features}}</p>',
										'<md-switch ng-disabled="is_toggle_gral" ng-model="layer" flex="10" md-no-ink aria-label="competence.id_layer" ng-change="turnOnOffLayerCompetence(layer, competence)" class="md-primary m-side-panel__locations-list__item"></md-switch>',
										'<md-button data-id-competence="competence.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="zoomToCompetenceLayer(competence.id_layer, competence.name_layer)" ng-init="disabled" ng-disabled="layer === false">',
											'<md-icon>zoom_in</md-icon>',
										'</md-button>',
										'<md-button data-id-competence="competence.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="editLayerCompetence($parent, competence, $index)">',
											'<md-icon>create</md-icon>',
										'</md-button>',
										'<md-button data-id-layer="competence.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="removeCompetence(competence, competence.id_layer, competence.name_layer, $index)">',
											'<md-icon>delete</md-icon>',
										'</md-button>',
									'</li>',
								'</ul>',
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

				if (!scope.toggleCompetence) {
					scope.toggleCompetence = [];
				}

				scope.addCompetenceByVariable = function(ev){
					$mdDialog.show({
						controller: 'AddCompetenceByVarController',
						templateUrl: './components/exploration_functions/competence/add_competence_by_var/add-competence-by-var.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true,
					})
					.then(function(newCompetence) {
						if (newCompetence) {
							scope.bounds = null;
							scope.nw = null;
							scope.se = null;
							scope.bbox = null;
							CompetenceService.getCompetences({competence: '1'}).then(function(res){
								console.log(res)
								// if(res.data && res.data.places){
								// 	var lastCompetenceLayer = res.data.places[res.data.places.length -1];
								// 	if(lastCompetenceLayer) {
								// 		var idCompetenceLayer = lastCompetenceLayer.id_layer+'-'+lastCompetenceLayer.name_layer.replace(' ','_');
								// 	}
									
								// 	scope.save_competence_variable_list.push(lastCompetenceLayer);
								// 	BaseMapFactory.addLocation({
								// 		name: idCompetenceLayer,
								// 		data: lastCompetenceLayer.data
								// 	});
								// }
							});
						}
					}, function(failAdding) {
						if (failAdding === undefined) {
							
						}
					});
				}

				scope.addCompetenceByCsv = function(ev){
					$mdDialog.show({
						controller: 'AddCompetenceByCsvController',
						templateUrl: './components/exploration_functions/competence/add_competence_by_csv/add-competence-by-csv.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
					.then(function(newCompetence) {
						if (newCompetence) {
							CompetenceService.getCompetences({competence: '1'}).then(function(res){
								if(res.data && res.data.places){
									var lastCompetenceLayer = res.data.places[res.data.places.length -1];
									var idCompetenceLayer = lastCompetenceLayer.id_layer+'-'+lastCompetenceLayer.name_layer.replace(' ','_');
									scope.save_competence_variable_list.push(lastCompetenceLayer);
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
				
				scope.addCompetenceByName = function(ev){
					$mdDialog.show({
						controller: 'AddCompetenceByNameController',
						templateUrl: './components/exploration_functions/competence/add_competence_by_name/add-competence-by-name.tpl.html',
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
									scope.save_competence_variable_list.push(lastCompetenceLayer);
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
				
				scope.editLayerCompetence = function(this_item, competence_item, index){
					var id = competence_item.id_layer +'-'+ competence_item.name_layer.replace(' ','_');
					$mdDialog.show({
						controller: 'EditLayerCompetenceController',
						templateUrl: './components/exploration_functions/competence/edit_competence/edit-competence.tpl.html',
						parent: angular.element(document.body),
						targetEvent: competence_item.id_layer,
						clickOutsideToClose:true,
						locals: {
							layer_id: competence_item.id_layer
						},
					})
					.then(function(updateLayer) {
						if (updateLayer.success === true) {
							console.log(scope.save_competence_variable_list[index].name_layer)
							if (updateLayer.icon) {
								scope.save_competence_variable_list[index].pin_url = updateLayer.icon;
							}
							if (updateLayer.nom) {
								scope.save_competence_variable_list[index].name_layer = updateLayer.nom;
							}
							_.map(scope.toggleCompetence, function(layerOn){
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

				scope.zoomToCompetenceLayer = function(id_layer, name_layer) {
					var id = id_layer +'-'+ name_layer.replace(' ','_');
					BaseMapFactory.zoomLocation(id);
				}

				scope.turnOnOffLayerCompetence = function(layer, loc) {
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

				scope.removeCompetence = function(indexItem, id_layer, name, index) {
					var id = id_layer +'-'+ name.replace(' ','_');
					_removeCompetenceItem = scope.save_competence_variable_list.indexOf(indexItem);
					if (_removeCompetenceItem !== -1) {
						BaseMapFactory.hideLocation(id);
						scope.save_competence_variable_list.splice(_removeCompetenceItem, 1);
						CompetenceService.delCompetence( id_layer )
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
					if(this.all_competences === true) {
						_.each(scope.toggleCompetence, function(com){
							com.competence.layer = false;
							scope.is_toggle_gral = true;
							BaseMapFactory.hideLocation(com.id_layer);
						});
					}
					else {
						_.each(scope.toggleCompetence, function(com){
							com.competence.layer = true;
							scope.is_toggle_gral = false;
							BaseMapFactory.showLocation(com.id_layer);
						});
					}
				}

				var _deleteMessage = function(msg) {
					$mdToast.show(
						$mdToast.simple({
							textContent: msg,
							position: 'top right',
							hideDelay: 1500,
							parent: $document[0].querySelector('.js-competence-side-panel'),
							autoWrap: true
						})
					);
				}
			}
		};
	}

	componentDirective.$inject = ['_', '$mdDialog', '$mdToast', '$document', '$timeout', 'CompetenceService', 'BaseMapFactory','BaseMapService', 'Auth', '$log'];

	angular.module('competence.directive', [])
		.directive('competence', componentDirective);
})();
