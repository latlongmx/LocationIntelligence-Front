(function() {
  /**
   *  KlDirective Directive
   */
  'use strict';

  function timeringsDirective(BaseMapService, BaseMapFactory, Auth, $compile, $mdToast, $document, uiService, $templateRequest, TimeRingsService) {

    var _$js_accessibility_side_panel = null,
      _$js_accessibility_item = null,
      _map = null;

    var _layers = {};
    var _$userRings = null;
    var _$userRingsGeoms = [];
    var _$panel;
		var _$timeRingsBtns;
		var _$divPoint;
		var _$divType;
		var _$divTime;
		var _$btnPanelRing;
    var _$rangeRing;


    r360.config.serviceKey = '8Y81HNSQYTTMBTFXHFF7'; //<-- KEY joyce@latlong.mx
    r360.config.serviceUrl = 'https://service.route360.net/na_southeast/';
    var _polygonRings = r360.leafletPolygonLayer();
    var _travelOptions = r360.travelOptions();
    //_travelOptions.setIntersectionMode('intersection');   //  union  intersection  average
    var _targetRings = [];
    var _timeRingRange = 0;
    var _timeRing = 30;
    var _typeRing = 'car';  // bike walk car transit
    var _targetRing;
    var _marker;
    var _blueMarker,
    template;

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
          '<li id="btnPanelRing" class="m-list-functions__item js-panel-item js-timering-side-panel" data-ep="rings" tooltip-placement="right" uib-tooltip="Rangos de alcance" tooltip-animation="true" ng-click="openPanel(\'rings\', \'rings_icon\')">',
          	'<img src="./images/functions/rings_icon.png" class="m-list-functions__item-icon" data-icon="rings_icon"/>',
          '</li>',
          '<div class="m-side-panel js-rings-side-panel">',
          	'<h3 class="m-side-panel__title">Rangos de alcance</h3>',
            '<div class="m-side-panel__actions pos-relative">',
              '<div layout="row">',
                '<div layout="row" flex="40" layout-align="center center">',
                  '<div flex="75">',
                    '<h5 class="m-side-panel__title-action">Agregar rango de alcance</h5>',
                  '</div>',
                  '<div flex="25">',
                    '<md-button class="md-fab md-mini md-primary" ng-click="addRing()">',
                      '<md-icon>add</md-icon>',
                    '</md-button>',
                  '</div>',
                '</div>',
              '</div>',
            '</div>',
            '<div>',
              '<h3 class="m-side-panel__user-title">Mis rangos:</h3>',
              '<div layout="row">',
                '<input class="range-ring-base c1" type="range" min="5" max="30" step="5" />',
                '<input class="range-ring-base c2" type="range" min="5" max="30" step="5" />',
                '<input class="range-ring-base c3" type="range" min="5" max="30" step="5" />',
                '<input class="range-ring-base c4" type="range" min="5" max="30" step="5" />',
                '<input class="range-ring-base c5" type="range" min="5" max="30" step="5" />',
              '</div>',
              '<div layout="row">',
                '<input id="slider-ring" class="range-ring" type="range" min="5" max="30" step="5" style="margin-bottom: 10px; margin-top: -15px;"/>',
              '</div>',
              '<ul id="accessPanelUserRingss" class="m-side-panel__list-content m-side-panel__list-content--in-rings" ng-if="userRings">',
                '<li ng-repeat="ring in userRings" class="m-side-panel__list-content__item">',
                  '<md-input-container flex="60" class="m-side-panel__list-content__item__md-input-container" layout-align="center center">',
                    '<input ng-change="updateNameUserRing(ring.id_ring, ring.name)" aria-label="ring.id_ring" ng-model-options="{debounce: 750}" ng-model="ring.name" >',
                  '</md-input-container>',
                  '<p flex="10" class="m-side-panel__list-content__item-single">',
                  //'<i class="demo {{ring.icon}}"></i>',
                  '</p>',
                  '<md-switch data-idring="ring.id_ring" aria-label="ring.id_ring" ng-model="ring.isActive" flex="10" ng-change="turnOnOffRing(ring.id_ring)" ng-model="layer" md-no-ink class="md-primary md-hue-1 m-side-panel__list-content__item-single"></md-switch>',
                  '<md-button flex="10" data-idring="ring.id" ng-click="zoomToUserRing(ring.id_ring)" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single">',
                    '<md-icon>zoom_in</md-icon>',
                  '</md-button>',
                  '<md-button flex="10" data-idring="ring.id_ring" ng-click="delUserRing(ring.id_ring)" class="md-icon-button md-button md-ink-ripple m-side-panel__list-content__item-single">',
                    '<md-icon>delete</md-icon>',
                  '</md-button>',
                '</li>',
              '</ul>',
            '</div>',
				  '</div>',
				'</div>'
      ].join(''),
      link: function(scope, element, attr, ctrl) {

        scope.userRings = [];
        scope.openPanel = function(a,b){
          ctrl.explorationItem(a,b);
          _$divPoint.addClass('hide');
          _$divType.addClass('hide');
          _$divTime.addClass('hide');
          _$panel.data('start_time', false);
        };
        _map = BaseMapService.map_layer();

        _$rangeRing = angular.element(document.getElementById('slider-ring'));
        // _$btnPanelRing = angular.element(document.getElementById('btnPanelRing'));
        // _$btnPanelRing.on('click',function(){
        //   _$divPoint.addClass('hide');
        //   _$divType.addClass('hide');
        //   _$divTime.addClass('hide');
        //   _$panel.data('start_time', false);
        // });

        $templateRequest("./components/panel/analysis/timerings/add.timering.tpl.html").then(function(html){
          template = angular.element(html);
          element.append(template);
          $compile(template)(scope);
          _$timeRingsBtns = angular.element(document.getElementById('timeRingsBtns'));
          //_$timeRingsBtns.addClass('hide');
          _$divPoint = angular.element(document.getElementById('divPoint'));
          _$divType = angular.element(document.getElementById('divType'));
      		_$divTime = angular.element(document.getElementById('divTime'));
       });

          //Correcccion compatibilidad leaflet 1.0
          _polygonRings._layerAdd = function(options) {
            this.onAdd(options.target);
          };
          _polygonRings.addTo(_map);

        //Load User rings
        TimeRingsService.getUserRings().then(function(res){
          if(res.data && res.data.rings){
            _.each(res.data.rings, function(o){
              var latlng = L.latLng(o.y, o.x);
              scope.addRing2Catalog({
                id_ring: o.id_ring,
                name: o.name_ring,
                targetRing: latlng,
                isActive: false,
                polygons: undefined,
                timeRing: o.time_ring,
                typeRing: o.type_ring
              });
            });
          }
        });


        scope.addRing = function(){
          uiService.changeCurrentPanel(true);
          _$divPoint.removeClass('hide');
          _$panel.data('start_time', true);
          _$divType.addClass('hide');
          _$divTime.addClass('hide');
        };

        _$panel = angular.element(document.getElementsByClassName('js-timering-side-panel')[0]);


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
              //scope.callTravelRings();
            }
            _$divTime.removeClass('hide');
          }
        };
        _map.on('click', scope.onClickMap);

        _$panel.on('click', function() {
					//_$timeRingsBtns.toggleClass('hide');
        });

        scope.startTravelRing = function(){
          _$panel.data('start_time', true);
        };

        scope.removeTravelRings = function(){
          _polygonRings.clearLayers();
          _map.removeLayer(_marker);
        };

        scope.setTimeRing = function(time){
          _timeRing = time;
          _$divType.removeClass('hide');
        };
        scope.setTypeRing = function(type){
          _typeRing = type;
          scope.callTravelRings();
        };

        scope.callTravelRings = function(){
          scope.openPanel = function(a,b){
            ctrl.explorationItem(a,b);
          };
          angular.element(document.getElementById('timeRingsBtns')).remove();
          //_$btnPanelRing.trigger('click');
          _$panel.data('start_time', false);

          var mxN = 0;
          if(scope.userRings.length > 0){
            mxN = _.max(_.pluck(scope.userRings, 'id_ring')) + 1;
          }
          var name = 'Mi rango '+(mxN);
          var id_ring = mxN;
          var ring = {
            id_ring: id_ring,
            name: name,
            targetRing: _targetRing,
            isActive: true,
            polygons: undefined,
            timeRing: _timeRing,
            typeRing: _typeRing,
            marker: L.marker([_targetRing.lat, _targetRing.lng])
          };

          TimeRingsService.addUserRings({
            nm: name,
            ty: _typeRing,
            ti: _timeRing,
            geo: 'POINT('+_targetRing.lng+' '+_targetRing.lat+')'
          }).then(function(res){
            if(res.data && res.id_ring){


              var r = _.findWhere(scope.userRings, {id_ring: res.id_ring});
              r.id_ring = res.id_ring;
            }
          });

          if(_targetRings.length>=3){
            _showMessage("Solo se puede analizar 3 rangos al mismo tiempo");
            ring.isActive = false;
            scope.addRing2Catalog(ring);
            return;
          }
          _targetRings.push(_targetRing);

          scope.callService2GetRings(_timeRing, _typeRing, _targetRings, function(polygons){
            //_map.fitBounds(_polygonRings.getBoundingBox3857());
            ring.polygons = polygons;
            _polygonRings.fitMap();
            ring.marker.addTo(_map);
            _map.removeLayer(_marker);
            scope.addRing2Catalog(ring);
          });


        };

        scope.callService2GetRings = function(time, type, position, callback){
          if(typeof position === 'object' && position.length >0 ){
            _travelOptions.setSources( position );
          }else{
            _travelOptions.setSources( [position] );
          }
          var times = [300, 600, 900, 1200, 1500, 1800];
          var timeSelected = _.filter(times, function(n){
            return n <= time;
          });
          _travelOptions.setTravelTimes( timeSelected );
          _travelOptions.setTravelType( type );

          r360.PolygonService.getTravelTimePolygons( _travelOptions, function(polygons) {
            //_polygonRings.clearAndAddLayers(polygons, true);
            _polygonRings.addLayer(polygons);
            if(callback){
              callback(polygons);
            }
          });
        };

        scope.addRing2Catalog = function(ring){
          if(ring.marker === undefined){
            ring.marker = L.marker([ring.targetRing.lat, ring.targetRing.lng]);
          }
          scope.userRings.push(ring);
        };


        //Actions by TimeRing USER
        _$rangeRing.on('change', function(){
          var timeRing = _$rangeRing.val();
          if(_$rangeRing.data('oldval') === undefined){
            _$rangeRing.data('oldval',timeRing);
          }

          if(_$rangeRing.data('oldval') === timeRing){
            return;
          }

          switch (timeRing.toString()) { //var times = [300, 600, 900, 1200, 1500, 1800];
            case '5':
              _timeRing = 300;
              break;
            case '10':
              _timeRing = 600;
              break;
            case '15':
              _timeRing = 900;
              break;
            case '20':
              _timeRing = 1200;
              break;
            case '25':
              _timeRing = 1500;
              break;
            case '30':
              _timeRing = 1800;
              break;
            default:

          }
          scope.callService2GetRings(_timeRing, _typeRing, _targetRings,function(polygons){
          });
        });

        scope.turnOnOffRing = function(id_ring){
          var isFullRingProccess = false;
          if(_targetRings.length>=3){
            scope.userRings.forEach(function(ring){
              if(ring.id_ring===id_ring && ring.isActive && _targetRings.length>=3){
                ring.isActive = false;
                isFullRingProccess = true;
                _map.removeLayer(ring.marker);
              }
            });
          }

          if(isFullRingProccess){
            _showMessage("Solo se puede analizar 3 rangos al mismo tiempo");
            return;
          }
          _polygonRings.clearLayers();
          _targetRings = [];
          _timeRing = '';
          _typeRing = '';
          scope.userRings.forEach(function(ring){
              if(ring.isActive===true){
                if(_targetRings.length===3){
                  _showMessage("Solo se puede analizar 3 rangos al mismo tiempo");
                }else{
                  ring.marker.addTo(_map);
                  _targetRings.push(ring.targetRing);
                  _timeRing = ring.timeRing;
                  _typeRing = ring.typeRing;
                }
              }else{
                _map.removeLayer(ring.marker);
              }
          });
          if(_targetRings.length>0){
            scope.callService2GetRings(_timeRing, _typeRing, _targetRings,function(polygons){
            });
            var timeRing = _timeRing;

            switch (timeRing.toString()) { //var times = [300, 600, 900, 1200, 1500, 1800];
              case '300':
                timeRing = '5';
                break;
              case '600':
                timeRing = '10';
                break;
              case '900':
                timeRing = '15';
                break;
              case '1200':
                timeRing = '20';
                break;
              case '1500':
                timeRing = '25';
                break;
              case '1800':
                timeRing = '30';
                break;
              default:

            }
            _$rangeRing.data('oldval',timeRing);
            _$rangeRing.val(timeRing);
          }
        };

        scope.zoomToUserRing = function(id_ring){
          scope.userRings.forEach(function(ring){
            if(ring.id_ring===id_ring){
              _map.setView([ring.targetRing.lat, ring.targetRing.lng], 14);
            }
          });
        };

        scope.delUserRing = function(id_ring){
          TimeRingsService.delUserRings(id_ring)
					.then(function(res){
						if(res.statusText === "OK"){
							scope.userRings = _.filter(scope.userRings, function(o) {
                if(o.id_ring === id_ring){
                  o.isActive = false;
                }
								return o.id_ring !== id_ring;
							});
						}
					}, function(error){
						console.log(error);
					});
        };

        scope.updateNameUserRing = function(id_ring, name){
          TimeRingsService.updateUserRings(id_ring, name)
					.then(function(data){
						if(data.statusText === "OK"){
							_showMessage("El nombre del área se actualizó correctamente");
						}
						else {
							_showMessage("Error al actualizar el  nombre del área, intenta nuevamente");
						}
					}, function(error){
						_showMessage("Error al actualizar el  nombre del área, intenta nuevamente");
					});
        };

        var _showMessage = function(msg) {
					$mdToast.show(
						$mdToast.simple({
							textContent: msg,
							position: 'top right',
							hideDelay: 2500,
							parent: $document[0].querySelector('.md-dialog-container'),
							autoWrap: true
						})
					);
				};


      },
      controller: function($scope) {}
    };
  }

  timeringsDirective.$inject = ['BaseMapService', 'BaseMapFactory', 'Auth', '$compile', '$mdToast', '$document', 'uiService', '$templateRequest', 'TimeRingsService'];
  angular.module('walmex').directive('timerings', timeringsDirective);
})();
