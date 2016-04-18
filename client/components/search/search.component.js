(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function Search($window, $timeout, BaseMapService){
		console.log(BaseMapService)
		return {
			restrict: 'E',
			template: [
				'<div class="m-search js-search-form">',
					'<input class="m-search__input js-search-input" id="search" type="text" ng-model="search" placeholder="buscar"/>',
					'<i class="demo demo-search m-search__icon js-search"></i>',
				'</div>'
			].join(''),
			controller: function($scope){
				var _searchForm = angular.element(document.getElementsByClassName('js-search-form'));
				var _searchButton = angular.element(document.getElementsByClassName('js-search'));
				var _searchInput = angular.element(document.getElementsByClassName('js-search-input'));
				var _searchInputId = document.getElementById('search');
				
				/**
				 * [Click to show input search]
				 */
				_searchForm.on('click', function(){
					$timeout(function(){
						$scope.search = "";
					}, 0);
					_searchForm.addClass('is-showed-form');
					_searchInput.addClass('is-showed-input');
				});
				
				BaseMapService.AutoComplete(_searchInputId).bindTo('bounds', BaseMapService.mapElement());
				
				//_autocomplete = BaseMapService.AutoComplete(_searchInput);
				//_autocomplete.bindTo('bounds', _map);

				
				
				/**
				 * [Bind event to hide input search]
				 */
				$window.addEventListener('mouseup', function(e){
					e.preventDefault();
					if (e.target !== _searchButton && e.target.parentNode !== _searchButton) {
						_searchForm.removeClass('is-showed-form');
						_searchInput.removeClass('is-showed-input');

					}
				});
			}
			// controller: function($scope){
			// }
		};
	}
	
	Search.$inject = ['$window', '$timeout', 'BaseMapService'];

	angular.module('search.directive', [])
		.directive('search', Search);
}());