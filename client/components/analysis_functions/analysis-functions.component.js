(function() {
  /**
   *  Analisis Directive
   */
  'use strict';

  function AnalysisFunctions($uibModal) {
    var _$js_analysis_item = null,
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
          '<accessibility></accessibility>',
          '<li class="m-list-functions__item js-analysis-item" data-af="od" tooltip-placement="right" uib-tooltip="Origen Destino" tooltip-animation="true">',
            '<i class="m-list-functions__item-icon demo demo-origin-destiny"></i>',
          '</li>',
          '<heatmap></heatmap>',
          '<li class="m-list-functions__item js-analysis-item" data-af="rings" tooltip-placement="right" uib-tooltip="Rangos de alcance" tooltip-animation="true">',
            '<i class="m-list-functions__item-icon demo demo-rings"></i>',
          '</li>',
        '</ul>',
      ].join(''),
      controller: function($scope) {
        var dm = this;
        $scope.heatmap_list = false;

        _$js_analysis_item = angular.element(document.getElementsByClassName('js-analysis-item'));

        _$js_analysis_item.on('click', function(e){
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
              $scope.heatmap_list = true;
              LocationService.getLocations()
              .then(function(res){
                if(res.data && res.data.places){
                  $scope.heatmap_list = false;
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
        });
      }
    };
  }

  AnalysisFunctions.$inject = ['$uibModal'];

  angular.module('analysis.directive', [])
    .directive('analysisFunctions', AnalysisFunctions);
})();
