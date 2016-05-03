(function(){

	'use strict';

	angular.module('walmex',[
			'login',
			'login.service',
			'login.factory',
			'basemap',
			'basemap.directive',
			'basemap.service',
			'routes',
			'mapswitcher.directive',
			'maptools',
			'menu.directive',
			'exploration.directive',
			'location.modal.controller',
			'competence.modal.controller',
			'demography.modal.controller',
			'potential.modal.controller',
			'analysis.directive',
			'accessibility.modal.controller',
			'heatmap.modal.controller',
			'od.modal.controller',
			'rings.modal.controller',
			'historical.directive',
			'search.directive',
			'ui.router',
			'ui.bootstrap'
		]
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
		$rootScope.$on('$stateChangeStart', function() {
			var auth = Auth.checkStatus();
			
			if(auth === false) {
				setTimeout(function() {
					window.location.href = "http://52.8.211.37/walmex.latlong.mx";
				}, 0);
			}
			
			$rootScope.$apply();

		});
		return $rootScope;
	}]);

}());
