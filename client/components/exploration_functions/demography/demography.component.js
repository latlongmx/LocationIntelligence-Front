(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function demographyDirective(DemographyJsonService){
		var _$js_side_panel = null,
		_$js_demography_item = null,
		_last_checked = null,
		_current_checked = null;

		return {
			restrict: 'E',
			replace: true,
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-demography-item" data-ep="demography" tooltip-placement="right" uib-tooltip="Demografía" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-demography"></i>',
					'</li>',
					'<div class="m-side-panel js-side-panel">',
						'<div class="m-modal__demography-variables">',
							'<h3 class="m-modal__demography-variables__title">Seleccionar variables</h3>',
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
							'<input type="text" class="m-input m-input--in-demography__catalog" ng-model="search" ng-change="quickFilter()" placeholder="Filtro rápido">',
						'</div>',
						'<wxy-push-menu menu="menu" options="options"></wxy-push-menu>',
					'</div>',
				'<div>'
			].join(''),
			link: function(scope, element){
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
				
				if (!scope.save_variable_list) {
					scope.save_variable_list = [];
				}
				
				if (!scope._variable_flag) {
					scope._variable_flag = [];
				}
				
				if (!scope.arreglo) {
					scope.arreglo = [];
				}
				
				_$js_demography_item = angular.element(document.getElementsByClassName('js-demography-item'));
				_$js_side_panel = angular.element(document.getElementsByClassName('js-side-panel'));

				_$js_demography_item.on('click', function(e){
					e.preventDefault();
					_$js_side_panel.toggleClass('is-demography-panel-open');
					_$js_demography_item.toggleClass('is-item-panel-active');
				});

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
				scope.options = {
					collapsed: true,
					fullCollapse: true,
					onExpandMenuStart: function() {
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
					onExpandMenuEnd: function() {
						angular.element(document.getElementsByClassName('current-category')).addClass('visible').removeClass('invisible');
					},
					onCollapseMenuStart: function() {
						angular.element(document.getElementsByClassName('js-filter-demography-catalog')).removeClass('is-filter-demography-active').val("");
						angular.element(document.getElementsByClassName('current-category')).addClass('visible').removeClass('invisible');
					},
					onCollapseMenuEnd: function(event, item) {
						angular.element(document.getElementsByClassName('current-category')).removeClass('visible').addClass('invisible');
						var hide = angular.element(document.getElementsByClassName('testing'));
						angular.element(hide[0]).removeClass('fa-times').addClass('fa-search');
					},
					onItemClick: function(event, item) {
						_variable_id = item.id;
						_variable_name = item.name;

						if(scope._variable_flag.indexOf(_variable_name) === -1){
							scope._variable_flag.push(_variable_name);
							scope.save_variable_list.push({_variable_name, _variable_id});
						}

						else {
							for (var i=0; i<scope._variable_flag.length; i++){
								if (scope._variable_flag[i] === _variable_name){
									scope._variable_flag.splice(i,1);
									break;
								}
							}

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
					_last_checked = _current_checked;
					_current_checked = list.save_variable_list[index];
					
					for (var i = 0; i < list.save_variable_list.length; i++) {
						list.save_variable_list[i].$index = false;
					}
					
					if (_current_checked === _last_checked) {
						_current_checked = false;
						// Cancel request
					}
					else {
						_current_checked.$index = true;
						
						// Do request
					}
				}
				/**
				 * [quickFilter Function to get filter values from catalog]
				 */
				scope.quickFilter = function(){
					scope.arreglo = [];
					_resultProcess = null;
					_matchWord = new RegExp(this.search, 'i');
					_matchInput= this.search;
					/**
					 * [_newVariables Get result of getObject Match words function]
					 */
					_newVariables = getObject(scope.currentVariables.items);

					if (_newVariables && _matchInput !== "") {
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
						for (var prop in theObject[0].menu.items) {
								if(_matchWord.test(theObject[0].menu.items[prop].name.toLowerCase()) || _matchInput === "") {
									scope.arreglo.push(theObject[0].menu.items[prop]);
									
								}
						}
						for (var prop in theObject[1].menu.items) {
							if(_matchWord.test(theObject[1].menu.items[prop].name.toLowerCase()) || _matchInput === "") {
								scope.arreglo.push(theObject[1].menu.items[prop]);
								
							}
						}
						for (var prop in theObject[2].menu.items) {
							if(_matchWord.test(theObject[2].menu.items[prop].name.toLowerCase()) || _matchInput === "") {
								scope.arreglo.push(theObject[2].menu.items[prop]);
								
							}
						}
						return scope.arreglo;
					}
				};

			}
		};
	}
	
	demographyDirective.$inject = ['DemographyJsonService'];

	angular.module('demography.directive', [])
		.directive('demography', demographyDirective);
}());