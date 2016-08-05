(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function avgDayGenderDirective(_, odService, uiService, $rootScope){
		
		return {
			restrict: 'E',
			replace:true,
			scope: '=',
			template: [
				'<div id="avg-day-gender"></div>'
			].join(''),
			link: function(scope, element, attr, ctrl){
				$rootScope.$on('avgDayGender', function(e, data){
					avgDayGenderChart(data);
					e.stopPropagation();
				});

				function avgDayGenderChart(data) {
					var AxisTitle = "Promedio de pago";
					
					Highcharts.chart(element[0], {
						chart: {
							zoomType: 'x'
						 },
						 title: {
								 text: 'Total y Generos'
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
								data: data[0]
							}, {
								name: 'Genero femenino',
								pointInterval: 24 * 3600 * 1000,
								pointStart: Date.UTC(2013, 10, 1),
								data: data[1].female
							} , {
								name: 'Genero masculino',
								pointInterval: 24 * 3600 * 1000,
								pointStart: Date.UTC(2013, 10, 1),
								data: data[1].male
							}
						],
					});
				}
				
			}
		};
	}

	avgDayGenderDirective.$inject = ['_','odService', 'uiService', '$rootScope'];
	angular.module('avg.day.gender.directive', [])
		.directive('avgDayGender', avgDayGenderDirective);
})();
