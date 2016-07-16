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
								'<div layout="row" flex="60" layout-align="center center" class="m-side-panel__actions-columns">',
									'<div flex="75">',
										'<h5 class="m-side-panel__subtitle m-side-panel__subtitle--in-locations-actions">Mostrar/ocultar Capas activas</h5>',
									'</div>',
									'<div flex="25">',
										'<div class="m-side-panel__switch">',
											'<md-switch class="md-primary md-mode-A200" aria-label="all-heatmap" ng-model="all_heatmap" ng-change="toggleGralHeatmap(predefined)"></md-switch>',
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
									'<li class="m-side-panel__list-content__item js-heatmap-item" ng-repeat="predefined in predefindedCategories">',
										'<div flex="10">',
											'<img ng-src="" width="25" class="m-side-panel__list-content__item-single-img m-side-panel__list-content__item-single-img--in-predefined-heatmap-panel"/>',
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
									'<li class="m-side-panel__list-content__item js-heatmap-item" ng-repeat="heatmap in save_heatmap_variable_list | filter: search_competence">',
										'<p flex="55" class="m-side-panel__list-content__item-single">{{heatmap.name_heat}}</p>',
										'<p flex="20" class="m-side-panel__list-content__item-single">{{heatmap.compuest === true? "Compuesta": "Simple"}}</p>',
										'<md-switch ng-model="heatmap.$index" flex md-no-ink aria-label="heatmap.id_heat" ng-change="variableHeatmapShowed($parent, $index)" class="md-primary m-side-panel__list-content__item-single"></md-switch>',
										'<md-button data-id-heatmap="heatmap.id_heat" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single" ng-click="editLayerHeatmap($parent, heatmap, $index)">',
											'<md-icon>create</md-icon>',
										'</md-button>',
										'<md-button data-id-layer="heatmap.id_heat" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single" ng-click="removeHeatmap(heatmap, heatmap.id_heat, heatmap.name_heat, $index)">',
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
				_column_heatmap_request = null;

				if (!scope.toggleHeatmap) {
					scope.toggleHeatmap = [];
				}
				if (!scope.heatmap_variables_selected) {
					scope.heatmap_variables_selected = [];
				}

				scope.predefindedCategories = [
					{"id_layer": 722, "name_layer": "Alimentos", "name": "food"},
					{"id_layer": 2, "name_layer": "Turismo", "name": "tourism"},
					{"id_layer": 3, "name_layer": "Compras", "name": "shop"}
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
				// scope.turnOnOffLayerHeatmap = function(layer_predefined, predefinedLayer) {
				// 	_thisPredefinedHeatmapIsTrue = this;
				// 	var id = predefinedLayer.id_layer +'-'+ predefinedLayer.name_layer.replace(' ','_');
				// 	if(scope.toggleHeatmap.indexOf(_thisPredefinedHeatmapIsTrue.$index) === -1 && _thisPredefinedHeatmapIsTrue.layer_predefined === true){
				// 		scope.toggleHeatmap.push({index: _thisPredefinedHeatmapIsTrue.$index, heatmap: _thisPredefinedHeatmapIsTrue, id_layer: id});
				// 	}
				// 	else{
				// 		for (var i=0; i<scope.toggleHeatmap.length; i++){
				// 			if (scope.toggleHeatmap[i].index === _thisPredefinedHeatmapIsTrue.$index){
				// 				scope.toggleHeatmap.splice(i,1);
				// 				break;
				// 			}
				// 		}
				// 	}
				// 	layer_predefined === true ? BaseMapFactory.addHeatMapCategory(predefinedLayer.name) : BaseMapFactory.hideHeatMapCategory(predefinedLayer.name);
				// }
				
				scope.variableHeatmapShowed = function(list, index){
					var idLayer, cods, wkt = null;
					//_column_heatmap_request = this.heatmap.id_heat;
					scope.last_heatmap_checked = scope.current_heatmap_checked;
					scope.current_heatmap_checked = list.save_heatmap_variable_list[index];
					idLayer = scope.current_heatmap_checked.id_heat;
					cods = scope.current_heatmap_checked.cods;
					wkt = scope.current_heatmap_checked.bounds;
					
					for (var i = 0; i < list.save_heatmap_variable_list.length; i++) {
						list.save_heatmap_variable_list[i].$index = false;
					}
					if (scope.current_heatmap_checked === scope.last_heatmap_checked) {
						console.log(scope.current_heatmap_checked)
						console.log(scope.last_heatmap_checked)
						scope.current_heatmap_checked = false;
						BaseMapService.map.then(function (map) {
							map.removeLayer( BaseMapFactory.LAYERS.USER[idLayer] )
						});
					}
					else {
						console.log(scope.current_heatmap_checked.id_heat)

						scope.current_heatmap_checked.$index = true;
						if (scope.last_heatmap_checked) {
							console.log(scope.last_heatmap_checked.id_heat)
							BaseMapService.map.then(function (map) {
								map.removeLayer( BaseMapFactory.LAYERS.USER[scope.last_heatmap_checked.id_heat] )
							});
						}
						
						scope.last_heatmap_checked = false;
						BaseMapFactory.addHeatMap2LayerBounds(idLayer, cods, wkt, false);
					}
				};

				// scope.turnOnOffLayerCompetence = function(layer, loc) {
				// 	_thisHeatmapIsTrue = this;
				// 	var id = loc.id_layer +'-'+ loc.name_layer.replace(' ','_');
				// 	if(scope.toggleHeatmap.indexOf(_thisHeatmapIsTrue.$index) === -1 && _thisHeatmapIsTrue.layer === true){
				// 		scope.toggleHeatmap.push({index: _thisHeatmapIsTrue.$index, heatmap: _thisHeatmapIsTrue, id_layer: id});
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

				// scope.removeHeatmap = function(indexItem, id_layer, name, index) {
				// 	var id = id_layer +'-'+ name.replace(' ','_');
				// 	_removeHeatmapItem = scope.save_heatmap_variable_list.indexOf(indexItem);
				// 	if (_removeHeatmapItem !== -1) {
				// 		BaseMapFactory.hideLocation(id);
				// 		scope.save_heatmap_variable_list.splice(_removeHeatmapItem, 1);
				// 		CompetenceService.delCompetence( id_layer )
				// 		.then(function(res){
				// 			_deleteMessage("Se eliminó " + name);
				// 		}, function(){
				// 			_deleteMessage("Error al eliminar " + name + ", intente nuevamente");
				// 		});

				// 		for (var i=0; i<scope.toggleHeatmap.length; i++){
				// 			if (scope.toggleHeatmap[i].index === index){
				// 				scope.toggleHeatmap.splice(i,1);
				// 				break;
				// 			}
				// 		}
				// 	}
				// }

				// scope.toggleGralHeatmap = function() {
				// 	if(this.all_heatmap === true) {
				// 		_.each(scope.toggleHeatmap, function(heat){
				// 			heat.heatmap.layer_predefined = false;
				// 			scope.is_toggle_gral_heatmap = true;
				// 			BaseMapFactory.hideHeatMapCategory(heat.heatmap.predefined.name);
				// 		});
				// 	}
				// 	else {
				// 		_.each(scope.toggleHeatmap, function(heat){
				// 			heat.heatmap.layer_predefined = true;
				// 			scope.is_toggle_gral_heatmap = false;
				// 			BaseMapFactory.addHeatMapCategory(heat.heatmap.predefined.name);
				// 		});
				// 	}
				// 	if (scope.toggleHeatmap.length === 0) {
				// 		scope.is_toggle_gral_heatmap = false;
				// 	}
				// }

				// var _deleteMessage = function(msg) {
				// 	$mdToast.show(
				// 		$mdToast.simple({
				// 			textContent: msg,
				// 			position: 'top right',
				// 			hideDelay: 1500,
				// 			parent: $document[0].querySelector('.js-heatmap-side-panel'),
				// 			autoWrap: true
				// 		})
				// 	);
				// }
			}
		};
	}

	heatmapDirective.$inject = ['_', '$mdDialog', '$mdToast', '$mdMedia', '$document', '$timeout', 'CompetenceService', 'HeatmapVarJsonService', 'BaseMapFactory','BaseMapService', 'Auth', '$log'];

	angular.module('heatmap.directive', [])
		.directive('heatmap', heatmapDirective);
})();
