(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var demographyModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope, items, DemographyJsonService, $filter, variables){
		var demography = this,
		_newVariables = null,
		_resultProcess = null,
		_matchWord = null,
		_matchInput = null,
		_currentItems = null,
		_last_variable = null,
		_template = [],
		_variable_list = null,
		_icon_list = null,
		_icon_data_id = null,
		_save_variable_list = [],
		_remove_child = null,
		_variable_id = null,
		_current_variable = null,
		valores = null,
		list = null,
		flag = null,
		_last_list = null,
		_last_flag = null;
		demography.variable_flag = [];

		if (variables) {

			_last_list = variables.list;
			_last_flag = variables.flag;
			
			_save_variable_list = _last_list;
			demography.variable_flag = _last_flag;
			setTimeout(function(){
				_getVariable(_last_list);
				_updateSelectedVariable(_last_list);
			}, 100);
			
			var _updateSelectedVariable = function(list) {
				angular.forEach(list, function(variable){
					_icon_data_id = angular.element(document.querySelector('[data-varId="'+variable._variable_id+'"]'));
					_icon_data_id.addClass('fa fa-check').css(
						{"color": "#C3EE97", "transition": "all linear 0.25s"}
					);
				});
			}
		}
		/**
		 * Get demography variables
		 */
		DemographyJsonService.demographyJsonRequest()
		.then(function(result){
			demography.currentItems = result.data;
			demography.list = true;
			demography.currentVariables = {
				"title":"Demografía",
				"idCatalog": 1,
				"icon": "fa fa-bars",
				"items": demography.currentItems
			}
			demography.menu = demography.currentVariables;
		}, function(error){
			console.log(error);
		});

		/**
		 * [options Methods and options for menu]
		 */
		demography.options = {
			collapsed: true,
			fullCollapse: true,
			onExpandMenuStart: function() {
				setTimeout(function(){
					angular.element(document.getElementsByClassName('js-filter-demography-catalog')).addClass('is-filter-demography-active');
				}, 500);
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
			},
			onItemClick: function(event, item) {
				_variable_id = item.id;
				_current_variable = item.name;
				
				if (variables) {
					if(demography.variable_flag.indexOf(_current_variable) == -1){
						demography.variable_flag.push(_current_variable);
						_save_variable_list.push({_current_variable, _variable_id});
						_updateVariable(_current_variable, _variable_id);
						_last_variable = _current_variable;
					}

					else {
						_removeVariable(_current_variable, _variable_id);
						_last_variable = "";
						for (var i=0; i<demography.variable_flag.length; i++){
							if (demography.variable_flag[i] === _current_variable){
								demography.variable_flag.splice(i,1);
								break;
							}
						}

						for (var i = 0; i < _save_variable_list.length; i++){
							if (_save_variable_list[i]._current_variable === _current_variable){
								_save_variable_list.splice(i,1);
								break;
							}
						}
					}
				}
				
				if(demography.variable_flag.indexOf(_current_variable) == -1){
					demography.variable_flag.push(_current_variable);
					_save_variable_list.push({_current_variable, _variable_id});
					_addVariable(_current_variable, _variable_id);
					_last_variable = _current_variable;
				}

				else {
					_removeVariable(_current_variable, _variable_id);
					_last_variable = "";
					for (var i=0; i<demography.variable_flag.length; i++){
						if (demography.variable_flag[i] === _current_variable){
							demography.variable_flag.splice(i,1);
							break;
						}
					}

					for (var i = 0; i < _save_variable_list.length; i++){
						if (_save_variable_list[i]._current_variable === _current_variable){
							_save_variable_list.splice(i,1);
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
		 * [quickFilter Function to get current value of catalog]
		 */
		demography.quickFilter = function(){
			_resultProcess = null;
			_matchWord = new RegExp(this.search, 'i');
			_matchInput= this.search;
			
			/**
			 * [_newVariables Get result of getObject Match words function]
			 */
			_newVariables = getObject(demography.currentVariables.items);
			if (_newVariables) {
				demography.menu = {
					title: 'Resultados',
					id: 'menuId',
					icon: 'fa fa-bars',
					items: [_newVariables]
				};
			}
			else {
				demography.menu = demography.currentVariables;
			}

			/**
			 * [getObject Compare and get the result]
			 * @param  {[type]} theObject [variables of catalog]
			 */
			function getObject(theObject) {
				if(theObject instanceof Array) {
					for(var i = 0; i < theObject.length; i++) {
						_resultProcess = getObject(theObject[i]);
						if (_resultProcess) {
							return _resultProcess;
						}
					}
				}
				else {
					for(var prop in theObject) {
						if(prop === 'name' && _matchInput !== "") {
							if(_matchWord.test(theObject[prop].toLowerCase()) || _matchInput === "") {
								return theObject;
							}
						}
						if(theObject[prop] instanceof Object || theObject[prop] instanceof Array)
							_resultProcess = getObject(theObject[prop]);
					}
				}
				return _resultProcess;
			}
		};
		
		var _addVariable = function(variable, variableId) {
			console.log(variable)
			console.log(variableId)
			_variable_list = angular.element(document.getElementsByClassName('js-variables-list'));
			_variable_list.append(
				'<li class="m-modal__demography-variables__list-item" id="'+variableId+'"><a href="">'+variable+'</a></li>'
				);
		}

		var _removeVariable = function(variable, variableId) {
			_remove_child = angular.element(document.getElementById(variableId));
			_remove_child.remove();
		}
		
		var _updateVariable = function(_current_variable, _variable_id) {
			console.log(_current_variable)
			console.log(_variable_id)
			demography.variable_flag.push(_current_variable);
			_save_variable_list.push({_current_variable, _variable_id});
			_variable_list = angular.element(document.getElementsByClassName('js-variables-list'));
			_variable_list.append('<li class="m-modal__demography-variables__list-item" id="'+_variable_id+'"><a href="">'+_current_variable+'</a></li>');
			console.log(_variable_list)
		}
		
		var _getVariable = function(list) {
			angular.forEach(list, function(variable){
				_variable_list = angular.element(document.getElementsByClassName('js-variables-list'));
				_variable_list.append('<li class="m-modal__demography-variables__list-item" id="'+variable._variable_id+'"><a href="">'+variable._current_variable+'</a></li>');
			});
		}
		/**
		 * [ok Save changes and close current modal]
		 */
		demography.ok = function(){
			if (variables) {
				for (var i=0; i<_last_flag.length; i++){
					if (_last_flag[i] !== demography.variable_flag[i]){
						list = _last_list;
						flag = _last_flag;
						valores = {list, flag};
					}
					else {
						list = _save_variable_list;
						flag = demography.variable_flag;
						valores = {list, flag};
					}
				}
			}
			else {
				list = _save_variable_list;
				flag = demography.variable_flag;
				valores = {list, flag};
			}
			$uibModalInstance.close(valores);
		};
		
		/**
		 * [cancel Cancel current modal]
		 */
		demography.cancel = function(){
			var valores = null;
			if (demography.variables !== _save_variable_list) {
				valores = _save_variable_list;
			}
			else {
				valores = demography.variables;
			}
			
			$uibModalInstance.dismiss();
		};
	};

	demographyModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope', 'items', 'DemographyJsonService', '$filter', 'variables'];

	angular.module('demography.modal.controller', [])
		.controller('demographyModalController', demographyModalController);

}());