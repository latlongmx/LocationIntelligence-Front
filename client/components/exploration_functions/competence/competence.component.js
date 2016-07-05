(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function componentDirective(_, $mdDialog, $mdToast, $document, $timeout,  LocationFactory, LocationService, BaseMapFactory, BaseMapService, Auth, $log){
		var _access_token = Auth.getToken();
LocationService.delLocation( 393 )
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
						'<div>',
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
						'<div>',
							'<div class="m-side-panel__list" style="padding: 0px 15px 15px;">',
								'<h4 class="m-side-panel__subtitle">Competencias</h4>',
								'<div class="m-side-panel__locations-container">',
									'<div layout="row" layout-align="center center">',
										'<div layout="row" layout-align="start center" flex="75">',
											'<div class="m-side-panel__search m-side-panel__search--in-competence">',
												'<form ng-submit="$event.preventDefault()">',
													'<md-input-container>',
														'<label>Buscar competencia</label>',
														'<input ng-model="search_competence">',
													'</md-input-container>',
												'</form>',
											'</div>',
										'</div>',
										'<div layout="row" layout-align="end center" flex="25">',
											'<div>',
												'<md-switch class="md-primary md-mode-A200" aria-label="all_competences" ng-model="all_competences" ng-change="competenceToggleGral(competence)"></md-switch>',
											'</div>',
										'</div>',
									'</div>',
									'<div layout="row" class="m-side-panel__list-titles">',
										'<p flex="10" class="bold m-side-panel__list-titles__column-name">Icono</p>',
										'<p flex="35" class="bold m-side-panel__list-titles__column-name">Categoría</p>',
										'<p flex="20" class="bold m-side-panel__list-titles__column-name"># Negocios</p>',
										'<p flex="10" class="bold m-side-panel__list-titles__column-name">Acciones</p>',
										'<p flex="10" class="bold m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="bold m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="bold m-side-panel__list-titles__column-name"></p>',
										'<p flex="5" class="bold m-side-panel__list-titles__column-name"></p>',
									'</div>',
								'</div>',
								'<div layout="row" class="layout-align-space-around-stretch layout-row" ng-if="competence_list">',
									'<md-progress-circular md-diameter="70" md-mode="indeterminate"></md-progress-circular>',
								'</div>',
							'</div>',
						'</div>',
						'<div>',
							'<div class="m-side-panel__body" style="height: 300px;">',
								'<ul class="m-side-panel__locations-list__container">',
									'<li class="m-side-panel__locations-list__list js-competence-item" ng-repeat="competence in save_competence_variable_list | filter: search_location">',
										'<div flex="10">',
											'<img ng-src="'+BaseMapFactory.API_URL+'/ws/icon?nm={{competence.data[0].pin_url}}&access_token='+_access_token.access_token+'" width="25"/>',
										'</div>',
										'<p flex="35" class="m-side-panel__locations-list__item">{{competence.name_layer}}</p>',
										'<p flex="20" class="m-side-panel__locations-list__item">{{competence.data.length}}</p>',
										'<md-switch ng-disabled="is_toggle_gral" ng-model="layer" flex="10" md-no-ink aria-label="competence.id_layer" ng-change="turnOnOffLayerCompetence(layer, competence)" class="md-primary m-side-panel__locations-list__item"></md-switch>',
										'<md-button data-id-competence="competence.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="zoomToLayer(competence.id_layer, competence.name_layer)" ng-init="disabled" ng-disabled="layer === false">',
											'<md-icon>zoom_in</md-icon>',
										'</md-button>',
										'<md-button data-id-competence="competence.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="editLayerLocation(competence.id_layer)">',
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
						console.log(newCompetence)
						if (newCompetence) {
							scope.bounds = null;
							scope.nw = null;
							scope.se = null;
							scope.bbox = null;
							LocationService.getLocations({competence: '1'}).then(function(res){
								if(res.data && res.data.places){
									var lastCompetenceLayer = res.data.places[res.data.places.length -1];
									if(lastCompetenceLayer) {
										var idCompetenceLayer = lastCompetenceLayer.id_layer+'-'+lastCompetenceLayer.name_layer.replace(' ','_');
									}
									
									scope.save_competence_variable_list.push(lastCompetenceLayer);
									BaseMapFactory.addLocation({
										name: idCompetenceLayer,
										data: lastCompetenceLayer.data
									});
								}
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
						console.log(newCompetence)
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
				
				scope.addCompetenceByName = function(ev){
					$mdDialog.show({
						controller: 'AddCompetenceByNameController',
						templateUrl: './components/exploration_functions/competence/add_competence_by_name/add-competence-by-name.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
					.then(function(newCompetence) {
						console.log(newCompetence)
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
				
				// scope.editLayerCompetence = function(layer){
				// 	$mdDialog.show({
				// 		controller: 'EditLayerCompetenceController',
				// 		templateUrl: './components/exploration_functions/location/edit_layer/edit-layer.competence.tpl.html',
				// 		parent: angular.element(document.body),
				// 		targetEvent: layer,
				// 		clickOutsideToClose:true,
				// 		locals: {
				// 			layer_id: layer
				// 		},
				// 	})
				// 	.then(function(newLocations) {
				// 		console.log(newLocations)
				// 		// if (newLocations) {
				// 		// 	LocationService.getLocations().then(function(res){
				// 		// 		if(res.data && res.data.places){
				// 		// 			var lastLayer = res.data.places[res.data.places.length -1];
				// 		// 			var idLayer = lastLayer.id_layer+'-'+lastLayer.name_layer.replace(' ','_');
				// 		// 			scope.competences.push(lastLayer);
				// 		// 			BaseMapFactory.addLocation({
				// 		// 				name: idLayer,
				// 		// 				data: lastLayer.data
				// 		// 			});
				// 		// 		}
				// 		// 	});
				// 		//}
				// 	}, function(failAdding) {
				// 		console.log(failAdding);
				// 	});
				// }

				scope.zoomToLayer = function(id_layer, name_layer) {
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
					console.log(scope.toggleCompetence)
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

	componentDirective.$inject = ['_', '$mdDialog', '$mdToast', '$document', '$timeout', 'LocationFactory', 'LocationService', 'BaseMapFactory','BaseMapService', 'Auth', '$log'];

	angular.module('competence.directive', [])
		.directive('competence', componentDirective);
})();
