(function(){
	/*
	* UI Module
	*/
	'use strict';
	
	function uiService($mdDialog, BaseMapService, odService){
		var _previousPanelActive = null,
		_previousIconActive = null,
		_previous_data_side_panel = null,
		_currentPanelActive = null,
		_currentIconActive = null,
		_current_data_side_panel = null,
		_od_active = null,
		_od_previous = null,
		cityLayerGroup = new L.LayerGroup();
		
		/* Template for Loader progress */
		this.loaderTemplate = [
			'<div class="m-loading">',
				'<div id="floatingCirclesG">',
					'<div class="f_circleG" id="frotateG_01"></div>',
					'<div class="f_circleG" id="frotateG_02"></div>',
					'<div class="f_circleG" id="frotateG_03"></div>',
					'<div class="f_circleG" id="frotateG_04"></div>',
					'<div class="f_circleG" id="frotateG_05"></div>',
					'<div class="f_circleG" id="frotateG_06"></div>',
					'<div class="f_circleG" id="frotateG_07"></div>',
					'<div class="f_circleG" id="frotateG_08"></div>',
				'</div>',
			'</div>',
		].join('');

		/* Login */
		this.addLogginIsLoading = function(button, message){
			button.attr("disabled", true);
			button.text(message);
		}

		this.removeLogginIsLoading = function(button, message){
			button.attr("disabled", false);
			button.text(message);
		}

		this.cleanInputs = function(inputs){
			inputs.value = "";
		}

		/* Loader layer map */
		this.layerIsLoading = function(){
			return angular.element(document.getElementsByTagName("body")).append(this.loaderTemplate);
		}

		this.layerIsLoaded = function(){
			return angular.element(document.getElementsByClassName('m-loading')).remove();
		}
		
		/* Panel */
		this.changeCurrentPanel = function(boo, layer) {
			if(boo === true){
				if (_currentPanelActive) {
					_currentPanelActive.children().attr('src', './images/functions/'+_currentIconActive+'.png');
					_currentPanelActive.removeClass('is-item-panel-active');
					_current_data_side_panel.removeClass('is-panel-open');
					_currentIconActive = "";
					_currentPanelActive = "";
					_current_data_side_panel = "";
				}
			}
			else {
				if(_currentPanelActive){
					_currentPanelActive.children().attr('src', './images/functions/'+_currentIconActive+'_active.png');
					_currentPanelActive.addClass('is-item-panel-active');
					_current_data_side_panel.addClass('is-panel-open');
				}
			}
		}

		this.changePreviousPanel = function() {
			_previousPanelActive.children().attr('src', './images/functions/'+_previousIconActive+'.png');
			_previousPanelActive.removeClass('is-item-panel-active');
			_previous_data_side_panel.removeClass('is-panel-open');
			this.removeCityLayer();
		}

		this.panelIsOpen = function(currentPanelId, currentIcon, currentPanel, layer){
			_previousPanelActive = _currentPanelActive;
			_previousIconActive = _currentIconActive;
			_previous_data_side_panel = _current_data_side_panel;

			_currentPanelActive = currentPanelId;
			_currentIconActive = currentIcon;
			_current_data_side_panel = currentPanel;

			_previousIconActive === _currentIconActive ? this.changeCurrentPanel(true) : this.changeCurrentPanel();
			if(_previousIconActive){
				!_currentIconActive ? this.changeCurrentPanel() : this.changePreviousPanel();
			}

			_previousPanelActive ===  _currentPanelActive ? this.changeCurrentPanel(true) : this.changeCurrentPanel();
			if(_previousPanelActive){
				!_currentPanelActive ? [this.changeCurrentPanel(true), this.addCityLayer(layer)] : this.changePreviousPanel();
			}
			_previous_data_side_panel === _current_data_side_panel ? this.changeCurrentPanel(true) : this.changeCurrentPanel();
			if(_previous_data_side_panel){
				!_current_data_side_panel ? this.changeCurrentPanel(true) : this.changePreviousPanel();
			}
		}
		
		/* Layer OD */
		this.addCityLayer = function(layer) {
			if (layer) {
				cityLayerGroup.addLayer(odService.loadMap(layer));
				BaseMapService.map.then(function (map) {
					cityLayerGroup.addTo(map);
				});
			}
		}

		this.removeCityLayer = function() {
			cityLayerGroup.clearLayers();
			_od_active = "";
		}

		this.odIsOpen = function(od, data) {
			_od_previous = _od_active;
			_od_active = od;
			if (_od_previous !== _od_active){
				this.addCityLayer(data);
			}
		}
		
		
		// this.listIsLoaded = function(currentId){
		// 	if (currentId === "location"){
		// 		if (!$scope.locations){
		// 			$scope.location_list = true;
					
		// 			LocationService.getLocations()
		// 			.then(function(res){
		// 				if(res.data && res.data.places){
		// 					$scope.location_list = false;
		// 					$scope.locations = res.data.places;
		// 					_.each(res.data.places,function(o){
		// 						var id = o.id_layer+'-'+o.name_layer.replace(' ','_');
		// 						BaseMapFactory.addLocation({
		// 							name: id,
		// 							data: o.data,
		// 							extend: o.extend
		// 						});
		// 					});
		// 				}
		// 			});
		// 		}
		// 	}

		// 	if (currentId === "competence"){
		// 		if (!$scope.save_competence_variable_list){
		// 			$scope.competence_list = true;
					
		// 			CompetenceService.getCompetences({
		// 				competence: '1'
		// 			})
		// 			.then(function(res){
		// 				if(res.data && res.data.places){
		// 					$scope.competence_list = false;
		// 					$scope.save_competence_variable_list = res.data.places;
		// 					_.each(res.data.places,function(o){
		// 						var id = o.id_layer+'-'+o.name_layer.replace(' ','_');
		// 						BaseMapFactory.addLocation({
		// 							name: id,
		// 							data: o.data,
		// 							extend: o.extend
		// 						});
		// 					});
		// 				}
		// 			});
		// 		}
		// 	}

		// 	if (currentId === "heatmap"){
		// 		if (!$scope.save_heatmap_variable_list){
		// 			$scope.heatmap_list = true;
		// 			BaseMapService.getUserHeatMap().then(function(res){
		// 				if(res.data && res.data.heats){
		// 					$scope.heatmap_list = false;
		// 					$scope.save_heatmap_variable_list = res.data.heats;
		// 				}
		// 			});
		// 		}
		// 	}
		// }

	}
	uiService.$inject = ['$mdDialog', 'BaseMapService', 'odService'];
	angular.module('ui.service', []).service('uiService', uiService);
})();
