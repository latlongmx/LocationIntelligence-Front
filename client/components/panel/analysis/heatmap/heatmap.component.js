(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function heatmapDirective(_, $mdDialog, $mdToast, $mdMedia, $document, $timeout, CompetenceService, HeatmapVarJsonService, BaseMapFactory, BaseMapService, Auth, $log){
		var _access_token = Auth.getToken();
		return {
			restrict: 'E',
			require: '^panelFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-panel-item" data-ep="heatmap" tooltip-placement="right" uib-tooltip="Mapa de calor" tooltip-animation="true">',
						'<img src="./images/functions/heatmap_icon.png" class="m-list-functions__item-icon" data-icon="heatmap_icon"/>',
					'</li>',
					'<div class="m-side-panel js-heatmap-side-panel">',
						'<h3 class="m-side-panel__title">Mapas de calor</h3>',
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
							'</div>',
						'</div>',
						'<div class="m-side-panel__search">',
							'<md-input-container>',
								'<label>Buscar mapa de calor</label>',
								'<input ng-model="search_heatmap">',
							'</md-input-container>',
						'</div>',
						'<div class="m-side-panel__panel_one">',
							'<div class="m-side-panel__header">',
								'<h4 class="m-side-panel__subtitle m-side-panel__subtitle--in-location-list">Categorias populares</h4>',
								'<ul class="m-side-panel__list-titles">',
									'<div layout="row">',
										'<p flex="10" class="bold m-side-panel__list-titles__column-name">Icono</p>',
										'<p flex="75" class="bold m-side-panel__list-titles__column-name">Categoría</p>',
										'<p flex class="bold m-side-panel__list-titles__column-name">Acciones</p>',
									'</div>',
								'</ul>',
							'</div>',
							'<div class="m-side-panel__list m-side-panel__list--in-heatmap-panel-predefined">',
								'<ul class="m-side-panel__list-content">',
									'<li class="m-side-panel__list-content__item js-heatmap-item" ng-repeat="predefined in predefinedCategories ">',
										'<div flex="10">',
											'<i class="{{predefined.icon}}" style="padding:7px;"></i>',
											// '<img ng-src="" width="25" class="m-side-panel__list-content__item-single-img m-side-panel__list-content__item-single-img--in-predefined-heatmap-panel"/>',
										'</div>',
										'<p flex="75" class="m-side-panel__list-content__item-single">{{predefined.name_layer}}</p>',
										'<md-switch flex ng-disabled="is_toggle_gral_heatmap" ng-model="predefined.$index" md-no-ink aria-label="predefined-id_layer" ng-change="variableHeatmapShowed($parent, $index)" class="md-primary m-side-panel__list-content__item-single"></md-switch>',
									'</li>',
								'</ul>',
							'</div>',
						'</div>',
						'<div layout="row" class="layout-align-space-around-stretch layout-row" ng-if="heatmap_list">',
							'<md-progress-circular md-diameter="70" md-mode="indeterminate"></md-progress-circular>',
						'</div>',
						'<div class="m-side-panel__panel_two">',
							'<div class="m-side-panel__header">',
								'<h4 class="m-side-panel__subtitle m-side-panel__subtitle--in-location-list">Mis categorías</h4>',
								'<ul class="m-side-panel__list-titles">',
									'<div layout="row">',
										'<p flex="55" class="bold m-side-panel__list-titles__column-name">Categoría</p>',
										'<p flex="20" class="bold m-side-panel__list-titles__column-name">Tipo</p>',
										'<p flex class="bold m-side-panel__list-titles__column-name">Acciones</p>',
									'</div>',
								'</ul>',
							'</div>',
							'<div class="m-side-panel__list m-side-panel__list--in-heatmap-panel-custom">',
								'<ul class="m-side-panel__list-content">',
									'<li class="m-side-panel__list-content__item js-heatmap-item" ng-repeat="heatmap in save_heatmap_variable_list | filter: search_heatmap track by $index">',
										'<p flex="55" class="m-side-panel__list-content__item-single">{{heatmap.name_heat}}</p>',
										'<p flex="20" class="m-side-panel__list-content__item-single">{{heatmap.compuest === true? "Compuesta": "Simple"}}</p>',
										'<md-switch ng-model="heatmap.$index" flex md-no-ink aria-label="heatmap.id_heat" ng-change="variableHeatmapShowed($parent, $index)" class="md-primary m-side-panel__list-content__item-single"></md-switch>',
										'<md-button data-id-heatmap="heatmap.id_heat" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single" ng-click="editLayerHeatmap(heatmap, $index)">',
											'<md-icon>create</md-icon>',
										'</md-button>',
										'<md-button data-id-layer="heatmap.id_heat" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single" ng-click="removeHeatmap(heatmap, heatmap.id_heat, $index)">',
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
				_removeHeatmapItem = null,
				_thisPredefinedHeatmapIsTrue = null,
				_column_heatmap_request = null,
				idLayer = null,
				cods = null,
				wkt = null,
				lastLayer = null,
				id_predefined_Layer = null;

				if (!scope.toggleHeatmap) {
					scope.toggleHeatmap = [];
				}
				if (!scope.heatmap_variables_selected) {
					scope.heatmap_variables_selected = [];
				}

				scope.predefinedCategories = [
					{"id_layer": 722, "name_layer": "Alimentos", "name": "food", "icon": "fa fa-cutlery"},
					{"id_layer": '721,712', "name_layer": "Turismo", "name": "tourism", "icon": "fa fa-camera"},
					{"id_layer": 46, "name_layer": "Compras", "name": "shop", "icon": "fa fa-shopping-bag"}
				];

				HeatmapVarJsonService.heatmapVarJsonRequest()
				.then(function(result){
					scope.currentHeatmapItems = result.data;
				}, function(error){
					console.log(error);
				});

				scope.addHeatmap = function(ev){
					$mdDialog.show({
						controller: 'AddHeatmapController',
						templateUrl: './components/panel/analysis/heatmap/add_heatmap/add-heatmap.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true,
						locals: {
							heatmap_variables: scope.currentHeatmapItems
						}
					})
					.then(function(newHeatmap) {
						if (newHeatmap === true) {
							BaseMapService.getUserHeatMap().then(function(res){
								if(res.data && res.data.heats){
									var lastHeatmapLayer = res.data.heats[res.data.heats.length -1];
									scope.save_heatmap_variable_list.push(lastHeatmapLayer);
								}
							});
						}
					}, function(failAdding) {
						if (failAdding === undefined) {

						}
					});
				}

				scope.editLayerHeatmap = function(heatmap_item, index){
					$mdDialog.show({
						controller: 'EditLayerHeatmapController',
						templateUrl: './components/panel/analysis/heatmap/edit_heatmap/edit-heatmap.tpl.html',
						parent: angular.element(document.body),
						targetEvent: heatmap_item.id_heat,
						clickOutsideToClose:true,
						locals: {
							heatmap_layer_id: heatmap_item.id_heat
						},
					})
					.then(function(updateLayer) {
						if (updateLayer === true) {
							
						}
					}, function(failUpdating) {
						console.log(failUpdating);
					});
				}


				scope.variableHeatmapShowed = function(list, index){
					if (!this.predefined) {
						scope.last_heatmap_checked = scope.current_heatmap_checked;
						scope.current_heatmap_checked = list.save_heatmap_variable_list[index];
						idLayer = scope.current_heatmap_checked.id_heat;
						cods = scope.current_heatmap_checked.cods;
						wkt = scope.current_heatmap_checked.bounds;

						if (scope.current_predefined_checked) {
							BaseMapFactory.hideHeatMapCategory(scope.current_predefined_checked.name);
							scope.current_predefined_checked.$index = false;
							scope.current_predefined_checked = "";
						}

						for (var i = 0; i < list.save_heatmap_variable_list.length; i++) {
							list.save_heatmap_variable_list[i].$index = false;
						}

						if (scope.current_heatmap_checked === scope.last_heatmap_checked) {
							scope.current_heatmap_checked = false;
							BaseMapService.map.then(function (map) {
								map.removeLayer( BaseMapFactory.LAYERS.USER[idLayer] )
							});
						}
						else {
							scope.current_heatmap_checked.$index = true;
							if (scope.last_heatmap_checked) {
								lastLayer = BaseMapFactory.LAYERS.USER[scope.last_heatmap_checked.id_heat];
								BaseMapService.map.then(function (map) {
									map.removeLayer(lastLayer);
								});
							}

							scope.last_heatmap_checked = false;
							BaseMapFactory.addHeatMap2LayerBounds(idLayer, cods, wkt, false);
						}

					}
					else {
						scope.last_predefined_checked = scope.current_predefined_checked;
						scope.current_predefined_checked = list.predefinedCategories[index];
						id_predefined_Layer = scope.current_predefined_checked.name;

						if (scope.current_heatmap_checked) {
							var removeLayer = scope.current_heatmap_checked.id_heat;
							BaseMapService.map.then(function (map) {
								map.removeLayer( BaseMapFactory.LAYERS.USER[removeLayer] )
							});
							scope.current_heatmap_checked.$index = false;
							scope.current_heatmap_checked = "";
						}

						for (var i = 0; i < list.predefinedCategories.length; i++) {
							list.predefinedCategories[i].$index = false;
						}

						if (scope.current_predefined_checked === scope.last_predefined_checked) {
							scope.current_predefined_checked = false;
							BaseMapFactory.hideHeatMapCategory(id_predefined_Layer);
						}
						else {
							scope.current_predefined_checked.$index = true;
							if (scope.last_predefined_checked) {
								BaseMapFactory.hideHeatMapCategory(scope.last_predefined_checked.name);
							}

							scope.last_predefined_checked = false;
							BaseMapFactory.addHeatMapCategory(id_predefined_Layer, false);
						}
					}
				};
				
				
				

				scope.removeHeatmap = function(indexItem, id_layer, index) {
					var removeLayer = BaseMapFactory.LAYERS.USER[id_layer];
					if (scope.save_heatmap_variable_list[index].$index === true){
						BaseMapService.map.then(function (map) {
							map.removeLayer(removeLayer);
						});
						scope.save_heatmap_variable_list.splice(index,1);
						scope.toggleHeatmap.splice(index,1);
						BaseMapService.delUserHeatMap(id_layer);
						_deleteMessage("Se eliminó " + indexItem.name_heat);
					}
					else {
						scope.save_heatmap_variable_list.splice(index,1);
						scope.toggleHeatmap.splice(index,1);
						BaseMapService.delUserHeatMap(id_layer);
						_deleteMessage("Se eliminó " + indexItem.name_heat);
					}
				}
				
				// var _toggleEachLayer = function(self, array_list, index) {
				// 	var removeLayer = "";
				// 	scope.last_heatmap_checked = scope.current_heatmap_checked;
				// 	scope.current_heatmap_checked = self.heatmap;

				// 	for (var i = 0; i < array_list.save_heatmap_variable_list.length; i++) {
				// 		array_list.save_heatmap_variable_list[i].$index = false;
				// 	}
				// 	for (var i = 0; i < array_list.predefinedCategories.length; i++) {
				// 		array_list.predefinedCategories[i].$index = false;
				// 	}

				// 	if (scope.current_heatmap_checked.bounds) {
				// 		idLayer = scope.current_heatmap_checked.id_heat;
				// 		cods = scope.current_heatmap_checked.cods;
				// 		wkt = scope.current_heatmap_checked.bounds;
				// 		if (scope.last_heatmap_checked) {
				// 			if (scope.last_heatmap_checked.name) {
				// 				BaseMapFactory.hideHeatMapCategory(scope.last_heatmap_checked.name);
				// 				//scope.last_heatmap_checked = false;
				// 			}
				// 			else {
				// 				removeLayer = BaseMapFactory.LAYERS.USER[scope.last_heatmap_checked.id_heat];
				// 				BaseMapService.map.then(function (map) {
				// 					map.removeLayer(removeLayer);
				// 				});
				// 			}
				// 			//scope.last_heatmap_checked = false;
				// 		}
						
				// 		if (scope.current_heatmap_checked === scope.last_heatmap_checked) {
				// 			scope.current_heatmap_checked = false;
				// 			removeLayer = BaseMapFactory.LAYERS.USER[scope.last_heatmap_checked.id_heat];
				// 			BaseMapService.map.then(function (map) {
				// 				map.removeLayer(removeLayer);
				// 			});
				// 		}
						
				// 		scope.current_heatmap_checked.$index = true;
				// 		BaseMapFactory.addHeatMap2LayerBounds(idLayer, cods, wkt, false);
				// 	}
				// 	else {
				// 		if (scope.last_heatmap_checked) {
				// 			BaseMapFactory.hideHeatMapCategory(scope.last_heatmap_checked.name);
				// 			scope.last_heatmap_checked = false;
				// 		}
						
				// 		if (scope.current_heatmap_checked === scope.last_heatmap_checked) {
				// 			scope.current_heatmap_checked = false;
				// 			removeLayer = BaseMapFactory.LAYERS.USER[scope.current_heatmap_checked.id_heat];
				// 			BaseMapService.map.then(function (map) {
				// 				map.removeLayer(removeLayer);
				// 			});
				// 		}
						
				// 		scope.current_heatmap_checked.$index = true;
				// 		BaseMapFactory.addHeatMapCategory(scope.current_heatmap_checked.name);
				// 	}
					
					
					
				// }

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
