(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function cardsDayDirective(_, odService, uiService, $rootScope){
		
		return {
			restrict: 'E',
			replace:true,
			scope: '=',
			template: [
				'<div id="card-day"></div>'
			].join(''),
			link: function(scope, element, attr, ctrl){
				$rootScope.$on('cardsDay', function(e, data){
					cardDayChart(data);
					e.stopPropagation();
				});

				function cardDayChart(data) {
					var AxisTitle = "Promedio de pago";
					
					Highcharts.chart(element[0], {
						chart: {
							zoomType: 'x'
						 },
						 title: {
								 text: 'Total por día'
						 },
						 subtitle: {
							text: document.ontouchstart === undefined ?
							'Clic y arrastrar para hacer zoom' : 'Clic para hacer zoom'
						 },
						 xAxis: {
							type: 'datetime',
							minRange: 14 * 24 * 3600000 // fourteen days
						 },
						 yAxis: {
							title: {
								text: AxisTitle
							},
							minRange:0.1,
							min:0
						 },
						 legend: {
							enabled: true
						 },
						 plotOptions: {
							area: {
								fillColor: {
									linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
									stops: [
										[0, Highcharts.getOptions().colors[0]],
										[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
									]
								},
								marker: {
									radius: 2
								},
								lineWidth: 1,
								states: {
									hover: {
										lineWidth: 1
									}
								},
								threshold: null
							}
						},
						series: [
							{
								type: 'area',
								name: 'Por día',
								pointInterval: 24 * 3600 * 1000,
								pointStart: Date.UTC(2013, 10, 1),
								data: data
							}
						],
					});
				}
				
			}
		};
	}

	cardsDayDirective.$inject = ['_','odService', 'uiService', '$rootScope'];
	angular.module('cards.day.directive', [])
		.directive('cardsDay', cardsDayDirective);
})();
