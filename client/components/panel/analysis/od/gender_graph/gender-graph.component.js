(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function genderGraphDirective(){

		return {
			restrict: 'E',
			replace: true,
			scope: '=',
			template: [
				'<div id="total_gender"></div>'
			].join(''),
			link: function(scope, element, attr){
				Highcharts.chart('total_gender', {
					chart: {
						zoomType: 'x'
					 },
					 title: {
							 text: 'USD to EUR exchange rate over time'
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
							text: 'Exchange rate'
						}
					 },
					 legend: {
						enabled: false
					 },
					 plotOptions: {
						area: {
							fillColor: {
								linearGradient: {
									x1: 0,
									y1: 0,
									x2: 0,
									y2: 1
								},
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

					series: [{
						type: 'area',
						name: 'USD to EUR',
						data: [107, 31, 635, 203, 2]
					}]
				});
			},
			controller: function($scope) {
			}
		};
	}

	genderGraphDirective.$inject = [];
	angular.module('gender.graph.directive', [])
		.directive('gender', genderGraphDirective);
})();
