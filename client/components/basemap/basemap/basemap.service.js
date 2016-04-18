(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	angular.module('basemap.service', []).
	service('BaseMapService', function(){
		this.mapId = 'pokaxperia.pk657nfi';
		this.accessToken = 'pk.eyJ1IjoicG9rYXhwZXJpYSIsImEiOiJjaW13eHJ2NHMwM2Uwdjdra3c1bWF3Nzd6In0.leOLCkHazd_6JAQtdiHOFw';
		this.mapElement = L.map('basemap').setView([19.432711775616433, -99.13325428962708], 12);
	});


}());
