(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function MenuController($window){
		return {
			restrict: 'E',
			template: [
				'<div class="m-burger-menu js-menu-button" data-module="burger-menu">',
					'<div data-container="line">',
						'<div data-line="top"></div>',
						'<div data-line="middle"></div>',
						'<div data-line="bottom"></div>',
					'</div>',
				'</div>',
				'<ul class="m-list-navigation js-list-navigation">',
					'<li class="m-list-navigation__item js-menu-item"><a>Menu 1</a></li>',
					'<li class="m-list-navigation__item js-menu-item"><a>Menu 2</a></li>',
					'<li class="m-list-navigation__item js-menu-item"><a>Menu 3</a></li>',
				'</ul>',
			].join(''),
			controller: function(){
				var _$js_menu_button = angular.element(document.getElementsByClassName('js-menu-button'));
				var _$js_list_navigation = angular.element(document.getElementsByClassName('js-list-navigation'));
				
				
				
				_$js_menu_button.on('click', function(e){
					e.preventDefault();
					angular.element(this).toggleClass('is-menu-active')
					_$js_list_navigation.toggleClass('is-menu-opened');
					return false;
				});
				
				// $window.addEventListener('mouseup', function(e){
				// 	e.preventDefault();
				// 	// if (_$js_menu_button.hasClass('is-menu-active')) {
				// 	// 	_$js_menu_button.removeClass('is-menu-active');
				// 	// 	_$js_list_navigation.removeClass('is-menu-opened');
				// 	// }
				// 	// console.log(e);
				// 	console.log(_$js_list_navigation.find(_$js_list_navigation))
				// 	// if (e.target !== _$js_list_navigation && _$js_list_navigation.eq(e.target).length === 0 && e.target !== _$js_menu_button) {
				// 	// 	_$js_menu_button.removeClass('is-menu-active')
				// 	// 	_$js_list_navigation.removeClass('is-menu-opened');
				// 	// }
				// });
			}
		};
	}
	
	MenuController.$inject = ['$window'];

	angular.module('menu.directive', [])
		.directive('menu', MenuController);
}());