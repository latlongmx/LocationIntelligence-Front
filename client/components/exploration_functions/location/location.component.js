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
									'<input ng-model="search_location">',
								'</md-input-container>',
							'</div>',
							'<div class="m-side-panel__locations">',
								'<h4 class="m-side-panel__subtitle">Mis ubicaciones</h4>',
								'<div class="m-side-panel__locations-container">',
									'<ul class="m-side-panel__locations-list__container-titles">',
										'<li class="m-side-panel__locations-list__list">',
											'<p flex="10" class="m-side-panel__locations-list__item bold">Icono</p>',
											'<p flex="45" class="m-side-panel__locations-list__item bold">Categoría</p>',
											'<p flex="20" class="m-side-panel__locations-list__item bold"># Sucursales</p>',
											'<p flex="10" class="m-side-panel__locations-list__item bold">Visualizar</p>',
											'<p flex="10" class="m-side-panel__locations-list__item bold"></p>',
										'</li>',
									'</ul>',
									'<ul class="m-side-panel__locations-list__container">',
										'<li class="m-side-panel__locations-list__list js-location-item" ng-repeat="location in locations | filter: search_location">',
											'<md-icon flex="10" class="m-side-panel__locations-list__item m-side-panel__locations-list__item__add js-add-icon-location" id="{{location.id_ubicacion}}" ng-click="addIconLocation(location.id_ubicacion)">{{new_icon}}</md-icon>',
											'<p flex="45" class="m-side-panel__locations-list__item">{{location.categoria}}</p>',
											'<p flex="20" class="m-side-panel__locations-list__item">{{location.sucursales}}</p>',
											'<md-switch flex="10" md-no-ink aria-label="location.id_ubicacion" data-id-location="{{location.id_ubicacion}}" class="md-primary m-side-panel__locations-list__item" aria-label=""></md-switch>',
											'<md-button data-id-location="location.id_ubicacion" class="md-icon-button md-button md-ink-ripple m-side-panel__locations-list__item" ng-click="removeLocation(location)">',
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
				var _this = null,
				_removeLocationItem = null,
				_changeLocationIcon = null;
				scope.fileObj = {};
				scope.new_icon = "add";

				scope.addLocation = function(ev){
					$mdDialog.show({
						controller: 'AddLocationController',
						templateUrl: './components/exploration_functions/location/add-locations.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
					.then(function(newLocations) {
						scope.locations = newLocations;
					}, function(failAdding) {
						console.log(failAdding);
					});
				}
				
				scope.addIconLocation = function(ev) {
					$mdDialog.show({
						controller: 'AddIconLocationController',
						templateUrl: './components/exploration_functions/location/add_icon/add-icon-location.tpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
					.then(function(newIcon) {
						_changeLocationIcon = angular.element(document.getElementById(ev));
						console.log(_changeLocationIcon)
						_changeLocationIcon[0].textContent = newIcon;
						
					}, function(failAddingIcon) {
						console.log(failAddingIcon)
					});
				}
				
				scope.removeLocation = function(indexItem) {
					_removeLocationItem = scope.locations.indexOf(indexItem);
					if (_removeLocationItem !== -1) {
						scope.locations.splice(_removeLocationItem, 1);
					}
				}


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
