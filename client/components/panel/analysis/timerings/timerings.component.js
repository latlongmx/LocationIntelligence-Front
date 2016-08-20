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
    var _$userRings = null;
    var _$userRingsGeoms = [];
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
        '<div class="m-side-panel js-rings-side-panel">',
        '<h3 class="m-side-panel__title">Rangos de alcance</h3>',
          '<div class="m-side-panel__list m-side-panel__list--in-accessibility__analysis-area">',

            '<div layout="row">',
              '<div layout="row" flex="40" layout-align="center center">',
                '<div flex="75">',
                  '<h5 class="m-side-panel__subtitle m-side-panel__subtitle--in-locations-actions">Agregar rango de alcance</h5>',
                '</div>',
                '<div flex="25">',
                  '<md-button class="md-fab md-mini md-primary" ng-click="addRing()">',
                    '<md-icon>add</md-icon>',
                  '</md-button>',
                '</div>',
              '</div>',
            '</div>',

            '<div>',
            '<h3 class="m-side-panel__user-title">Mis rangos:</h3>',
            '<ul id="accessPanelUserRingss" class="m-side-panel__list-content m-side-panel__list-content--in-accessibility" ng-if="user_draws">',
              '<li ng-repeat="ring in userRings" class="m-side-panel__list-content__item">',
                '<md-input-container flex="60" class="m-side-panel__list-content__item__md-input-container" layout-align="center center">',
                  '<input ng-change="updateNameUserRing(ring.id_ring, ring.name_ring)" aria-label="ring.id_ring" ng-model-options="{debounce: 750}" ng-model="ring.name_ring" >',
                '</md-input-container>',
                '<p flex="10" class="m-side-panel__list-content__item-single">',
                '<i class="demo {{ring.icon}}"></i>',
                '</p>',
                '<md-switch data-idring="ring.id_ring" aria-label="ring.id_ring" ng-model="ring.isActive" flex="10" data-idring="ring.id_ring" ng-change="turnOnOffRing(ring.id_ring)" ng-model="layer" md-no-ink class="md-primary md-hue-1 m-side-panel__list-content__item-single"></md-switch>',
                '<md-button flex="10" data-idring="ring.id" ng-click="zoomToUserring(ring.id_ring)" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single">',
                  '<md-icon>zoom_in</md-icon>',
                '</md-button>',
                '<md-button flex="10" data-idring="ring.id" ng-click="delUserring(ring.id_ring)" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single">',
                  '<md-icon>delete</md-icon>',
                '</md-button>',
              '</li>',
            '</ul>',
            '</div>',

          '</div>',


  				'</div>',
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


        scope.addRing = function(){

        };

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
