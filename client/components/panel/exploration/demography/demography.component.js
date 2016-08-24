(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function demographyDirective(DemographyJsonService, BaseMapService, BaseMapFactory, $mdToast, $document, $timeout){
		var _$js_demography_side_panel = null,
		_$js_demography_item = null,
		_column_request = null;

		return {
			restrict: 'E',
			replace: true,
			require: '^panelFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-panel-item" data-ep="demography" tooltip-placement="right" uib-tooltip="Demografía" tooltip-animation="true" ng-click="openPanel(\'demography\', \'demography_icon\')">',
						'<img src="./images/functions/demography_icon.png" class="m-list-functions__item-icon" data-icon="demography_icon"/>',
					'</li>',
					'<div class="m-side-panel js-demography-side-panel">',
						'<div class="m-modal__demography-variables">',
							'<h3 class="m-side-panel__title">Exploración Demográfica</h3>',
							'<md-list class="m-modal__demography-variables__list js-variables-list">',
								'<md-list-item ng-repeat="variable in demography_variable_list" class="m-modal__demography-variables__list-item__list">',
									'<p class="align-left">{{variable._variable_name}}</p>',
									'<md-switch ng-model="variable.$index" ng-change="variableShowed($parent, $index)" ng-init="variable.$index = $index === 0" aria-label="variable._variable_id" data-variable= "variable._variable_id" class="m-modal__demography-variables__switch md-primary md-hue-1" ></md-switch>',
									'<md-button class="md-icon-button m-modal__demography-variables__close" ng-model="variable.$index" ng-click="removeVariable($parent, $index)">',
									  '<md-icon>delete</md-icon>',
									'</md-button>',
									'<md-divider></md-divider>',
								'</md-list-item>',
							'</md-list>',
						'</div>',
						'<div class="m-modal__demography-list" ng-if="list === true">',
							'<div class="m-catalog-filter js-filter-demography-catalog">',
								'<input type="text" class="m-input m-input--in-demography__catalog" ng-model="search" ng-change="quickFilter()" placeholder="Filtro rápido">',
							'</div>',
							'<dem-push-menu menu="menu" options="options_one"></dem-push-menu>',
						'</div>',
					'</div>',
				'</div>'
			].join(''),
			link: function(scope, element, attr, ctrl){
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
				scope.options = {};
				
				if (!scope.demography_variable_list) {
					scope.demography_variable_list = [];
				}
				
				if (!scope._variable_flag) {
					scope._variable_flag = [];
				}
				
				if (!scope.arreglo) {
					scope.arreglo = [];
				}
				
				scope.openPanel = function(a,b){
					ctrl.explorationItem(a,b);
				}
				
				scope.$watchGroup(['_variable_flag','demography_variable_list','current_checked'], function(s){
					var found = _.filter(s[0],function(item){
						return item.indexOf(s[2]._variable_name) !== -1;
					});
					if (found.length === 0 || found.length === "") {
						BaseMapFactory.delPobVivWMS();
					}
				}, true);
				
				
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
						"icon": "fa fa-search",
						"items": scope.currentItems
					};
					scope.menu = scope.currentVariables;
				}, function(error){
					console.log(error);
				});

				/**
				 * [ Methods and options for menu ]
				 */
				scope.options_one = {
					collapsed: true,
					fullCollapse: true,
					wrapperDemClass: 'multilevelpushmenu_wrapper',
					direction: 'ltr',
					backDemClass: 'backDemClass',
					backText: 'Atrás',
					onExpandDemMenuStart: function() {
						setTimeout(function(){
							angular.element(document.getElementsByClassName('js-filter-demography-catalog')).addClass('is-filter-demography-active');
						}, 500);
						var search = angular.element(document.getElementsByClassName('testing'));
						angular.element(search[0]).removeClass('fa-search').addClass('fa-times').css({
							"-webkit-transition": "all linear 0.25s",
							"-moz-transition": "all linear 0.25s",
							"-o-transition": "all linear 0.25s",
							"-ms-transition": "all linear 0.25s",
							"transition": "all linear 0.25s"
						});
					},
					onCollapseDemMenuEnd: function(event, item) {
						var hide = angular.element(document.getElementsByClassName('testing'));
						angular.element(hide[0]).removeClass('fa-times').addClass('fa-search');
					},
					onCollapseDemMenuStart: function() {
						angular.element(document.getElementsByClassName('js-filter-demography-catalog')).removeClass('is-filter-demography-active').val("");
					},
					onItemDemClick: function(event, item) {
						_variable_id = item.id;
						_variable_name = item.name;

						if(scope._variable_flag.indexOf(_variable_name) === -1){
							scope._variable_flag.push(_variable_name);
							scope.demography_variable_list.push({_variable_name: _variable_name, _variable_id: _variable_id});
							_showToastMessage('Se agregó ' + _variable_name);
							if (scope._variable_flag.length === 1) {
								scope.current_checked = scope.demography_variable_list[0];
								scope.last_checked = scope.demography_variable_list[0];
								_demographyWKTRequest(scope.demography_variable_list[0]._variable_id);
							}
						}

						else {
							for (var i=0; i<scope._variable_flag.length; i++){
								if (scope._variable_flag[i] === _variable_name){
									scope._variable_flag.splice(i,1);
									scope.demography_variable_list.splice(i,1);
									BaseMapFactory.delPobVivWMS();
									break;
								}
							}

							if (scope._variable_flag.length === 1) {
								setTimeout(function(){
									scope.demography_variable_list[0].$index = true;
									scope.current_checked = scope.demography_variable_list[0];
									scope.last_checked = scope.demography_variable_list[0];
								}, 500);
								_demographyWKTRequest(scope.demography_variable_list[0]._variable_id);
							}
							
							if (scope._variable_flag.length === 0) {
								BaseMapFactory.delPobVivWMS();
							}
							_showToastMessage('Se removió ' + _variable_name);

						}
						angular.element(event.currentTarget.children).toggleClass('fa fa-check').css(
							{"color": "#C3EE97", "transition": "all linear 0.25s"}
						);
					}
				};
				
				var outside = angular.element(document.q);

				/**
				 * [variableShowed Get or change variable that will be shown on the map]
				 * @param  {[type]} list  [list of all variables]
				 * @param  {[type]} index [currend variable index ]
				 */
				scope.variableShowed = function(list, index){
					_column_request = this.variable._variable_id;
					scope.last_checked = scope.current_checked;
					scope.current_checked = list.demography_variable_list[index];

					for (var i = 0; i < list.demography_variable_list.length; i++) {
						list.demography_variable_list[i].$index = false;
					}
					if (scope.current_checked === scope.last_checked) {
						scope.current_checked = false;
						BaseMapFactory.delPobVivWMS();
					}
					else {
						scope.current_checked.$index = true;
						BaseMapFactory.delPobVivWMS();
						scope.last_checked = false;
						_demographyWKTRequest(_column_request);
					}
				};

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
						angular.forEach(scope.demography_variable_list, function(item){
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
						angular.forEach(scope.demography_variable_list, function(item){
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
						if(map.getZoom() < 13){
							$timeout(function(){
								_showToastMessage("Se necesita un zoom mínimo de 14 para visualizar la capa");
							}, 2500);
							//
						}
						BaseMapFactory.setPobVivWMS(param);
					});
				};
				
				scope.removeVariable = function(parent,index) {
					_icon_data_id = angular.element(document.querySelector('[data-variable-id="'+scope.demography_variable_list[index]._variable_id+'"]'));
					_icon_data_id.removeClass('fa fa-check').css(
						{ "transition": "all linear 0.25s"}
					);

					if (scope.demography_variable_list[index].$index === true){
						BaseMapFactory.delPobVivWMS();
						scope.demography_variable_list.splice(index,1);
						scope._variable_flag.splice(index,1);
					}
					else {
						scope.demography_variable_list.splice(index,1);
						scope._variable_flag.splice(index,1);
					}
					
					if (scope._variable_flag.length === 1) {
						scope.demography_variable_list[0].$index = true;
						scope.current_checked = scope.demography_variable_list[0];
						scope.last_checked = scope.demography_variable_list[0];
						_demographyWKTRequest(scope.demography_variable_list[0]._variable_id);
					}
				}
				
				/**
				 * [_showToastMessage Function to open $mdDialog]
				 * @param  {[type]} message [Message to show in $mdDialog]
				 */
				var _showToastMessage = function(message) {
					$mdToast.show(
						$mdToast.simple({
							textContent: message,
							position: 'top right',
							hideDelay: 2500,
							parent: $document[0].querySelector('.md-dialog-container')
						})
					);
				}
			}
		};
	}
	
	demographyDirective.$inject = ['DemographyJsonService', 'BaseMapService', 'BaseMapFactory', '$mdToast', '$document', '$timeout'];

	angular.module('walmex').directive('demography', demographyDirective);
})();