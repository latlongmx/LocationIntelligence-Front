(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function demographyDirective(DemographyJsonService, BaseMapService, BaseMapFactory, $mdToast, $document){
		var _$js_demography_side_panel = null,
		_$js_demography_item = null,
		_column_request = null;

		return {
			restrict: 'E',
			replace: true,
			require: '^explorationFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="demography" tooltip-placement="right" uib-tooltip="Demografía" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-demography"></i>',
					'</li>',
					'<div class="m-side-panel js-demography-side-panel">',
						'<div class="m-modal__demography-variables">',
							'<h3 class="m-side-panel__title">Demografía</h3>',
							'<ul class="m-modal__demography-variables__list js-variables-list">',
								'<li ng-repeat="variable in save_variable_list" class="m-modal__demography-variables__list-item">',
								'<a>{{variable._variable_name}}',
									'<md-switch ng-model="variable.$index" ng-change="variableShowed($parent, $index)" ng-init="variable.$index = $index === 0" aria-label="variable._variable_id" data-variable= "variable._variable_id" class="m-modal__demography-variables__switch md-primary md-mode-A200" ></md-switch>',
								'</a>',
								'</li>',
							'</ul>',
						'</div>',
					'<div>',
					'<div class="m-modal__demography-list" ng-if="list === true">',
						'<div class="m-catalog-filter js-filter-demography-catalog">',
							'<md-content class="md-primary" layout-gt-sm="row">',
								'<md-input-container class="md-block flex-gt-sm">',
								  '<input ng-model="search" ng-change="quickFilter()" placeholder=" rápido">',
								'</md-input-container>',
								'</md-content>',
						'</div>',
						'<wxy-push-menu menu="menu" options="options"></wxy-push-menu>',
					'</div>',
				'<div>'
			].join(''),
			link: function(scope, element, attr, demographyCtrl){
				var _newVariables = null,
				_resultProcess = null,
				_matchWord = null,
				_matchInput = null,
				_last_variable = null,
				_variable_list = null,
				_icon_list = null,
				_icon_data_id = null,
				_remove_child = null,
				_variable_id = null,
				_variable_name = null,
				_keep_values = null,
				_keep_list = null,
				_keep_flag = null,
				_last_variable_flag = null,
				_last_variable_list = null,
				_last_list = null,
				_last_flag = null;
				scope.last_checked = null;
				scope.current_checked = null;
				scope.last_on = null;
				scope.current_on = null;
				
				if (!scope.save_variable_list) {
					scope.save_variable_list = [];
				}
				
				if (!scope._variable_flag) {
					scope._variable_flag = [];
				}
				
				if (!scope.arreglo) {
					scope.arreglo = [];
				}

				/**
				 * Get demography variables
				 */
				DemographyJsonService.demographyJsonRequest()
				.then(function(result){
					scope.currentItems = result.data;
					scope.list = true;
					scope.currentVariables = {
						"title":"Demografía",
						"idCatalog": 1,
						"icon": "fa fa-bars",
						"items": scope.currentItems
					};
					scope.menu = scope.currentVariables;
				}, function(error){
					console.log(error);
				});

				/**
				 * [ Methods and options for menu ]
				 */
				scope.options = {
					collapsed: true,
					fullCollapse: true,
					onExpandMenuStart: function() {
						setTimeout(function(){
							angular.element(document.getElementsByClassName('js-filter-demography-catalog')).addClass('is-filter-demography-active');
						}, 500);
					},
					onExpandMenuEnd: function() {
					},
					onCollapseMenuStart: function() {
						angular.element(document.getElementsByClassName('js-filter-demography-catalog')).removeClass('is-filter-demography-active').val("");
					},
					onCollapseMenuEnd: function(event, item) {
						
					},
					onItemClick: function(event, item) {
						_variable_id = item.id;
						_variable_name = item.name;
						scope.$watchGroup(['_variable_flag','save_variable_list','current_checked'], function(s){
							var found = _.filter(s[0],function(item){
								return item.indexOf( s[2]._variable_name ) !== -1;
							});
							if (found.length === 0) {
								BaseMapFactory.cleanColorPletMap();
							}
						}, true);
						

						if(scope._variable_flag.indexOf(_variable_name) === -1){
							scope._variable_flag.push(_variable_name);
							scope.save_variable_list.push({_variable_name, _variable_id});
							$mdToast.show(
								$mdToast.simple({
									textContent: 'Se agregó ' + _variable_name,
									position: 'top right',
									hideDelay: 1500,
									parent: $document[0].querySelector('.m-side-panel'),
									theme: 'info-toast',
									autoWrap: true
								})
							);
							
							if (scope._variable_flag.length === 1) {
								scope.current_checked = scope.save_variable_list[0];
								scope.last_checked = scope.save_variable_list[0];
								_demographyWKTRequest(scope.save_variable_list[0]._variable_id);
							}
						}

						else {
							for (var i=0; i<scope._variable_flag.length; i++){
								if (scope._variable_flag[i] === _variable_name){
									scope._variable_flag.splice(i,1);
									break;
								}
							}
							if (scope._variable_flag.length === 1) {
								setTimeout(function(){
									scope.save_variable_list[0].$index = true;
									scope.current_checked = scope.save_variable_list[0];
									scope.last_checked = scope.save_variable_list[0];
								}, 500)
								_demographyWKTRequest(scope.save_variable_list[0]._variable_id);
							}
							
							else if (scope._variable_flag.length === 0) {
								BaseMapFactory.cleanColorPletMap();
							}
							$mdToast.show(
								$mdToast.simple({
									textContent: 'Se removió ' + _variable_name,
									position: 'top right',
									hideDelay: 2500,
									parent: $document[0].querySelector('.m-side-panel'),
									theme: 'error-toast',
									autoWrap: true
								})
							);

							for (var i = 0; i < scope.save_variable_list.length; i++){
								if (scope.save_variable_list[i]._variable_name === _variable_name){
									scope.save_variable_list.splice(i,1);
									break;
								}
							}
						}

						angular.element(event.currentTarget.children).toggleClass('fa fa-check').css(
							{"color": "#C3EE97", "transition": "all linear 0.25s"}
						);
					}
				};
				

				/**
				 * [variableShowed Get or change variable that will be shown on the map]
				 * @param  {[type]} list  [list of all variables]
				 * @param  {[type]} index [currend variable index ]
				 */
				scope.variableShowed = function(list, index){
					_column_request = this.variable._variable_id;
					scope.last_checked = scope.current_checked;
					scope.current_checked = list.save_variable_list[index];
					
					for (var i = 0; i < list.save_variable_list.length; i++) {
						list.save_variable_list[i].$index = false;
					}
					
					if (scope.current_checked === scope.last_checked) {
						scope.current_checked = false;
						BaseMapFactory.cleanColorPletMap();
					}
					else {
						scope.current_checked.$index = true;
						_demographyWKTRequest(_column_request);
					}
				}

				/**
				 * [quickFilter Function to get filter values from catalog]
				 */
				scope.quickFilter = function(){
					scope.arreglo = [];
					_resultProcess = null;
					_matchWord = this.search;

					/**
					 * [_newVariables Get result of getObject Match words function]
					 */
					_newVariables = getObject(scope.currentVariables.items);
					if (_newVariables && _matchWord !== "") {
						scope.menu = {
							title: 'Resultados',
							id: 'menuId',
							icon: 'fa fa-search',
							items: _newVariables
						};
						angular.forEach(scope.save_variable_list, function(item){
							setTimeout(function(){
								_icon_data_id = angular.element(document.querySelector('[data-variable-id="'+item._variable_id+'"]'));
								_icon_data_id.addClass('fa fa-check').css(
									{"color": "#C3EE97", "transition": "all linear 0.25s"}
								);
							}, 0);
						});
					}
					else {
						scope.menu = scope.currentVariables;
						angular.forEach(scope.save_variable_list, function(item){
							setTimeout(function(){
								_icon_data_id = angular.element(document.querySelector('[data-variable-id="'+item._variable_id+'"]'));
								_icon_data_id.addClass('fa fa-check').css(
									{"color": "#C3EE97", "transition": "all linear 0.25s"}
								);
							}, 0);
						});
					}

					/**
					 * [getObject Search variable name, compare and get the result]
					 * @param  {[type]} theObject [variables of catalog]
					 */
					function getObject(theObject) {
						scope.arreglo = [];
						_.each(theObject,function(o){
							var items = o.menu.items;
							var found = _.filter(items,function(item){
								return item.name.toLowerCase().indexOf( _matchWord ) !== -1;
							});
							if(found.length > 0){
								_.extend(scope.arreglo,found);
							}
						});
						return scope.arreglo;
					}
				};
				
				/**
				 * [_demographyWKTRequest Create Heatmap]
				 * @param  {[type]} param [description]
				 */
				var _demographyWKTRequest = function(param) {
					BaseMapService.map.then(function (map) {

						if(map.getZoom()<15){
							console.log('zoom mayor');
							return;
						}

						var demographyWKT = BaseMapFactory.bounds2polygonWKT(map.getBounds());
						if(demographyWKT){
							BaseMapService.intersect({
								s:'inegi',
								t: 'pobviv2010',
								c: param,
								w:'',
								wkt: demographyWKT,
								mts: 0
							}).then(function(result){
								if(result && result.data){
									var info = result.data.info;
									var geojson = result.data.geojson;
									BaseMapFactory.addColorPletMap(geojson,param);
								}
							}, function(error){
								console.log(error);
							});
						}
					});
				}
				
				// var _checkLast = function(last){
				// 	last = true;
				// }

			}
		};
	}
	
	demographyDirective.$inject = ['DemographyJsonService', 'BaseMapService', 'BaseMapFactory', '$mdToast', '$document'];

	angular.module('demography.directive', [])
		.directive('demography', demographyDirective);
}());