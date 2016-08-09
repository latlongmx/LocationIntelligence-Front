(function() {
  /**
   *  KlDirective Directive
   */
  'use strict';

  function timeringsDirective(BaseMapService, BaseMapFactory, Auth, $compile, $mdToast, $document) {

    var _$js_accessibility_side_panel = null,
      _$js_accessibility_item = null,
      _map = null;

    var _layers = {};
    var _$userDraws = null;
    var _$userDrawsGeoms = [];
    var _$panel;
		var _$timeRingsBtns;

    r360.config.serviceKey = '8Y81HNSQYTTMBTFXHFF7'; //<-- KEY joyce@latlong.mx
    r360.config.serviceUrl = 'https://service.route360.net/na_southeast/';
    var _polygonRings = r360.leafletPolygonLayer();
    var _travelOptions = r360.travelOptions();
    var _timeRing = 30;
    var _typeRing = 'car';  // bike walk car transit
    var _targetRing;
    var _marker;
    var _blueMarker;

    var _$contentCount = {
      vehi: undefined,
      trns: undefined
    };

    return {
      restrict: 'E',
      replace: true,
      require: '^panelFunctions',
      scope: '=',
      template: [
        '<div>',
        '<li class="m-list-functions__item js-panel-item js-timering-side-panel" data-ep="rings" tooltip-placement="right" uib-tooltip="Rangos de alcance" tooltip-animation="true">',
        '<img src="./images/functions/rings_icon.png" class="m-list-functions__item-icon" data-icon="rings_icon"/>',
        '</li>',

				'<div id="timeRingsBtns" class="hide" style="position: absolute;top: 50px; left: 50px;">', //

        // Tiempo
        '<md-fab-speed-dial md-open="false" md-direction="right" ng-class="md-fling" class="md-fab-float">',
        '  <md-fab-trigger>',
        '    <md-button class="md-fab md-warn" aria-label="30 min"><i class="material-icons">av_timer</i></md-button>',
        '  </md-fab-trigger>',
        '   <md-fab-actions>',
        '     <md-button ng-click="setTimeRing(1800)" class="md-fab md-raised md-mini" aria-label="39">30</md-button>',
        '     <md-button ng-click="setTimeRing(1500)" class="md-fab md-raised md-mini" aria-label="25">25</md-button>',
        '     <md-button ng-click="setTimeRing(1200)" class="md-fab md-raised md-mini" aria-label="20">20</md-button>',
        '     <md-button ng-click="setTimeRing(900)" class="md-fab md-raised md-mini" aria-label="15">15</md-button>',
        '     <md-button ng-click="setTimeRing(600)" class="md-fab md-raised md-mini" aria-label="10">10</md-button>',
        '     <md-button ng-click="setTimeRing(300)" class="md-fab md-raised md-mini" aria-label="5">5</md-button>',
        '   </md-fab-actions>',
        '</md-fab-speed-dial>',

        // Tipo de viaje
        '<md-fab-speed-dial md-open="false" md-direction="right" ng-class="md-fling" class="md-fab-float">',
        '  <md-fab-trigger>',
        '    <md-button class="md-fab md-warn" aria-label="bus"><i class="material-icons">drive_eta</i></md-button>',
        '  </md-fab-trigger>',
        '   <md-fab-actions>', //bike walk car transit
        '     <md-button ng-click="setTypeRing(\'transit\')" class="md-fab md-raised md-mini" aria-label="transit">transit</md-button>',
        '     <md-button ng-click="setTypeRing(\'car\')" class="md-fab md-raised md-mini" aria-label="car">car</md-button>',
        '     <md-button ng-click="setTypeRing(\'bike\')" class="md-fab md-raised md-mini" aria-label="bike">bike</md-button>',
        '     <md-button ng-click="setTypeRing(\'walk\')" class="md-fab md-raised md-mini" aria-label="walk">walk</md-button>',
        '   </md-fab-actions>',
        '</md-fab-speed-dial>',

        //AGREGAR
        '<md-fab-speed-dial md-open="false" md-direction="right" ng-class="md-fling" class="md-fab-float">',
        '  <md-fab-trigger>',
        '    <md-button ng-click="startTravelRing()" class="md-fab md-warn" aria-label="bus"><i class="material-icons">room</i></md-button>',
        '  </md-fab-trigger>',
        '</md-fab-speed-dial>',

        //Limpiar
        '<md-fab-speed-dial md-open="false" md-direction="right" ng-class="md-fling" class="md-fab-float">',
        '  <md-fab-trigger>',
        '    <md-button ng-click="removeTravelRings()" class="md-fab md-warn" aria-label="bus"><i class="material-icons">delete</i></md-button>',
        '  </md-fab-trigger>',
        '</md-fab-speed-dial>',

        '</div>',
				'</div>'
      ].join(''),
      link: function(scope, element, attr, potencialCtrl) {

        BaseMapService.map.then(function(map) {
          _map = map;
          //Correcccion compatibilidad leaflet 1.0
          _polygonRings._layerAdd = function(options) {
            this.onAdd(options.target);
          };
          _polygonRings.addTo(_map);
          _map.on('click', scope.onClickMap);
        });

        _$panel = angular.element(document.getElementsByClassName('js-timering-side-panel')[0]);
        _$timeRingsBtns = angular.element(document.getElementById('timeRingsBtns'));

        _blueMarker = L.icon({
          iconUrl: 'https://developers.route360.net/download/basic-example/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });

        scope.onClickMap = function(evt) {
          if (_$panel.data('start_time') === true) {
            _targetRing = evt.latlng;
            if(_marker === undefined){
              _marker = L.marker((_targetRing), {
                icon: _blueMarker
              }).addTo(_map);
            }else{
              _marker.setLatLng(_targetRing).addTo(_map);
            }
            scope.callTravelRings();
          }
        };

        _$panel.on('click', function() {
					_$timeRingsBtns.toggleClass('hide');
        });

        scope.startTravelRing = function(){
          if (_$panel.data('start_time') === undefined || _$panel.data('start_time') === true) {
            _$panel.data('start_time', false);
          } else {
            _$panel.data('start_time', true);
          }
        };

        scope.removeTravelRings = function(){
          _polygonRings.clearLayers();
          _map.removeLayer(_marker);
        };

        scope.setTimeRing = function(time){
          _timeRing = time;
          scope.callTravelRings();
        };
        scope.setTypeRing = function(type){
          _typeRing = type;
          scope.callTravelRings();
        };

        scope.callTravelRings = function(){
          _travelOptions.setSources( [_targetRing] );
          var times = [300, 600, 900, 1200, 1500, 1800];
          var timeSelected = _.filter(times, function(n){
            return n <= _timeRing;
          });
          _travelOptions.setTravelTimes( timeSelected );
          _travelOptions.setTravelType( _typeRing );
          r360.PolygonService.getTravelTimePolygons( _travelOptions, function(polygons) {
            _polygonRings.clearAndAddLayers(polygons, false);
          });
        };
        

      },
      controller: function($scope) {}
    };
  }

  timeringsDirective.$inject = ['BaseMapService', 'BaseMapFactory', 'Auth', '$compile', '$mdToast', '$document'];
  angular.module('timerings.directive', [])
    .directive('timerings', timeringsDirective);
})();
