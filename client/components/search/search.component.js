(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function Search($window, $timeout){
		return {
			restrict: 'E',
			template: [
				'<div class="m-search js-search-form">',
					'<input class="m-search__input js-search-input" type="text" ng-model="search" placeholder="buscar"/>',
					'<i class="demo demo-search m-search__icon js-search"></i>',
				'</div>'
			].join(''),
			controller: function($scope){
				var searchForm = angular.element(document.getElementsByClassName('js-search-form'));
				var searchButton = angular.element(document.getElementsByClassName('js-search'));
				var searchInput = angular.element(document.getElementsByClassName('js-search-input'));
				
				/**
				 * [Click to show input search]
				 */
				searchForm.on('click', function(){
					$timeout(function(){
						$scope.search = "";
					}, 0);
					searchForm.addClass('is-showed-form');
					searchInput.addClass('is-showed-input');
				});
				
				/**
				 * [Bind event to hide input search]
				 */
				$window.addEventListener('mouseup', function(e){
					e.preventDefault();
					if (e.target !== searchButton && e.target.parentNode !== searchButton) {
						searchForm.removeClass('is-showed-form');
						searchInput.removeClass('is-showed-input');

					}
				});
			}
			// controller: function($scope){
			// }
		};
	}
	
	Search.$inject = ['$window', '$timeout'];

	angular.module('search.directive', [])
		.directive('search', Search);
}());