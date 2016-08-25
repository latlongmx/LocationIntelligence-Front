(function(){

	'use strict';

	angular.module('walmex',[
			'routes',
			'ui.bootstrap',
			'com.pushmenu',
			'dem.pushmenu',
			'heat.pushmenu',
			'chroma.angularChroma',
			'ngMaterial',
			'angularFileUpload',
			'slickCarousel'
		]
	)
	.constant('_', window._)
	.constant('ROLES', ['uA', 'uB', 'uC'])
	.constant('token', 'pk.eyJ1IjoicG9rYXhwZXJpYSIsImEiOiJjaW13eHJ2NHMwM2Uwdjdra3c1bWF3Nzd6In0.leOLCkHazd_6JAQtdiHOFw')
	.run(["$rootScope", "$route", "$routeParams", "Auth", function ($rootScope, $route, $routeParams, Auth) {
		$rootScope.$route = $route;
		$rootScope.$routeParams = $routeParams;
		L.drawLocal.draw.toolbar.actions.text = "Cancelar";
		L.drawLocal.draw.toolbar.actions.title = "Cancelar Dibujo";
		L.drawLocal.draw.toolbar.finish.text = "Terminar";
		L.drawLocal.draw.toolbar.finish.title = "Terminar Dibujo";
		L.drawLocal.draw.toolbar.buttons.polyline = "Dibujar Líneas";
		L.drawLocal.draw.toolbar.buttons.polygon = "Dibujar Poligono";
		L.drawLocal.draw.toolbar.buttons.circle = "Dibujar Radio";
		L.drawLocal.draw.toolbar.undo.text = "Borrar último punto";
		L.drawLocal.draw.toolbar.undo.title = "Borrar el último punto dibujado";
		L.drawLocal.draw.handlers.polyline.tooltip.start = "Click para empezar a trazar líneas";
		L.drawLocal.draw.handlers.polyline.tooltip.cont = "Click para continuar trazando líneas";
		L.drawLocal.draw.handlers.polyline.tooltip.end = "Click en el último punto para temrinar";
		L.drawLocal.draw.handlers.polygon.tooltip.start = "Click para empezar a dibujar un polígono";
		L.drawLocal.draw.handlers.polygon.tooltip.cont = "Click para continuar dibujando el polígono";
		L.drawLocal.draw.handlers.polygon.tooltip.end = "Click en el primer punto para cerrar el polígono";
		L.drawLocal.draw.handlers.circle.radius = "Radio";
		L.drawLocal.draw.handlers.circle.tooltip.start = "Click y arrastrar para dibujar un radio";
		L.drawLocal.draw.handlers.simpleshape.tooltip.end = "Suelte el ratón para completar el radio";

		L.drawLocal.edit.handlers.edit.tooltip.subtext = "click en Cancelar para deshacer los cambios";
		L.drawLocal.edit.handlers.edit.tooltip.text = "Control de arrastre, o marcador para editar dibujo";
		L.drawLocal.edit.handlers.remove.tooltip.text = "Click en un dibujo para eliminar";

		L.drawLocal.edit.toolbar.actions.cancel.text = "Cancelar";
		L.drawLocal.edit.toolbar.actions.cancel.title = "Cancelar editar, deshacer todos los cambios";
		L.drawLocal.edit.toolbar.actions.save.text = "Guardar";
		L.drawLocal.edit.toolbar.actions.save.title = "Guardar cambios";

		L.drawLocal.edit.toolbar.buttons.edit = "Editar dibujo";
		L.drawLocal.edit.toolbar.buttons.editDisabled = "No hay dibujos para editar";
		L.drawLocal.edit.toolbar.buttons.remove = "Eliminar dibujos";
		L.drawLocal.edit.toolbar.buttons.removeDisabled = "No hay dibujos para eliminar";
		$rootScope.$on('$routeChangeStart', function() {
			var auth = Auth.checkStatus();
			var permissions = Auth.getPermission();

			if(auth === false) {
				Auth.logout();
				//window.location.href = "http://52.8.211.37/walmex.latlong.mx";
			}
			
			if(permissions) {
				if (permissions === "uA"){
					$rootScope.userRole = {
						hasPermission : false
					};
				}
				if (permissions === "uC"){
					$rootScope.userRole = {
						hasPermission : true
					};
				}
			}
		});
		return $rootScope;
	}])
	.config(function($mdThemingProvider){
		$mdThemingProvider.definePalette('demo', {
			'50': '#75b238',
			'100': '#82c341',
			'200': '#8fc954',
			'300': '#9CCF68',
			'400': '#A8D57B',
			'500': '#1C8B7D',
			'600': '#1F9C8C',
			'700': '#22AC9B',
			'800': '#25BCAA',
			'900': '#28CDB9',
			'A100': '#dfdfe2',
			'A200': '#d2d2d5',
			'A400': '#c5c5c9',
			'A700': '#b8b8bd',
			'contrastDefaultColor': 'light',
			'contrastLightColors': ['A100', 'A200', 'A400'],
			'hue-1': '600',
			'hue-2': '700',
			'hue-3': '800',
		});
		$mdThemingProvider.theme('default').primaryPalette('demo');
	});
})();
