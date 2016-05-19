(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var demographyModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope, items, DemographyJsonService, $filter, variable_list, variable_flag){
		var demography = this,
		_newVariables = null,
		_resultProcess = null,
		_matchWord = null,
		_matchInput = null,
		_currentItems = null,
		
		_last_variable = null,
		_template = [],
		_variable_flag = [],
		_variable_list = null,
		_save_variable_list = [],
		_remove_child = null,
		_variable_id = null,
		_current_variable = null;
		demography.variable_list = variable_list;
		console.log(demography.variable_list)
		demography.variable_flag = variable_flag;
		console.log(demography.variable_flag)

		setTimeout(function(){
			angular.forEach(demography.variable_list, function(variable){
				_variable_list = angular.element(document.getElementsByClassName('js-variables-list'));
				_variable_list.append('<li id="'+variable.variableId+'">'+variable.variable+'</li>');
			})
		}, 100);
		//demography.variables = variables;

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
			console.log(error)
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

				if(_variable_flag.indexOf(_current_variable) == -1){
					_variable_flag.push(_current_variable);
					_save_variable_list.push({_current_variable, _variable_id});
					_addVariable(_current_variable, _variable_id);
					_last_variable = _current_variable;
				}
				else {
					_removeVariable(_current_variable, _variable_id);
					_last_variable = "";
					
					for (var i=0; i<_variable_flag.length; i++){
						if (_variable_flag[i] === _current_variable){
							_variable_flag.splice(i,1);
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
			_variable_list = angular.element(document.getElementsByClassName('js-variables-list'));
			_variable_list.append('<li id="'+variableId+'">'+variable+'</li>');
		}

		var _removeVariable = function(variable, variableId) {
			_remove_child = angular.element(document.getElementById(variableId));
			_remove_child.remove();
		}
		demography.ok = function(){
			var valores = null;
			if (demography.variable_flag) {
				for (var i=0; i<demography.variable_flag.length; i++){
					if (_variable_flag[i] === _current_variable){
						valores = [demography.variable_list,demography.variable_flag];
					}
					else {
						valores = [_save_variable_list, _variable_flag];
					}
				}
			}
			else {
				valores = [_save_variable_list, _variable_flag];
			}


			$uibModalInstance.close(valores);
		};
		
		/**
		 * [cancel Cancel curent modal]
		 */
		demography.cancel = function(){
			var valores = null;
			if (demography.variables !== _save_variable_list) {
				valores = _save_variable_list;
			}
			else {
				valores = demography.variables;
			}
			
			$uibModalInstance.dismiss(valores);
		};
	};

	demographyModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope', 'items', 'DemographyJsonService', '$filter', 'variable_list', 'variable_flag'];

	angular.module('demography.modal.controller', [])
		.controller('demographyModalController', demographyModalController);

}());