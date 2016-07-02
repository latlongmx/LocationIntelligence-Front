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
        '<li class="m-list-functions__item js-analysis-item" data-af="heatmap" tooltip-placement="right" uib-tooltip="Mapa de Calor" tooltip-animation="true">',
        '<i class="m-list-functions__item-icon demo demo-heatmap"></i>',
        '</li>',
        '<li class="m-list-functions__item js-analysis-item" data-af="rings" tooltip-placement="right" uib-tooltip="Rangos de alcance" tooltip-animation="true">',
        '<i class="m-list-functions__item-icon demo demo-rings"></i>',
        '</li>',
        '</ul>',
      ].join(''),
      controller: function($scope) {
        var dm = this;

        _$js_analysis_item = angular.element(document.getElementsByClassName('js-analysis-item'));

        var _data_af = null;
        _$js_analysis_item.on('click', function(e) {
          e.preventDefault();
          $scope.analysisId = this.getAttribute('data-af');
          _data_af = this.getAttribute('data-af');
          if (_data_af) {
            $uibModal.open({
              controller: _data_af + 'ModalController',
              templateUrl: './components/analysis_functions/' + _data_af + '_modal/' + _data_af + '.tpl.html',
              animation: true,
              resolve: {
                analysisId: function() {
                  return $scope.analysisId;
                }
              }
            });
          }

          _data_ep = this.getAttribute('data-ep');
          _previousPanelActive = _currentPanelActive;
          _previous_data_side_panel = _current_data_side_panel;

          if (_data_ep) {
            $scope.valor = _data_ep;
            _currentPanelActive = angular.element(document.querySelector('[data-ep="' + _data_ep + '"]'));
            _current_data_side_panel = angular.element(document.getElementsByClassName('js-' + _data_ep + '-side-panel'));

            angular.equals(_previousPanelActive, _currentPanelActive) ? [_previousPanelActive = "", _currentPanelActive.removeClass('is-item-panel-active'), _currentPanelActive = ""] : _currentPanelActive.addClass('is-item-panel-active');
            if (_previousPanelActive) {
              !_currentPanelActive ? [_currentPanelActive.removeClass('is-item-panel-active'), _previousPanelActive = ""] : _previousPanelActive.removeClass('is-item-panel-active');
            }

            angular.equals(_previous_data_side_panel, _current_data_side_panel) ? [_previous_data_side_panel = "", _current_data_side_panel.removeClass('is-panel-open'), _current_data_side_panel = ""] : _current_data_side_panel.addClass('is-panel-open');
            if (_previous_data_side_panel) {
              !_current_data_side_panel ? [_current_data_side_panel.removeClass('is-panel-open'), _previous_data_side_panel = ""] : _previous_data_side_panel.removeClass('is-panel-open');
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
