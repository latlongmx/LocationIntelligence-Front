(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function AddCompetenceByVarController(_, $scope, $mdDialog, $mdToast, $interval, $timeout, FileUploader, $document, LocationFactory, LocationService, CompetenceVarJsonService, BaseMapService, competence_variables){
		$scope.bounds = null;
		$scope.nw = null;
		$scope.se = null;
		$scope.bbox = null;

		BaseMapService.map.then(function (map) {
			$scope.bounds = map.getBounds();
			$scope.nw = $scope.bounds.getNorthWest();
			$scope.se = $scope.bounds.getSouthEast();
			$scope.bbox = [$scope.nw.lng, $scope.se.lat, $scope.se.lng, $scope.nw.lat].join(',');
		});
		var _newCompetenceVariables = null,
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
		$scope.last_competence_checked = null;
		$scope.current_competence_checked = null;
	
		if (!$scope.save_competence_variable_list) {
			$scope.save_competence_variable_list = [];
		}
		
		if (!$scope._competence_variable_flag) {
			$scope._competence_variable_flag = [];
		}
		
		if (!$scope._competence_array) {
			$scope._competence_array = [];
		}
		// $scope.$watchGroup(['_competence_variable_flag','save_competence_variable_list','current_competence_checked'], function(s){
		// 	var found = _.filter(s[0],function(item){
		// 		return item.indexOf(s[2]._variable_name) !== -1;
		// 	});
		// 	if (found.length === 0 || found.length === "") {
		// 		BaseMapFactory.delPobVivWMS();
		// 	}
		// }, true);
		/**
		 * Get demography variables
		 */
		$scope.currentCompetenceItems = competence_variables;
		$scope.list = true;
		$scope.currentCompetenceVariables = {
			"title":"WORD",
			"idCatalog": 2,
			"icon": "",
			"items": $scope.currentCompetenceItems
		};
		$scope.menu = $scope.currentCompetenceVariables;

		/**
		 * [ Methods and options for menu ]
		 */
		$scope.opciones = {
			collapsed: false,
			fullCollapse: true,
			overlapWidth: 0,
			mode: 'cover',
			wrapperClass: 'multilevelpushmenu_wrapper--in-competence',
			onItemClick: function(event, item) {
				_variable_id = item.id;
				_variable_name = item.name;

				if($scope._competence_variable_flag.indexOf(_variable_name) === -1){
					$scope._competence_variable_flag.push(_variable_name);
					$scope.save_competence_variable_list.push({_variable_name: _variable_name, _variable_id: _variable_id});
					console.log($scope.save_competence_variable_list)
					$mdToast.show(
						$mdToast.simple({
							textContent: 'Se agregó ' + _variable_name,
							position: 'top right',
							hideDelay: 1500,
							parent: $document[0].querySelector('.m-dialog--in-competence__var'),
							autoWrap: true
						})
					);
					
					if ($scope._competence_variable_flag.length === 1) {
						$scope.current_competence_checked = $scope.save_competence_variable_list[0];
						$scope.last_competence_checked = $scope.save_competence_variable_list[0];
						_addCompetenceToList($scope.save_competence_variable_list[0]._variable_id);
					}
				}

				else {
					for (var i=0; i<$scope._competence_variable_flag.length; i++){
						if ($scope._competence_variable_flag[i] === _variable_name){
							$scope._competence_variable_flag.splice(i,1);
							$scope.save_competence_variable_list.splice(i,1);
							//BaseMapFactory.delPobVivWMS();
							break;
						}
					}

					if ($scope._competence_variable_flag.length === 1) {
						setTimeout(function(){
							$scope.save_competence_variable_list[0].$index = true;
							$scope.current_competence_checked = $scope.save_competence_variable_list[0];
							$scope.last_competence_checked = $scope.save_competence_variable_list[0];
						}, 500);
						_addCompetenceToList($scope.save_competence_variable_list[0]._variable_id);
					}
					
					if ($scope._competence_variable_flag.length === 0) {
						//BaseMapFactory.delPobVivWMS();
					}
					$mdToast.show(
						$mdToast.simple({
							textContent: 'Se removió ' + _variable_name,
							position: 'top right',
							hideDelay: 2500,
							parent: $document[0].querySelector('.md-dialog-container'),
						})
					);

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
		// $scope.variableShowed = function(list, index){
		// 	_column_request = this.variable._variable_id;
		// 	$scope.last_competence_checked = $scope.current_competence_checked;
		// 	$scope.current_competence_checked = list.save_variable_list[index];
			
		// 	for (var i = 0; i < list.save_variable_list.length; i++) {
		// 		list.save_variable_list[i].$index = false;
		// 	}
		// 	if ($scope.current_competence_checked === $scope.last_competence_checked) {
		// 		$scope.current_competence_checked = false;
		// 		BaseMapFactory.delPobVivWMS();
		// 	}
		// 	else {
		// 		$scope.current_competence_checked.$index = true;
		// 		BaseMapFactory.delPobVivWMS();
		// 		$scope.last_competence_checked = false;
		// 		_addCompetenceToList(_column_request);
		// 	}
		// };

		/**
		 * [quickFilter Function to get filter values from catalog]
		 */
		$scope.quickCompetenceFilter = function(){
			$scope._competence_array = [];
			_resultProcess = null;
			_matchWord = this.search;

			/**
			 * [_newCompetenceVariables Get result of getObject Match words function]
			 */
			_newCompetenceVariables = getObject($scope.currentCompetenceVariables.items);
			if (_newCompetenceVariables && _matchWord !== "") {
				$scope.menu = {
					title: 'Resultados',
					id: 'menuId',
					icon: '',
					items: _newCompetenceVariables
				};
				angular.forEach($scope.save_competence_variable_list, function(item){
					setTimeout(function(){
						_icon_data_id = angular.element(document.querySelector('[data-variable-id="'+item._variable_id+'"]'));
						_icon_data_id.addClass('fa fa-check').css(
							{"color": "#C3EE97", "transition": "all linear 0.25s"}
						);
					}, 0);
				});
			}
			else {
				$scope.menu = $scope.currentCompetenceVariables;
				angular.forEach($scope.save_competence_variable_list, function(item){
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
				$scope._competence_array = [];
				_.each(theObject,function(o){
					var items = o.menu.items;
					var found = _.filter(items,function(item){
						return item.name.toLowerCase().indexOf( _matchWord ) !== -1;
					});
					if(found.length > 0){
						_.extend($scope._competence_array,found);
					}
				});
				return $scope._competence_array;
			}
		};
		
		/**
		 * [_addCompetenceToList Create Heatmap]
		 * @param  {[type]} param [description]
		 */
		var _addCompetenceToList = function(param) {
			console.log($scope.bbox)
				BaseMapService.addCompetenciaQuery({
					qf:"cod:"+param,
					qb: $scope.bbox,
					competence:"1",
					nm: 'Competencia - oxxo'
				});
		};
		
		$scope.removeVariable = function(parent,index) {
			_icon_data_id = angular.element(document.querySelector('[data-variable-id="'+$scope.save_competence_variable_list[index]._variable_id+'"]'));
			_icon_data_id.removeClass('fa fa-check').css(
				{ "transition": "all linear 0.25s"}
			);

			if ($scope.save_competence_variable_list[index].$index === true){
				BaseMapFactory.delPobVivWMS();
				$scope.save_competence_variable_list.splice(index,1);
				$scope._competence_variable_flag.splice(index,1);
			}
			else {
				$scope.save_competence_variable_list.splice(index,1);
				$scope._competence_variable_flag.splice(index,1);
			}
			
			if ($scope._competence_variable_flag.length === 1) {
				$scope.save_competence_variable_list[0].$index = true;
				$scope.current_competence_checked = $scope.save_competence_variable_list[0];
				$scope.last_competence_checked = $scope.save_competence_variable_list[0];
				_addCompetenceToList($scope.save_competence_variable_list[0]._variable_id);
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
					parent: $document[0].querySelector('.m-dialog__content')
				})
			);
		}
		
		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		
		$scope.ok = function() {
			$mdDialog.hide($scope.save_competence_variable_list);
		};

	};

	AddCompetenceByVarController.$inject = ['_','$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', 'FileUploader', '$document', 'LocationFactory', 'LocationService', 'CompetenceVarJsonService', 'BaseMapService', 'competence_variables'];

	angular.module('add.competence.var.controller', []).
	controller('AddCompetenceByVarController', AddCompetenceByVarController);

})();
