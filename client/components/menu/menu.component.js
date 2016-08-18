(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function MenuController($window, Auth, $location, BaseMapService){
		var _menuDirective = {
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
					'<li class="m-list-navigation__item js-menu-item"><a>Mi perfil</a></li>',
					'<li class="m-list-navigation__item js-logout"><a>Cerrar sesión</a></li>',
				'</ul>',
			].join(''),
			controllerAs: "menu",
			controller: function($scope) {
				var menu = this;
				var _$js_menu_button = angular.element(document.getElementsByClassName('js-menu-button'));
				var _$js_list_navigation = angular.element(document.getElementsByClassName('js-list-navigation'));
				var _$js_logout = angular.element(document.getElementsByClassName('js-logout'));
				
				_$js_menu_button.on('click', function(e){
					e.preventDefault();
					angular.element(this).toggleClass('is-menu-active');
					angular.element(document.getElementsByClassName('m-search')).toggleClass('is-menu-open');
					_$js_list_navigation.toggleClass('is-menu-opened');
					return false;
				});
				
				_$js_logout.on('click', function(){
					Auth.logout();
					$scope.$apply();
				});

			}
		};
		return _menuDirective;
	}
	
	
	MenuController.$inject = ['$window', 'Auth', '$location', 'BaseMapService'];

	angular.module('menu.directive', [])
		.directive('menu', MenuController);
})();
