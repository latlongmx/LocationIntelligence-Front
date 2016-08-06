(function(){

	'use strict';

	angular.module('walmex',[
			'login',
			'login.service',
			'login.factory',
			'basemap',
			'basemap.directive',
			'basemap.service',
			'basemap.factory',
			'routes',
			'menu.directive',
			'panel.directive',
			'location.service',
			'location.directive',
			'location.factory',
			'add.location.controller',
			'edit.layer.location.controller',
			'competence.directive',
			'competence.service',
			'add.competence.csv.controller',
			'add.competence.var.controller',
			'add.competence.name.controller',
			'add.competence.var.service',
			'edit.layer.competence.controller',
			'demograhpy.service',
			'demography.directive',
			'potential.directive',
			'accessibility.directive',
			'accessibility.service',
			'heatmap.directive',
			'heatmap.service',
			'timerings.directive',
			'timerings.service',
			'add.heatmap.controller',
			'add.heatmap.service',
			'edit.layer.heatmap.controller',
			'od.modal.controller',
			'rings.modal.controller',
			'search.directive',
			'ui.router',
			'ui.bootstrap',
			'com.pushmenu',
			'dem.pushmenu',
			'heat.pushmenu',
			'chroma.angularChroma',
			'ngMaterial',
			'angularFileUpload',
			'ui.service',
			'msg.service'
		]
	)
	.constant('_',
		window._
	)
	.run(["$rootScope", "$state", "$stateParams", "Auth", function ($rootScope, $state, $stateParams, Auth) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
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
		$rootScope.$on('$viewContentLoading', function(e, config) {
			//Auth.checkStatus();
			var auth = Auth.checkStatus();

			if(auth === false) {
					console.log(window)
					//window.location.href = "http://52.8.211.37/walmex.latlong.mx";
			}
		});
		return $rootScope;
	}])
	.config(function($mdThemingProvider){
		// var demoRedMap = $mdThemingProvider.extendPalette('red', {
		// 	'200': '#82c341',
		// 	'300': '#acd08c',
		// 	'400': '#cbdf7d',
		// 	'500': '#22ac9b',
		// 	'600': '#00b8b0',
		// 	'700': '#6fc9c4',
		// 	'contrastDefaultColor': 'light',
		// 	'contrastLightColors': ['500', '600', '700']
		// });
		$mdThemingProvider.definePalette('demo', {
			'50': '#22ac9b',
			'100': '#00b8b0',
			'200': '#6fc9c4',
			'300': '#82c341',
			'400': '#acd08c',
			'500': '#22ac9b',
			'600': '#00b8b0',
			'700': '#6fc9c4',
			'800': '#828189',
			'900': '#A2A2A7',
			'A100': '828189',
			'A200': '666470',
			'A400': '828189',
			'A700': 'A2A2A7',
			'contrastDefaultColor': 'light',
			'contrastLightColors': ['50', '100', '200'],
			'hue-1': '300',
			'hue-2': '400',
			'hue-3': '500',

		});
		$mdThemingProvider.theme('default')
		    .primaryPalette('demo')
	});
	//prueba push dandelion deploy
})();
