(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var demographyModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope, items, DemographyJsonService, $filter, keep_previous_data){
		var demography = this,
		_newVariables = null,
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
		_last_flag = null,
		_variable_flag = [];
		demography.save_variable_list = [];

		/**
		 * [if exists variables from the last modal opened]
		 * @param  {[type]} keep_previous_data [Array with list and flag variables]
		 */
		if (keep_previous_data) {

			setTimeout(function(){
				_last_variable_flag = keep_previous_data._keep_flag;
				_last_variable_list = keep_previous_data._keep_list;
				
				_variable_flag = _last_variable_flag;
				demography.save_variable_list = _last_variable_list;
				_updateVariableList(keep_previous_data);
			}, 0);
		}
		
		/**
		 * [_updateVariableList Update new variables, to existent list]
		 * @param  {[type]} list [ array with variable name and variable id ]
		 */
		var _updateVariableList = function (list) {
			_variable_list = angular.element(document.getElementsByClassName('js-variables-list'));

			angular.forEach(list._keep_list, function(item){
				_icon_data_id = angular.element(document.querySelector('[data-variable-id="'+item._variable_id+'"]'));
				_icon_data_id.addClass('fa fa-check').css(
					{"color": "#C3EE97", "transition": "all linear 0.25s"}
				);
				//_variable_list.append('<li class="m-modal__demography-variables__list-item" id="'+item._variable_id+'"><a href="">'+item._variable_name+'</a></li>');
			});
		};

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
			};
			demography.menu = demography.currentVariables;
		}, function(error){
			console.log(error);
		});

		/**
		 * [ Methods and options for menu ]
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
				_variable_name = item.name;

				/**
				 * [if variable name not exists in array, push to flag array, else remove from flag array]
				 * @param  {[type]} _variable_flag.indexOf(_variable_name) [variable selected for user]
				 */
				if(_variable_flag.indexOf(_variable_name) == -1){
					_variable_flag.push(_variable_name);
					demography.save_variable_list.push({_variable_name, _variable_id});
					_addVariable(_variable_name, _variable_id);
					_last_variable = _variable_name;
				}

				else {
					_removeVariable(_variable_name, _variable_id);
					_last_variable = "";
					
					/**
					 * [ If there is a variable name in the flag array, remove it ]
					 */
					for (var i=0; i<_variable_flag.length; i++){
						if (_variable_flag[i] === _variable_name){
							_variable_flag.splice(i,1);
							break;
						}
					}
					
					/**
					 * [ If there is a variable name in the list of variables array, remove it ]
					 */
					for (var i = 0; i < demography.save_variable_list.length; i++){
						if (demography.save_variable_list[i]._variable_name === _variable_name){
							demography.save_variable_list.splice(i,1);
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
		 * [quickFilter Function to get filter values from catalog]
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
			 * [getObject Search variable name, compare and get the result]
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
		
		/**
		 * [_addVariable Add variables to list]
		 * @param {[type]} variable   [variable name]
		 * @param {[type]} variableId [variable id]
		 */
		var _addVariable = function(variable, variableId) {
			// _variable_list = angular.element(document.getElementsByClassName('js-variables-list'));
			// _variable_list.append(
			// 	'<li class="m-modal__demography-variables__list-item" id="'+variableId+'"><a href="">'+variable+'</a><md-switch ng-model="'+variableId+'" aria-label="'+variableId+'">'+variableId+'</md-switch></li>'
			// 	);
		}

		/**
		 * [_removeVariable Remove variables from the list]
		 * @param  {[type]} variable   [variable name]
		 * @param  {[type]} variableId [variable id]
		 */
		var _removeVariable = function(variable, variableId) {
			_remove_child = angular.element(document.getElementById(variableId));
			_remove_child.remove();
		}

		/**
		 * [ok Save changes and close current modal]
		 */
		demography.ok = function(){
			
			/**
			 * [ Save list and flag and pass to instance when modal is closed, to keep data  ]
			 */
			_keep_list = demography.save_variable_list;
			_keep_flag = _variable_flag;
			_keep_values = {_keep_list, _keep_flag};
			
			if (keep_previous_data) {
				
				for (var i = 0; i < _last_variable_flag.length; i++) {
					if (_last_variable_flag[i] === _variable_flag[i]) {
						_keep_list = demography.save_variable_list;
						_keep_flag = _variable_flag;
						break;
					}
					_keep_values = {_keep_list, _keep_flag};
				}
				
			}

			$uibModalInstance.close(_keep_values);
		};
		
		/**
		 * [cancel Cancel current modal, withput save changes]
		 */
		demography.cancel = function(){
			var _keep_values = null;
			if (demography.variables !== demography.save_variable_list) {
				_keep_values = demography.save_variable_list;
			}
			else {
				_keep_values = demography.variables;
			}
			
			$uibModalInstance.dismiss();
		};
	};

	demographyModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope', 'items', 'DemographyJsonService', '$filter', 'keep_previous_data'];

	angular.module('demography.modal.controller', [])
		.controller('demographyModalController', demographyModalController);

}());