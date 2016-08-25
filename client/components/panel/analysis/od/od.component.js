(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function odDirective($timeout, BaseMapService, $rootScope, BaseMapFactory, Auth, odService, $compile, uiService){
		var cityPolygons = null,
		cityData = null,
		color_x = null;
		return {
			restrict: 'E',
			replace: true,
			require: '^panelFunctions',
			scope: true,
			template: [
				'<div>',
					'<li class="m-list-functions__item js-panel-item" data-ep="od" tooltip-placement="right" uib-tooltip="Origen Destino" tooltip-animation="true" ng-click="openPanel(\'od\', \'od_icon\')">',
						'<img src="./images/functions/od_icon.png" class="m-list-functions__item-icon" data-icon="od_icon"/>',
					'</li>',
					'<div class="m-side-panel js-od-side-panel">',
						'<h3 class="m-side-panel__title">Gasto Origen-Destino</h3>',
						'<div class="m-side-panel__actions pos-relative">',
							'<h4 class="m-side-panel__subtitle">Código Postal: <span>{{zip_code ? zip_code:"Selecciona un código postal del mapa"}}</span></h4>',
							'<md-divider></md-divider>',
							'<span class="m-side-panel__title-action"  ng-if="selected_zc">Información a consultar</span>',
							'<div layout="row" ng-if="selected_zc">',
								'<div layout="column" flex="50" layout-align="center center">',
									'<h6 class="m-side-panel__subtitle" style="margin:auto;">Promedio de pago</h6>',
									'<md-button class="md-fab md-mini md-primary js-index js-index-0" ng-click="getIndex(0)">',
										'<md-icon>format_list_bulleted</md-icon>',
									'</md-button>',
								'</div>',
								'<div layout="column" flex="50" layout-align="center center">',
									'<h6 class="m-side-panel__subtitle" style="margin:auto;">Número de pagos</h6>',
									'<md-button class="md-fab md-mini md-primary md-hue-2 js-index js-index-1" ng-click="getIndex(1)">',
										'<md-icon>add</md-icon>',
									'</md-button>',
								'</div>',
								'<div layout="column" flex="50" layout-align="center center">',
									'<h6 class="m-side-panel__subtitle" style="margin:auto;">Número de tarjetas por día</h6>',
									'<md-button class="md-fab md-mini md-primary md-hue-2 js-index js-index-2" ng-click="getIndex(2)">',
										'<md-icon>zoom_in</md-icon>',
									'</md-button>',
								'</div>',
							'</div>',
						'</div>',
						'<div class="m-side-panel__list m-side-panel__list--in-od-panel">',
								'<slick settings="slickConfig" infinite=false slides-to-show=1 slides-to-scroll=1>',
									'<div class="m-side-panel__list-slider__slide">',
										'<avg-day-gender class="m-graphic"></avg-day-gender>',
										'<avg-age class="m-graphic"></avg-age>',
									'</div>',
									'<div class="m-side-panel__list-slider__slide">',
										'<payments-day-gender class="m-graphic"></payments-day-gender>',
										'<payments-age class="m-graphic"></payments-age>',
									'</div>',
									'<div class="m-side-panel__list-slider__slide">',
										'<cards-day class="m-graphic"></cards-day>',
										'<cards-age class="m-graphic"></cards-age>',
									'</div>',
								 '</slick>',
						'</div>',
					'</div>',
				'</div>'
			].join(''),
			link: function(scope, element, attr, ctrl){
				var datazipcode	= [],
				_array_avg_day = [],
				_array_avg_gender = null,
				_array_avg_age = null,
				_array_num_payments_day = [],
				_array_num_payments_gender = null,
				_array_num_payments_age = null,
				_array_num_cards_day = [],
				_array_num_cards_age = null;
				
				scope.openPanel = function(a,b){
					ctrl.explorationItem(a,b);
				};

				/**
				 * [slickConfig Slick slider init and configurations]
				 * @type {Object}
				 */
				scope.slickConfig = {
					enabled: false,
					autoplay: false,
					draggable: false,
					dots: false,
					arrows:false,
					method: {}
				};
				
				/**
				 * [lang Highcharts options]
				 * @type {Object}
				 */
				Highcharts.setOptions({
					lang: {
						months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
						weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
					}
				});
				
				/**
				 * [getIndex Function to get current index in slick slider, to activate selected category (slide)]
				 * @param  {[type]} index [description]
				 */
				scope.getIndex = function(index){
					var selectCategory = angular.element(document.getElementsByClassName('js-index-'+ index));
					var selectIndex = angular.element(document.getElementsByClassName('js-index'));
					selectIndex.addClass('md-hue-2');
					scope.slickConfig.method.slickGoTo(index);
					selectCategory.removeClass('md-hue-2');
				};

				/**
				 * [Update ZipCode label]
				 */
				var updateZC = $rootScope.$on('zc_event', function(e, data){
					scope.selected_zc = true;
					scope.slickConfig.enabled = true;
					scope.zip_code = data;
					_getZipCodeData(data);
				});

				/**
				 * [_getZipCodeData Http requeste to get all data for current zipcode selected]
				 * @param  {[type]} zipCode [current zipcode selected]
				 */
				var _getZipCodeData = function(zipCode) {
					if (!datazipcode[zipCode]) {
						uiService.layerIsLoading();
						odService.getBasicStats(zipCode)
						.then(function(result){
							if(result.status === 200 && result.statusText === "OK"){
								
								datazipcode[zipCode] = result.data;
								_getSeries(result.data, zipCode);
								uiService.changeCurrentPanel(true);
								uiService.layerIsLoaded();
							}
						}, function(error){
							console.log(error);
							uiService.layerIsLoaded();
						});
					}
					else {
						_getSeries(datazipcode[zipCode]);
					}
				};
				
				/**
				 * [_getSeries Build day, age and gender series data for charts]
				 * @param  {[type]} d        [all data on each zip code]
				 * @param  {[type]} zip_code [current zip code selected]
				 */
				function _getSeries(d, zip_code){
					if (d.day !== undefined || d.day !== false) {
						_array_avg_day= [];
						_array_num_payments_day= [];
						_array_num_cards_day= [];
						_.each(d.day.stats, function(val, i) {
							if(val.avg !== undefined){
								_array_avg_day.push(val.avg);
							}
							else {
								_array_avg_day.push(0);
							}
							if (val.num_payments !== undefined) {
								_array_num_payments_day.push(val.num_payments);
							}
							else {
								_array_num_payments_day.push(0);
							}
							if (val.num_cards !== undefined) {
								_array_num_cards_day.push(val.num_cards);
							}
							else {
								_array_num_cards_day.push(0);
							}
						});
					}

					if (d.gender_distribution !== undefined || d.gender_distribution !== false) {
						_array_avg_gender = { male : [], female : [] };
						_array_num_payments_gender = { male : [], female : [] };
						_.each(d.gender_distribution.stats, function(val, i) {
							if (val.histogram.length === 0){
								_array_avg_gender.male.push(0);
								_array_avg_gender.female.push(0);
								_array_num_payments_gender.male.push(0);
								_array_num_payments_gender.female.push(0);
							}
							else {
								if(val.histogram[0].avg === undefined ) {
									_array_avg_gender.male.push(0);
									_array_avg_gender.female.push(0);
									_array_num_payments_gender.male.push(0);
									_array_num_payments_gender.female.push(0);
									_array_num_cards_age.male.push(0);
									_array_num_cards_age.female.push(0);
								}
								else if (val.histogram.length === 1){
									if(val.histogram[0].gender === "M"){
										_array_avg_gender.male.push(val.histogram[0].avg);
										_array_avg_gender.female.push(0);
										_array_num_payments_gender.male.push(val.histogram[0].num_payments);
										_array_num_payments_gender.female.push(0);
									}
									else {
										_array_avg_gender.male.push(0);
										_array_avg_gender.female.push(val.histogram[0].avg);
										_array_num_payments_gender.male.push(0);
										_array_num_payments_gender.female.push(val.histogram[0].num_payments);
									}

								}
								else if (val.histogram.length === 2){
									val.histogram[0].gender === "M" ? 
										(
											_array_avg_gender.male.push(val.histogram[0].avg) ,_array_avg_gender.female.push(val.histogram[1].avg), _array_num_payments_gender.male.push(val.histogram[0].num_payments),  _array_num_payments_gender.female.push(val.histogram[1].num_payments)) : 
										(_array_avg_gender.male.push(val.histogram[1].avg) ,_array_avg_gender.female.push(val.histogram[0].avg), _array_num_payments_gender.male.push(val.histogram[1].num_payments),  _array_num_payments_gender.female.push(val.histogram[0].num_payments));
								}
							}
						});
					}

					if (d.age_distribution !== undefined || d.age_distribution !== false) {
						_array_avg_age = { a1925 : [], a2635 : [], a3645 : [], a4655 : [], a5665 : [], am66 : [] };
						_array_num_payments_age = { a1925 : [], a2635 : [], a3645 : [], a4655 : [], a5665 : [], am66 : [] };
						_array_num_cards_age = { a1925 : [], a2635 : [], a3645 : [], a4655 : [], a5665 : [], am66 : [] };
						
						_.each(d.age_distribution.stats, function(val, i) {
							var avg_age925 = 0,
							avg_age2635 = 0,
							avg_age3645 = 0,
							avg_age4655 = 0,
							avg_age5665 = 0,
							avg_agem66  = 0,
							num_payments_age925 = 0,
							num_payments_age2635 = 0,
							num_payments_age3645 = 0,
							num_payments_age4655 = 0,
							num_payments_age5665 = 0,
							num_payments_agem66  = 0,
							num_cards_age925 = 0,
							num_cards_age2635 = 0,
							num_cards_age3645 = 0,
							num_cards_age4655 = 0,
							num_cards_age5665 = 0,
							num_cards_agem66  = 0;
							_.each(val.histogram, function(val1, i1) {
								if(val1.ages === "19-25") {
									avg_age925 = val1.avg;
									num_payments_age925 = val1.num_payments;
									num_cards_age925 = val1.num_payments;
								}
								else if(val1.ages === "26-35") {
									avg_age2635 = val1.avg;
									num_payments_age2635 = val1.num_payments;
									num_cards_age2635 = val1.num_payments;
								}
								else if(val1.ages === "36-45") {
									avg_age3645 = val1.avg;
									num_payments_age3645 = val1.num_payments;
									num_cards_age3645 = val1.num_payments;
								}
								else if(val1.ages === "46-55") {
									avg_age4655 = val1.avg;
									num_payments_age4655 = val1.num_payments;
									num_cards_age4655 = val1.num_payments;
								}
								else if(val1.ages === "56-65") {
									avg_age5665 = val1.avg;
									num_payments_age5665 = val1.num_payments;
									num_cards_age5665 = val1.num_payments;
								}
								else if(val1.ages === ">=66") {
									avg_agem66 = val1.avg;
									num_payments_agem66 = val1.num_payments;
									num_cards_agem66 = val1.num_payments;
								}
							});
							_array_avg_age.a1925.push(avg_age925);
							_array_avg_age.a2635.push(avg_age2635);
							_array_avg_age.a3645.push(avg_age3645);
							_array_avg_age.a4655.push(avg_age4655);
							_array_avg_age.a5665.push(avg_age5665);
							_array_avg_age.am66.push(avg_agem66);
							
							_array_num_payments_age.a1925.push(num_payments_age925);
							_array_num_payments_age.a2635.push(num_payments_age2635);
							_array_num_payments_age.a3645.push(num_payments_age3645);
							_array_num_payments_age.a4655.push(num_payments_age4655);
							_array_num_payments_age.a5665.push(num_payments_age5665);
							_array_num_payments_age.am66.push(num_payments_agem66);
							
							_array_num_cards_age.a1925.push(num_cards_age925);
							_array_num_cards_age.a2635.push(num_cards_age2635);
							_array_num_cards_age.a3645.push(num_cards_age3645);
							_array_num_cards_age.a4655.push(num_cards_age4655);
							_array_num_cards_age.a5665.push(num_cards_age5665);
							_array_num_cards_age.am66.push(num_cards_agem66);
						});
					}

					if (d.customer_zipcodes.zcs !== null) {
						odService.setMarkers(d.customer_zipcodes, zip_code);
					}

					$rootScope.$emit('avgDayGender', [_array_avg_day, _array_avg_gender]);
					$rootScope.$emit('avgAge', _array_avg_age);
					$rootScope.$emit('paymentsDayGender', [_array_num_payments_day, _array_num_payments_gender]);
					$rootScope.$emit('paymentsAge', _array_num_payments_age);
					$rootScope.$emit('cardsDay', _array_num_cards_day);
					$rootScope.$emit('cardsAge', _array_num_cards_age);
				}
			},
			controller: function($scope) {

			}
		}
	}

	odDirective.$inject = ['$timeout', 'BaseMapService', '$rootScope', 'BaseMapFactory', 'Auth', 'odService', '$compile', 'uiService'];
	angular.module('walmex').directive('od', odDirective);
})();
