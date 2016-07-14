(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function AddCompetenceByVarController(_, $scope, $mdDialog, $mdToast, $interval, $timeout, FileUploader, $document, LocationFactory, LocationService, CompetenceVarJsonService, BaseMapService, competence_variables, CompetenceService, competence_variables_selected){
		$scope.bounds = null;
		$scope.nw = null;
		$scope.se = null;
		$scope.bbox = null;
		var countAdded = 0;
		BaseMapService.map.then(function (map) {
			$scope.bounds = map.getBounds();
			$scope.nw = $scope.bounds.getNorthWest();
			$scope.se = $scope.bounds.getSouthEast();
			$scope.bbox = [$scope.nw.lng, $scope.se.lat, $scope.se.lng, $scope.nw.lat].join(',');
		});
		var _newCompetenceVariables = null,
		_resultOfProcess = null,
		_matchWordCompetence = null,
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
		_competence_variable_id = [],
		_current_competence_variable_id = null,
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

		if (!$scope._id_layer_flag) {
			$scope._id_layer_flag = [];
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
		 * Get competence variables
		 */
		$scope.list = true;
		$scope.currentCompetenceVariables = {
			"title":"DENUE",
			"idCatalog": 2,
			"icon": "",
			"items": competence_variables
		};
		$scope.menu = $scope.currentCompetenceVariables;

		// _.each(_current_competence_variable_id, function(index){
		// 	setTimeout(function(){
		// 		_icon_data_id = angular.element(document.querySelector('[data-variable-id="'+index+'"]'));
		// 		_icon_data_id
		// 		.toggleClass('fa-eye-slash fa-eye')
		// 		.toggleClass('is-added-to-map')
		// 	}, 0);
		// });

		/**
		 * [ Methods and options for menu ]
		 */
		$scope.options_com = {
			collapsed: false,
			fullCollapse: true,
			mode: 'cover',
			wrapperClass: 'multilevelpushmenu__in-competence',
			direction: 'ltr',
			backItemClass: 'backCompClass',
			backText: 'Atrás',
			onComItemClick: function(event, item) {
				_variable_id = item.id;
				_variable_name = item.name;

				if($scope._competence_variable_flag.indexOf(_variable_name) === -1){
					$scope._competence_variable_flag.push(_variable_name);
					$scope.save_competence_variable_list.push({_variable_name: _variable_name, _variable_id: _variable_id});
					_addCompetenceToList(_variable_name, _variable_id);
				}

				else {
					for (var i=0; i<$scope._competence_variable_flag.length; i++){
						if ($scope._competence_variable_flag[i] === _variable_name){
							$scope._competence_variable_flag.splice(i,1);
							$scope.save_competence_variable_list.splice(i,1);
							CompetenceService.delCompetence( $scope._id_layer_flag[i] )
							$scope._id_layer_flag.splice(i,1);
							countAdded = countAdded - 1;
							break;
						}
					}
					_showToastMessage('Se removió ' + _variable_name);

				}
				angular.element(event.currentTarget.children)
				.toggleClass('fa fa-check')
				.css(
					{"color": "#828189", "transition": "all linear 0.25s"}
				);
			}
		};

		/**
		 * [quickFilter Function to get filter values from catalog]
		 */
		$scope.quickCompetenceFilter = function(){
			$scope._competence_array = [];
			_resultOfProcess = null;
			_matchWordCompetence = this.search_competence;

			/**
			 * [_newCompetenceVariables Get result of getObject Match words function]
			 */
			 var found = [];
				var searchCompetence = function(obj, txt){
					_.each(obj,function(o){
						if( o.name && o.name.toLowerCase().indexOf(txt) !== -1){
							found.push(o);
						}
						if(o.menu && o.menu.items){
							searchCompetence(o.menu.items, txt);
						}
					});
				};
				searchCompetence($scope.currentCompetenceVariables.items, _matchWordCompetence.toLowerCase());

			_newCompetenceVariables = found; //getObject($scope.currentCompetenceVariables.items);
			if (_newCompetenceVariables && _matchWordCompetence !== "") {
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
							{"color": "#828189", "transition": "all linear 0.25s"}
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
							{"color": "#828189", "transition": "all linear 0.25s"}
						);
					}, 0);
				});
			}
		};

		/**
		 * [_addCompetenceToList Create Heatmap]
		 * @param  {[type]} param [description]
		 */
		var _addCompetenceToList = function(param, id) {
			$scope.addingCompetence = true;
			var formData = new FormData();
			var pin = "";
			formData.append('qf', "cod:"+id );
			formData.append('qb', $scope.bbox );
			formData.append('competence', "1" );
			formData.append('nm', param );
			formData.append('pin', pin );

			BaseMapService.addCompetenciaQuery(formData)
			.then(function(result){
				if (result.statusText === 'OK') {
					$scope.addingCompetence = false;
					countAdded = countAdded + 1;
					$scope._id_layer_flag.push(result.data.id_layer);
					_competence_variable_id.push(id);
					_showToastMessage('Se agregó ' + _variable_name);
			 }
			}, function(error){
				console.log(error);
			});
		};


		// $scope.removeVariable = function(parent,index) {
		// 	if ($scope.save_competence_variable_list[index].$index === true){
		// 		CompetenceService.delCompetence( $scope.save_competence_variable_list[index]._variable_id )
		// 		//BaseMapFactory.delPobVivWMS();
		// 		$scope.save_competence_variable_list.splice(index,1);
		// 		$scope._competence_variable_flag.splice(index,1);
		// 	}
		// 	else {
		// 		CompetenceService.delCompetence( $scope.save_competence_variable_list[index]._variable_id )
		// 		$scope.save_competence_variable_list.splice(index,1);
		// 		$scope._competence_variable_flag.splice(index,1);
		// 	}
		// }

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
					parent: $document[0].querySelector('.md-dialog-cotainer'),
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
			$mdDialog.hide({count: countAdded, success: true, selected: _competence_variable_id});
		};

	};

	AddCompetenceByVarController.$inject = ['_','$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', 'FileUploader', '$document', 'LocationFactory', 'LocationService', 'CompetenceVarJsonService', 'BaseMapService', 'competence_variables', 'CompetenceService', 'competence_variables_selected'];

	angular.module('add.competence.var.controller', []).
	controller('AddCompetenceByVarController', AddCompetenceByVarController);

})();
