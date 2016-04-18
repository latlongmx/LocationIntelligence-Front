(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function AnalysisFunctions($uibModal){
		return {
			restrict: 'E',
			template: [
				'<ul class="m-list-functions">',
					'<li class="m-list-functions__item js-analysis-item" data-af="accessibility">',
						'<i class="m-list-functions__item-icon demo demo-accessibility1"></i>',
					'</li>',
					'<li class="m-list-functions__item js-analysis-item" data-af="od">',
						'<i class="m-list-functions__item-icon demo demo-origin-destiny"></i>',
					'</li>',
					'<li class="m-list-functions__item js-analysis-item" data-af="heatmap">',
						'<i class="m-list-functions__item-icon demo demo-heatmap"></i>',
					'</li>',
					'<li class="m-list-functions__item js-analysis-item" data-af="rings">',
						'<i class="m-list-functions__item-icon demo demo-rings"></i>',
					'</li>',
				'</ul>',
			].join(''),
			controller: function($scope){
				var _$js_analysis_item = angular.element(document.getElementsByClassName('js-analysis-item'));
				var _data_af = null;
				_$js_analysis_item.on('click', function(e){
					e.preventDefault();
					$scope.analysisId = this.getAttribute('data-af');
					_data_af = this.getAttribute('data-af');
					$uibModal.open({
						controller: _data_af+'ModalController',
						templateUrl: './components/analysis_functions/'+_data_af+'_modal/'+_data_af+'.tpl.html',
						animation: true,
						resolve: {
							analysisId: function () {
								return $scope.analysisId;
							}
						}
					});
				});
				
			}
		};
	}
	
	AnalysisFunctions.$inject = ['$uibModal'];

	angular.module('analysis.directive', [])
		.directive('analysisFunctions', AnalysisFunctions);
}());