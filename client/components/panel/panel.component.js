(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function panelFunctions(LocationService, BaseMapFactory, BaseMapService, $timeout, Auth, CompetenceService){
		var _$js_exploration_item = null,
		_data_ep = null,
		_currentPanelActive = null,
		_previousPanelActive = null,
		_current_data_side_panel = null,
		_previous_data_side_panel = null,
		_currentIconActive = null,
		_previousIconActive = null,
		_data_panel = null,
		_data_icon = null;

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
					'<li class="m-list-functions__item js-panel-item" data-ep="od" tooltip-placement="right" uib-tooltip="Origen Destino" tooltip-animation="true">',
						'<img src="./images/functions/od_icon.png" class="m-list-functions__item-icon" data-icon="od_icon"/>',
					'</li>',
					'<heatmap></heatmap>',
					'<li class="m-list-functions__item js-panel-item" data-ep="rings" tooltip-placement="right" uib-tooltip="Rangos de alcance" tooltip-animation="true">',
						'<img src="./images/functions/rings_icon.png" class="m-list-functions__item-icon" data-icon="rings_icon"/>',
					'</li>',
				'</ul>',
			].join(''),
			controller: function($scope){
				var dm = this;
				$scope.location_list = false;
				$scope.competence_list = false;

				_$js_exploration_item = angular.element(document.getElementsByClassName('js-panel-item'));

				_$js_exploration_item.on('click', function(e){
					e.preventDefault();
					//_data_icon = angular.element(this).children().data('icon');
					_data_ep = this.getAttribute('data-ep');
					_previousPanelActive = _currentPanelActive;
					
					_previous_data_side_panel = _current_data_side_panel;
					_previousIconActive = _currentIconActive;
					$scope.valor = _data_ep;

					_currentPanelActive = angular.element(document.querySelector('[data-ep="'+_data_ep+'"]'));
					_current_data_side_panel = angular.element(document.getElementsByClassName('js-'+_data_ep+'-side-panel'));
					_currentIconActive = angular.element(this).children().data('icon');

					angular.equals(_previousIconActive, _currentIconActive) ? [_previousIconActive = "", _currentPanelActive.children().attr('src', './images/functions/'+_currentIconActive+'.png'),  _currentIconActive = ""] : _currentPanelActive.children().attr('src', './images/functions/'+_currentIconActive+'_active.png');
					if(_previousIconActive){
						!_currentIconActive ? [_currentPanelActive.children().attr('src', './images/functions/'+_currentIconActive+'_active.png'), _previousIconActive = ""] : _previousPanelActive.children().attr('src', './images/functions/'+_previousIconActive+'.png');
					}
					angular.equals(_previousPanelActive, _currentPanelActive) ? [_previousPanelActive = "", _currentPanelActive.removeClass('is-item-panel-active'), _currentPanelActive = ""] : [_currentPanelActive.addClass('is-item-panel-active')];
					if(_previousPanelActive){
						!_currentPanelActive ? [_currentPanelActive.removeClass('is-item-panel-active'), _previousPanelActive = ""] :[_previousPanelActive.removeClass('is-item-panel-active')];
					}

					angular.equals(_previous_data_side_panel, _current_data_side_panel) ? [_previous_data_side_panel = "", _current_data_side_panel.removeClass('is-panel-open'),  _current_data_side_panel = ""] : _current_data_side_panel.addClass('is-panel-open');
					if(_previous_data_side_panel){
						!_current_data_side_panel ? [_current_data_side_panel.removeClass('is-panel-open'), _previous_data_side_panel = ""] : _previous_data_side_panel.removeClass('is-panel-open');
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
				});
			}
			
		};
	}

	panelFunctions.$inject = ['LocationService', 'BaseMapFactory', 'BaseMapService', '$timeout', 'Auth', 'CompetenceService'];

	angular.module('panel.directive', [])
		.directive('panelFunctions', panelFunctions);
})();
