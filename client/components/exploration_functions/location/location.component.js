(function(){
	/**
	*  KlDirective Directive
	*/
	'use strict';

	function locationDirective($mdDialog, LocationFactory, LocationService, BaseMapFactory){

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
							  '<label for="inpFileNom">Nombre:</label><input type="text" id="inpFileNom"><br>',
							  '<label for="inpFileIco">Icono:</label><input type="text" id="inpFileIco" value="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Map_pin_icon.svg/2000px-Map_pin_icon.svg.png"><br>',
							  '<label for="inpFileUp">CSV:</label><input type="file" id="inpFileUp"><br>',
								'<div class="cont-file-columns"></div><br>',
								'<button id="btn-send-csv">Enviar</button>',
							'</div>',

							'<br>',
							'<button id="btn-get-locs">Obtener mis locaciones</button><br>',
							'<div class="ejemplo-my-locations">',
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
							div.append('<div>X(lng):<select id="selLocLng" name="selColX">'+ops+'</select></div>');
							div.append('<div>Y(lat):<select id="selLocLat" name="selColY">'+ops+'</select></div>');
							console.log(div);
						});
					}
				});

				element.on('click', function(evt){
					if(evt.target.className === 'zoomLocation'){
						BaseMapFactory.zoomLocation( evt.target.getAttribute('data-idlayer') );
					}else if(evt.target.className === 'ShowHideLocation'){
						if(evt.target.checked){
							BaseMapFactory.showLocation(evt.target.value);
						}else{
							BaseMapFactory.hideLocation(evt.target.value);
						}
					}else if(evt.target.id === 'btn-get-locs'){
						LocationService.getLocations().then(function(res){
							if(res.data && res.data.places){
								var div = angular.element(document.getElementsByClassName('ejemplo-my-locations'));
								div.html('');
								_.each(res.data.places,function(o){
									var id = o.id_layer+'-'+o.name_layer.replace(' ','_');
									div.append('<div data-idlayer="'+id+'">'+o.id_layer+' - '+o.name_layer+' ('+o.data.length+')'+
										'<input type="checkbox" class="ShowHideLocation" value="'+id+'">'+
										'<button class="zoomLocation" data-idlayer="'+id+'">zoom</button>'+
										'</div><br>');
									BaseMapFactory.addLocation({
										name: id,
										data: o.data
									});
								});
							}
						});

					}else if(evt.target.id === 'btn-send-csv'){
						var file = document.getElementById('inpFileUp');
						var formData = new FormData();
						formData.append('nm', $('#inpFileNom').val() );
						formData.append('lat', $('#selLocLat option:selected').val() );
						formData.append('lng', $('#selLocLng option:selected').val() );
						formData.append('pin', $('#inpFileIco').val() );
						formData.append('file', file.files[0] );


						LocationService.addNewLocation( formData );
					}
				});
			}
		};
	}

	locationDirective.$inject = ['$mdDialog','LocationFactory', 'LocationService', 'BaseMapFactory'];

	angular.module('location.directive', [])
		.directive('location', locationDirective);
})();
