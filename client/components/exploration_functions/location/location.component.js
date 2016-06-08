(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function locationDirective($mdDialog, LocationFactory, LocationService){

		return {
			restrict: 'E',
			require: '^explorationFunctions',
			scope: '=',
			template: [
				'<div>',
					'<li class="m-list-functions__item js-exploration-item" data-ep="location" tooltip-placement="right" uib-tooltip="Mis ubicaciones" tooltip-animation="true">',
						'<i class="m-list-functions__item-icon demo demo-location"></i>',
					'</li>',
					'<div class="m-side-panel js-location-side-panel">',
						'<h3 class="m-side-panel__title">Mis ubicaciones</h3>',
						'<div class="m-side-panel__actions pos-relative">',
							'<div>',
								'<h4 class="m-side-panel__subtitle">Agregar ubicación</h4>',
								'<md-button class="md-fab md-mini md-primary" ng-click="addLocation()">',
									'<md-icon>add</md-icon>',
								'</md-button>',
								'<div class="m-side-panel__switch">',
									'<md-switch class="md-primary md-mode-A200" aria-label="all-locations"></md-switch>',
								'</div>',
							'</div>',
							'<div class="m-side-panel__search">',
								'<md-input-container>',
									'<label>Buscar en mis ubicaciones</label>',
									'<input ng-model="user.firstName">',
								'</md-input-container>',
							'</div>',
							'<div class="m-side-panel__locations">',
								'<h4 class="m-side-panel__subtitle">Mis ubicaciones</h4>',
								'<div class="m-side-panel__locations-container">',
									'<ul class="m-side-panel__locations-list__container">',
										'<li class="m-side-panel__locations-list__list">',
											'<md-icon flex="10" class="m-side-panel__locations-list__item">add</md-icon>',
											'<p flex="45" class="m-side-panel__locations-list__item">Categoría</p>',
											'<p flex="20" class="m-side-panel__locations-list__item"># Sucursales</p>',
											'<md-switch flex="10" md-no-ink class="md-primary m-side-panel__locations-list__item" aria-label=""></md-switch>',
											'<md-button  class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item">',
												'<md-icon>close</md-icon>',
											'</md-button>',
										'</li>',
										'<md-divider></md-divider>',
									'</ul>',
								'</div>',
							'</div>',

							'<div class="ejemplo-locations">',
							  '<input type="file" id="inpFileUp">',
								'<div class="cont-file-columns"></div>',
								'<button id="btn-send-csv">Enviar</button>',
							'</div>',

						'</div>',
					'</div>',
				'</div>'
			].join(''),
			link: function(scope, element, attr){
				var _this = null;

				scope.fileObj = {};

				scope.addLocation = function(ev){
					$mdDialog.show({
						controller: 'AddLocationController',
						templateUrl: './components/exploration_functions/location/add-locations.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
					.then(function(newLocation) {
						console.log(newLocation);
					}, function(failAdding) {
						console.log(failAdding);
					});
				};

				element.on('change', function(evt){

					if(evt.target.id === 'inpFileUp'){
						LocationFactory.processCSV(evt.target.files[0],function(columns){
							var ops = '';
							for(var i=0; i<columns.length;i++){
								ops += '<option value="'+columns[i]+'">'+columns[i]+'</option>';
							}
							var div = angular.element(document.getElementsByClassName('cont-file-columns'));
							div.html('');
							div.append('<div>X:<select name="selColX">'+ops+'</select></div>');
							div.append('<div>Y:<select name="selColY">'+ops+'</select></div>');
							console.log(div);
						});
					} else if(evt.target.id === 'btn-send-csv'){
						
					}
				});
			}
		};
	}

	locationDirective.$inject = ['$mdDialog','LocationFactory', 'LocationService'];

	angular.module('location.directive', [])
		.directive('location', locationDirective);
})();
