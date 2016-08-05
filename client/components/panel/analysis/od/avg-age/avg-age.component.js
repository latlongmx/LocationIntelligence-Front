(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function avgAgeDirective(_, odService, uiService, $rootScope){
		
		return {
			restrict: 'E',
			replace:true,
			scope: '=',
			template: [
				'<div id="avg-age"></div>'
			].join(''),
			link: function(scope, element, attr, ctrl){
				$rootScope.$on('avgAge', function(e, data){
					avgAgeChart(data);
					e.stopPropagation();
				});

				function avgAgeChart(age) {
					var AxisTitle = "Promedio de pago";
					
					Highcharts.chart(element[0], {
						chart: {
							zoomType: 'x'
						 },
						 title: {
								 text: 'Rango de edades'
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
								name: '19-25',
								pointInterval: 24 * 3600 * 1000,
								pointStart: Date.UTC(2013, 10, 1),
								data: age.a1925
							}, {
								name: '26-35',
								pointInterval: 24 * 3600 * 1000,
								pointStart: Date.UTC(2013, 10, 1),
								data: age.a2635
							}, {
								name: '36-45',
								pointInterval: 24 * 3600 * 1000,
								pointStart: Date.UTC(2013, 10, 1),
								data: age.a3645
							}, {
								name: '46-55',
								pointInterval: 24 * 3600 * 1000,
								pointStart: Date.UTC(2013, 10, 1),
								data: age.a4655
							}, {
								name: '56-65',
								pointInterval: 24 * 3600 * 1000,
								pointStart: Date.UTC(2013, 10, 1),
								data: age.a5665
							}, {
								name: '>=66',
								pointInterval: 24 * 3600 * 1000,
								pointStart: Date.UTC(2013, 10, 1),
								data: age.am66
							}
						],
					});
				}
				
			}
		};
	}

	avgAgeDirective.$inject = ['_','odService', 'uiService', '$rootScope'];
	angular.module('avg.age.directive', [])
		.directive('avgAge', avgAgeDirective);
})();
