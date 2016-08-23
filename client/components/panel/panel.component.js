(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function panelFunctions($rootScope, $timeout, Auth, uiService, LocationService, BaseMapFactory, BaseMapService, CompetenceService, odService, AccessibilityService){
		var _$js_exploration_item = null,
		_data_ep = null,
		_currentPanelActive = null,
		_previousPanelActive = null,
		_current_data_side_panel = null,
		_previous_data_side_panel = null,
		_currentIconActive = null,
		_previousIconActive = null,
		_data_panel = null,
		_data_icon = null,
		_currentPanelId = null;

		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<location></location>',
					'<competence></competence>',
					'<demography></demography>',
				'</ul>',
				'<ul class="m-list-functions">',
					'<accessibility></accessibility>',
					'<od></od>',
					'<heatmap></heatmap>',
					'<timerings></timerings>',
				'</ul>',
			].join(''),
			controller: function($scope){
				var dm = this,
				cityFile = null,
				cityLayer = null;
				$scope.location_list = false;
				$scope.competence_list = false;
				$scope.isTimeOpen = false;
				$scope.isTripOpen = false;
				$scope.isOpen = false;
				
				// if ($rootScope.thisUser) {
				// 	$rootScope.thisUser === "uA" ? $scope.hasPermission = false : $scope.hasPermission = true;
				// }

				_$js_exploration_item = angular.element(document.getElementsByClassName('js-panel-item'));

				_$js_exploration_item.on('click', function(e){
					e.preventDefault();
					_data_ep = this.getAttribute('data-ep');
					_currentPanelId = angular.element(document.querySelector('[data-ep="'+_data_ep+'"]'));
					_currentIconActive = angular.element(this).children().data('icon');
					_current_data_side_panel = angular.element(document.getElementsByClassName('js-'+_data_ep+'-side-panel'));
					uiService.panelIsOpen(_currentPanelId, _currentIconActive, _current_data_side_panel);
					//uiService.listIsLoaded(_data_ep);

					if (_data_ep === "demography"){
						// if (!$scope.locations){
						// 	$scope.location_list = true;

						// 	LocationService.getLocations()
						// 	.then(function(res){
						// 		if(res.data && res.data.places){
						// 			$scope.location_list = false;
						// 			$scope.locations = res.data.places;
						// 			_.each(res.data.places,function(o){
						// 				var id = o.id_layer+'-'+o.name_layer.replace(' ','_');
						// 				BaseMapFactory.addLocation({
						// 					name: id,
						// 					data: o.data,
						// 					extend: o.extend
						// 				});
						// 			});
						// 		}
						// 	});
						// }
					}

					if (_data_ep === "location"){
						if (!$scope.locations){
							$scope.location_list = true;

							LocationService.getLocations()
							.then(function(res){
								if(res.data && res.data.places){
									$scope.location_list = false;
									$scope.locations = res.data.places;
									_.each(res.data.places,function(o){
										var id = o.id_layer+'-'+o.name_layer.replace(' ','_');
										BaseMapFactory.addLocation({
											name: id,
											data: o.data,
											extend: o.extend
										});
									});
								}
							});
						}
					}

					if (_data_ep === "competence"){
						if (!$scope.save_competence_variable_list){
							$scope.competence_list = true;

							CompetenceService.getCompetences({
								competence: '1'
							})
							.then(function(res){
								if(res.data && res.data.places){
									$scope.competence_list = false;
									$scope.save_competence_variable_list = res.data.places;
									_.each(res.data.places,function(o){
										var id = o.id_layer+'-'+o.name_layer.replace(' ','_');
										BaseMapFactory.addLocation({
											name: id,
											data: o.data,
											extend: o.extend
										});
									});
								}
							});
						}
					}

					if (_data_ep === "heatmap"){
						if (!$scope.save_heatmap_variable_list){
							$scope.heatmap_list = true;
							BaseMapService.getUserHeatMap().then(function(res){
								if(res.data && res.data.heats){
									$scope.heatmap_list = false;
									$scope.save_heatmap_variable_list = res.data.heats;
								}
							});
						}
					}

					if (_data_ep === "od"){
						cityFile = DFGeoJson;
						uiService.odIsOpen(_data_ep, cityFile);
						dm.setLayer = cityFile;

					}

					if (_data_ep !== "od"){
						uiService.removeCityLayer();
						odService.removeMarker();
						$scope.selected_zc = false;
					}

					if (_data_ep === "accessibility") {
						if (!$scope.userDraws){
							$scope.user_draws = false;
							AccessibilityService.getUserDraws().then(function(res){
								if (res.data && res.data.draws) {
									$scope.user_draws = true;
									_.each(res.data.draws, function(o){
										var geo;
										var img = '';
										if(o.type_draw==='circle'){
											geo = {
													layerType: o.type_draw,
													layer: L.circle([o.gjson.lat, o.gjson.lng], o.gjson.radius, {
														color: '#81A1C1'
													})
												};
											img = 'demo-radio area-tool';
										}else{
											var coords = _.map(o.gjson.latlngs,function(o){
												return [o.lat, o.lng];
											});
											geo = {
													layerType: o.type_draw,
													layer: L.polygon(coords, {
														color: '#81A1C1'
													})
												};
											img = 'demo-area polygon-tool';
										}
										o.isActive = false;
										o.draw = geo;
										o.icon = img;
									});

									$scope.userDraws = res.data.draws;
								}
							});
						}
					}

				});
			}

		};
	}

	panelFunctions.$inject = ['$rootScope','$timeout', 'Auth', 'uiService', 'LocationService', 'BaseMapFactory', 'BaseMapService', 'CompetenceService', 'odService', 'AccessibilityService'];

	angular.module('walmex').directive('panelFunctions', panelFunctions);
})();
