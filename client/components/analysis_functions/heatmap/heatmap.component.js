(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function heatmapDirective(_, $mdDialog, $mdToast, $mdMedia, $document, $timeout, CompetenceService, HeatmapVarJsonService, BaseMapFactory, BaseMapService, Auth, $log){
		var _access_token = Auth.getToken();
		return {
			restrict: 'E',
			require: '^analysisFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-analysis-item" data-ep="heatmap" tooltip-placement="right" uib-tooltip="Mapa de calor" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-heatmap"></i>',
					'</li>',
					'<div class="m-side-panel js-heatmap-side-panel">',
						'<h3 class="m-side-panel__title">Competencia</h3>',
						'<div class="m-side-panel__actions pos-relative">',
							'<div class="m-side-panel__actions pos-relative">',
								'<div layout="row">',
									'<div layout="row" flex="40" layout-align="center center">',
										'<div flex="75">',
											'<h5 class="m-side-panel__subtitle m-side-panel__subtitle--in-locations-actions">Agregar mapa de calor</h5>',
										'</div>',
										'<div flex="25">',
											'<md-button class="md-fab md-mini md-primary" ng-click="addHeatmap()">',
												'<md-icon>add</md-icon>',
											'</md-button>',
										'</div>',
									'</div>',
									'<div layout="row" flex="60" layout-align="center center" class="m-side-panel__actions-columns">',
										'<div flex="75">',
											'<h5 class="m-side-panel__subtitle m-side-panel__subtitle--in-locations-actions">Mostrar/ocultar Capas activas</h5>',
										'</div>',
										'<div flex="25">',
											'<div class="m-side-panel__switch">',
												'<md-switch class="md-primary md-mode-A200" aria-label="all-locations" ng-model="all" ng-change="toggleGral(location)"></md-switch>',
											'</div>',
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
						'</div>',
						'<div layout="row" class="layout-align-space-around-stretch layout-row" ng-if="heatmap_list">',
							'<md-progress-circular md-diameter="70" md-mode="indeterminate"></md-progress-circular>',
						'</div>',
						'<div class="m-side-panel__list m-side-panel__list--in-competence-panel">',
							'<ul class="m-side-panel__list-content">',
								'<li class="m-side-panel__list-content__item js-heatmap-item" ng-repeat="heatmap in save_heatmap_variable_list | filter: search_competence">',
									'<div flex="10">',
										'<img ng-src="'+BaseMapFactory.API_URL+'/ws/icon?nm={{heatmap.pin_url}}&access_token='+_access_token.access_token+'" width="25"/>',
									'</div>',
									'<p flex="35" class="m-side-panel__list-content__item-single">{{heatmap.name_layer}}</p>',
									'<p flex="20" class="m-side-panel__list-content__item-single">{{heatmap.num_features}}</p>',
									'<md-switch ng-disabled="is_toggle_gral_competence" ng-model="layer" flex="10" md-no-ink aria-label="heatmap.id_layer" ng-change="turnOnOffLayerCompetence(layer, heatmap)" class="md-primary m-side-panel__list-content__item-single"></md-switch>',
									'<md-button data-id-heatmap="heatmap.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single" ng-click="zoomToCompetenceLayer(heatmap.id_layer, heatmap.name_layer)" ng-init="disabled" ng-disabled="layer === false">',
										'<md-icon>zoom_in</md-icon>',
									'</md-button>',
									'<md-button data-id-heatmap="heatmap.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single" ng-click="editLayerHeatmap($parent, heatmap, $index)">',
										'<md-icon>create</md-icon>',
									'</md-button>',
									'<md-button data-id-layer="heatmap.id_layer" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single" ng-click="removeHeatmap(heatmap, heatmap.id_layer, heatmap.name_layer, $index)">',
										'<md-icon>delete</md-icon>',
									'</md-button>',
								'</li>',
							'</ul>',
						'</div>',
					'</div>',
				'</div>'
			].join(''),
			link: function(scope, element, attr){
				var _this = null,
				_removeHeatmapItem = null,
				_thisHeatmapIsTrue = null;

				if (!scope.toggleHeatmap) {
					scope.toggleHeatmap = [];
				}
				if (!scope.heatmap_variables_selected) {
					scope.heatmap_variables_selected = [];
				}
				
				
				
				HeatmapVarJsonService.heatmapVarJsonRequest()
				.then(function(result){
					scope.currentHeatmapItems = result.data;
				}, function(error){
					console.log(error);
				});

				scope.addHeatmap = function(ev){
					$mdDialog.show({
						controller: 'AddHeatmapController',
						templateUrl: './components/analysis_functions/heatmap/add_heatmap/add-heatmap.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true,
						locals: {
							heatmap_variables: scope.currentHeatmapItems
						}
					})
					.then(function(newHeatmap) {
						if (newHeatmap.success === true) {
							CompetenceService.getCompetences({competence: '1'}).then(function(res){
								if(res.data && res.data.places){

									var lastHeatmapLayer = _.last(res.data.places, newHeatmap.count);
									if(lastHeatmapLayer) {
										_.each(lastHeatmapLayer, function(heatmapAdded, index) {
											var idHeatmaLayer = heatmapAdded.id_layer+'-'+heatmapAdded.name_layer.replace(' ','_');
											scope.heatmap_variables_selected.push(newHeatmap.selected[index]);
											scope.save_heatmap_variable_list.push(heatmapAdded);
											BaseMapFactory.addLocation({
												name: idHeatmaLayer,
												data: heatmapAdded.data,
												extend: heatmapAdded.extend
											});
										});
									}
								}
							});
						}
					}, function(failAdding) {
						if (failAdding === undefined) {

						}
					});
				}

				// scope.editLayerHeatmap = function(this_item, heatmap_item, index){
				// 	var id = heatmap_item.id_layer +'-'+ heatmap_item.name_layer.replace(' ','_');
				// 	$mdDialog.show({
				// 		controller: 'EditLayerHeatmapController',
				// 		templateUrl: './components/exploration_functions/competence/edit_competence/edit-competence.tpl.html',
				// 		parent: angular.element(document.body),
				// 		targetEvent: heatmap_item.id_layer,
				// 		clickOutsideToClose:true,
				// 		locals: {
				// 			layer_id: heatmap_item.id_layer
				// 		},
				// 	})
				// 	.then(function(updateLayer) {
				// 		if (updateLayer.success === true) {
				// 			if (updateLayer.icon) {
				// 				scope.save_heatmap_variable_list[index].pin_url = updateLayer.icon;
				// 			}
				// 			if (updateLayer.nom) {
				// 				scope.save_heatmap_variable_list[index].name_layer = updateLayer.nom;
				// 			}
				// 			_.map(scope.toggleHeatmap, function(layerOn){
				// 				if (layerOn) {
				// 					if (layerOn.competence.competence.id_layer === heatmap_item.id_layer && layerOn.competence.layer === true) {
				// 						BaseMapFactory.updateLocationID(heatmap_item.id_layer);
				// 						BaseMapFactory.addLayerIfTurnedOn(heatmap_item.id_layer);
				// 					}
				// 				}
				// 				else {
				// 					BaseMapFactory.updateLocationID(heatmap_item.id_layer);
				// 					BaseMapFactory.hideLocation(id)
				// 				}
				// 			});
				// 		}
				// 	}, function(failAdding) {
				// 		console.log(failAdding);
				// 	});
				// }

				// scope.zoomToCompetenceLayer = function(id_layer, name_layer) {
				// 	var id = id_layer +'-'+ name_layer.replace(' ','_');
				// 	BaseMapFactory.zoomLocation(id);
				// }

				// scope.turnOnOffLayerCompetence = function(layer, loc) {
				// 	_thisHeatmapIsTrue = this;
				// 	var id = loc.id_layer +'-'+ loc.name_layer.replace(' ','_');
				// 	if(scope.toggleHeatmap.indexOf(_thisHeatmapIsTrue.$index) === -1 && _thisHeatmapIsTrue.layer === true){
				// 		scope.toggleHeatmap.push({index: _thisHeatmapIsTrue.$index, competence: _thisHeatmapIsTrue, id_layer: id});
				// 	}
				// 	else{
				// 		for (var i=0; i<scope.toggleHeatmap.length; i++){
				// 			if (scope.toggleHeatmap[i].index === _thisHeatmapIsTrue.$index){
				// 				scope.toggleHeatmap.splice(i,1);
				// 				break;
				// 			}
				// 		}
				// 	}
				// 	layer === true ? BaseMapFactory.showLocation(id) : BaseMapFactory.hideLocation(id);
				// }

				scope.removeHeatmap = function(indexItem, id_layer, name, index) {
					var id = id_layer +'-'+ name.replace(' ','_');
					_removeHeatmapItem = scope.save_heatmap_variable_list.indexOf(indexItem);
					if (_removeHeatmapItem !== -1) {
						BaseMapFactory.hideLocation(id);
						scope.save_heatmap_variable_list.splice(_removeHeatmapItem, 1);
						CompetenceService.delCompetence( id_layer )
						.then(function(res){
							_deleteMessage("Se eliminó " + name);
						}, function(){
							_deleteMessage("Error al eliminar " + name + ", intente nuevamente");
						});

						for (var i=0; i<scope.toggleHeatmap.length; i++){
							if (scope.toggleHeatmap[i].index === index){
								scope.toggleHeatmap.splice(i,1);
								break;
							}
						}
					}
				}

				scope.toggleGralHeatmaps = function() {
					if(this.all_competences === true) {
						_.each(scope.toggleHeatmap, function(com){
							com.heatmap.layer = false;
							scope.is_toggle_gral_heatmap = true;
							BaseMapFactory.hideLocation(com.id_layer);
						});
					}
					else {
						_.each(scope.toggleHeatmap, function(com){
							com.heatmap.layer = true;
							scope.is_toggle_gral_heatmap = false;
							BaseMapFactory.showLocation(com.id_layer);
						});
					}
					if (scope.toggleHeatmap.length === 0) {
						scope.is_toggle_gral_heatmap = false;
					}
				}

				var _deleteMessage = function(msg) {
					$mdToast.show(
						$mdToast.simple({
							textContent: msg,
							position: 'top right',
							hideDelay: 1500,
							parent: $document[0].querySelector('.js-heatmap-side-panel'),
							autoWrap: true
						})
					);
				}
			}
		};
	}

	heatmapDirective.$inject = ['_', '$mdDialog', '$mdToast', '$mdMedia', '$document', '$timeout', 'CompetenceService', 'HeatmapVarJsonService', 'BaseMapFactory','BaseMapService', 'Auth', '$log'];

	angular.module('heatmap.directive', [])
		.directive('heatmap', heatmapDirective);
})();
