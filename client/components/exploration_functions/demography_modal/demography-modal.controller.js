(function(){
	/**
	*  Modal Module
	*/
	'use strict';

	var demographyModalController = function($uibModalInstance, $uibModal, $uibModalStack, $scope, items, DemographyJsonService, $filter){
		var _this = null,
		demography = this,
		_newVariables = null,
		_resultProcess = null,
		_matchWord = null,
		_matchInput = null,
		_currentItems = null,
		_currentVariables = null,
		_selectedVariable = [];
		demography.epId = items.id;

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
				_selectedVariable = [];
				_selectedVariable.push(item);
				_selectedVariables(_selectedVariable)
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
			_newVariables = getObject(demography.currentItems);
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
		
		var _selectedVariables = function(variable) {
			
			var template = [];
			var variable_list = angular.element(document.getElementsByClassName('js-variables-list'));

			for (var i = 0; i < variable.length; i++) {
				template.push('<li>'+variable[i].name+'</li>');
			}
			
			variable_list.append(template.join(''));
		}

		demography.ok = $uibModalInstance.close;
		
		/**
		 * [cancel Cancel curent modal]
		 */
		demography.cancel = function(){
			$uibModalInstance.close('cancel');
		};
	};

	demographyModalController.$inject = ['$uibModalInstance','$uibModal', '$uibModalStack','$scope', 'items', 'DemographyJsonService', '$filter'];

	angular.module('demography.modal.controller', [])
		.controller('demographyModalController', demographyModalController);

}());