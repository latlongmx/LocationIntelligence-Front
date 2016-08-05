(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function panelFunctions($rootScope, $timeout, Auth, uiService, LocationService, BaseMapFactory, BaseMapService, CompetenceService, odService){
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
					'<li class="m-list-functions__item js-panel-item" data-ep="rings" tooltip-placement="right" uib-tooltip="Rangos de alcance" tooltip-animation="true">',
						'<img src="./images/functions/rings_icon.png" class="m-list-functions__item-icon" data-icon="rings_icon"/>',
					'</li>',
				'</ul>',
			].join(''),
			controller: function($scope){
				var dm = this,
				cityFile = null,
				cityLayer = null;
				$scope.location_list = false;
				$scope.competence_list = false;

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

				});
			}
			
		};
	}

	panelFunctions.$inject = ['$rootScope','$timeout', 'Auth', 'uiService', 'LocationService', 'BaseMapFactory', 'BaseMapService', 'CompetenceService', 'odService'];

	angular.module('panel.directive', [])
		.directive('panelFunctions', panelFunctions);
})();
