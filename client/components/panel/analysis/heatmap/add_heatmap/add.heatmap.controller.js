(function(){
	/*
	* BaseMap Module
	*/
	'use strict';

	function AddHeatmapController(_, $scope, $mdDialog, $mdToast, $interval, $timeout, FileUploader, $document, LocationFactory, LocationService, BaseMapService, heatmap_variables, CompetenceService, BaseMapFactory){
		var _newHeatmapVariables = null,
		_resultOfProcess = null,
		_matchWordHeatmap = null,
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
		_heatmap_variable_id = [],
		_last_flag = null,
		countAdded = 0,
		_wkt = null;


		if (!$scope.save_heatmap_variable_list) {
			$scope.save_heatmap_variable_list = [];
		}

		if (!$scope._heatmap_variable_flag) {
			$scope._heatmap_variable_flag = [];
		}

		if (!$scope._heatmap_array) {
			$scope._heatmap_array = [];
		}

		if (!$scope._id_heatmap_layer_flag) {
			$scope._id_heatmap_layer_flag = [];
		}

		if (!$scope.is_simple_composed) {
			$scope.is_simple_composed = [];
		}

		/**
		 * Get competence variables
		 */
		// $scope.list = true;
		$scope.currentHeatmapVariables = {
			"title":"DENUE",
			"idCatalog": 2,
			"icon": "",
			"items": heatmap_variables
		};
		$scope.menu = $scope.currentHeatmapVariables;

		/**
		 * [ Methods and options for menu ]
		 */
		$scope.options_heat = {
			collapsed: false,
			fullCollapse: true,
			mode: 'cover',
			wrapperClass: 'multilevelpushmenu__in-heatmap',
			direction: 'ltr',
			backItemClass: 'backCompClass',
			backText: 'Atrás',
			onHeatItemClick: function(event, item) {
				_variable_id = item.id;
				_variable_name = item.name;
				
				_addHeatmapToList(event, _variable_name, _variable_id);
			}
		};

		/**
		 * [quickFilter Function to get filter values from catalog]
		 */
		$scope.quickHeatmapFilter = function(){
			$scope._heatmap_array = [];
			_resultOfProcess = null;
			_matchWordHeatmap = this.search_heatmap;

			/**
			 * [_newHeatmapVariables Get result of getObject Match words function]
			 */
			 var foundHeatmapLayer = [];
				var searchHeatmapLayer = function(obj, txt){
				  _.each(obj,function(o){
				    if( o.name && o.name.toLowerCase().indexOf(txt) !== -1){
				      foundHeatmapLayer.push(o);
				    }
				    if(o.menu && o.menu.items){
				      searchHeatmapLayer(o.menu.items, txt);
				    }
				  });
				};
				searchHeatmapLayer($scope.currentHeatmapVariables.items, _matchWordHeatmap.toLowerCase());

			_newHeatmapVariables = foundHeatmapLayer;
			if (_newHeatmapVariables && _matchWordHeatmap !== "") {
				$scope.menu = {
					title: 'Resultados',
					id: 'menuId',
					icon: '',
					items: _newHeatmapVariables
				};
				angular.forEach($scope.save_heatmap_variable_list, function(item){
					setTimeout(function(){
						_icon_data_id = angular.element(document.querySelector('[data-variable-id="'+item._variable_id+'"]'));
						_icon_data_id.addClass('fa fa-check').css(
							{"color": "#666470", "transition": "all linear 0.25s"}
						);
					}, 0);
				});
			}
			else {
				$scope.menu = $scope.currentHeatmapVariables;
				angular.forEach($scope.save_heatmap_variable_list, function(item){
					setTimeout(function(){
						_icon_data_id = angular.element(document.querySelector('[data-variable-id="'+item._variable_id+'"]'));
						_icon_data_id.addClass('fa fa-check').css(
							{"color": "#666470", "transition": "all linear 0.25s"}
						);
					}, 0);
				});
			}

			/**
			 * [getObject Search variable name, compare and get the result]
			 * @param  {[type]} theObject [variables of catalog]
			 */
			// function getObject(theObject) {
			// 	$scope._heatmap_array = [];
			// 	_.each(theObject,function(o){
			// 		var items = o.menu.items;
			// 		var found = _.filter(items,function(item){
			// 			return item.name.toLowerCase().indexOf( _matchWordHeatmap ) !== -1;
			// 		});
			// 		if(found.length > 0){
			// 			_.extend($scope._heatmap_array,found);
			// 		}
			// 	});
			// 	return $scope._heatmap_array;
			// }
		};

		/**
		 * [_addHeatmapToList Create Heatmap]
		 * @param  {[type]} param [description]
		 */
		var _addHeatmapToList = function(event, name, id) {
			if($scope._heatmap_variable_flag.indexOf(name) === -1){
				$scope._heatmap_variable_flag.push(name);
				$scope.save_heatmap_variable_list.push({_variable_name: name, _variable_id: id});
				$scope.is_simple_composed.push(id);
				countAdded = countAdded + 1;
				_showToastMessage('Se añadió ' + name);
			}

			else {
				for (var i=0; i<$scope._heatmap_variable_flag.length; i++){
					if ($scope._heatmap_variable_flag[i] === name){
						$scope._heatmap_variable_flag.splice(i,1);
						$scope.save_heatmap_variable_list.splice(i,1);
						$scope._id_heatmap_layer_flag.splice(i,1);
						$scope.is_simple_composed.splice(i,1);
						countAdded = countAdded - 1;
						break;
					}
				}
				_showToastMessage('Se removió ' + name);

			}
			angular.element(event.currentTarget.children)
			.toggleClass('fa fa-check')
			.css(
				{"color": "#C3EE97", "transition": "all linear 0.25s"}
			);
		};


		// $scope.removeVariable = function(parent,index) {
		// 	if ($scope.save_heatmap_variable_list[index].$index === true){
		// 		CompetenceService.delCompetence( $scope.save_heatmap_variable_list[index]._variable_id )
		// 		//BaseMapFactory.delPobVivWMS();
		// 		$scope.save_heatmap_variable_list.splice(index,1);
		// 		$scope._heatmap_variable_flag.splice(index,1);
		// 	}
		// 	else {
		// 		CompetenceService.delCompetence( $scope.save_heatmap_variable_list[index]._variable_id )
		// 		$scope.save_heatmap_variable_list.splice(index,1);
		// 		$scope._heatmap_variable_flag.splice(index,1);
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
		$scope.ok = function(form, field) {
			if(form.$valid === true && $scope.is_simple_composed.join() !== ""){
				BaseMapService.map.then(function (map) {
					_wkt = BaseMapFactory.bounds2polygonWKT(map.getBounds());
					BaseMapService.addUserHeatMap({
						'nm':field.category_name,
						'cod':$scope.is_simple_composed.join(),
						'bnd':_wkt
					})
					.then(function(result){
						if (result.data.res === "correcto") {
							$mdDialog.hide(true);
						}
					}, function(error){
						console.log(error);
					});
				});
			}
		};

	};

	AddHeatmapController.$inject = ['_','$scope', '$mdDialog', '$mdToast', '$interval', '$timeout', 'FileUploader', '$document', 'LocationFactory', 'LocationService', 'BaseMapService', 'heatmap_variables', 'CompetenceService', 'BaseMapFactory'];

	angular.module('add.heatmap.controller', []).
	controller('AddHeatmapController', AddHeatmapController);

})();
