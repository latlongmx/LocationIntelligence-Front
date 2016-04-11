(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	angular.module('basemap.service', []).
	service('BaseMapService', function(){
		this.mapId = 'pokaxperia.pk657nfi';
		this.accessToken = 'pk.eyJ1IjoicG9rYXhwZXJpYSIsImEiOiJjaW11N3o2N3UwMjk3dm9sdTZwOXJoNDduIn0.pycNbGB_4G68a0RmYTR5Sg';
		this.mapElement = L.map('basemap').setView([19.432711775616433, -99.13325428962708], 12);
	});


}());
