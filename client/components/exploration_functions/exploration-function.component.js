(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function explorationFunctions(LocationService, BaseMapFactory, $timeout, Auth){
		var _$js_exploration_item = null,
		_data_ep = null,
		_currentPanelActive = null,
		_previousPanelActive = null,
		_current_data_side_panel = null,
		_previous_data_side_panel = null,
		_data_panel = null;

		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<location></location>',
					'<competence></competence>',
					'<demography></demography>',
					'<potential></potential>',
				'</ul>',
			].join(''),
			controller: function($scope){
				var dm = this;
				$scope.location_list = false;
				$scope.competence_list = false;
				
				_$js_exploration_item = angular.element(document.getElementsByClassName('js-exploration-item'));

				_$js_exploration_item.on('click', function(e){
					e.preventDefault();
					_data_ep = this.getAttribute('data-ep');
					_previousPanelActive = _currentPanelActive;
					_previous_data_side_panel = _current_data_side_panel;
					$scope.valor = _data_ep;
					_currentPanelActive = angular.element(document.querySelector('[data-ep="'+_data_ep+'"]'));
					_current_data_side_panel = angular.element(document.getElementsByClassName('js-'+_data_ep+'-side-panel'));

					angular.equals(_previousPanelActive, _currentPanelActive) ? [_previousPanelActive = "", _currentPanelActive.removeClass('is-item-panel-active'), _currentPanelActive = ""] : _currentPanelActive.addClass('is-item-panel-active');
					if(_previousPanelActive){
						!_currentPanelActive ? [_currentPanelActive.removeClass('is-item-panel-active'), _previousPanelActive = ""] : _previousPanelActive.removeClass('is-item-panel-active');
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
									console.log(res.data.places)
									$scope.location_list = false;
									$scope.locations = res.data.places;
									_.each(res.data.places,function(o){
										var id = o.id_layer+'-'+o.name_layer.replace(' ','_');
										BaseMapFactory.addLocation({
											name: id,
											data: o.data
										});
									});
								}
							});
						}
					}
					if (_data_ep === "competence"){
						if (!$scope.competences){
							$scope.competence_list = true;
							LocationService.getLocations({
								competence: '1'
							})
							.then(function(res){
								if(res.data && res.data.places){
									$scope.competence_list = false;
									$scope.competences = res.data.places;
									_.each(res.data.places,function(o){
										var id = o.id_layer+'-'+o.name_layer.replace(' ','_');
										BaseMapFactory.addLocation({
											name: id,
											data: o.data
										});
									});
								}
							});
						}
					}
				});

			}
		};
	}

	explorationFunctions.$inject = ['LocationService', 'BaseMapFactory', '$timeout', 'Auth'];

	angular.module('exploration.directive', [])
		.directive('explorationFunctions', explorationFunctions);
})();
