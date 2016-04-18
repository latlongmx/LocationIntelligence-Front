(function(){
	/*
	* BaseMap Module
	*/
	'use strict';
	
	function BaseMapService(){
		this.featureGroup = L.featureGroup();
		this.mapId = 'pokaxperia.pk657nfi';
		this.accessToken = 'pk.eyJ1IjoicG9rYXhwZXJpYSIsImEiOiJjaW13eHJ2NHMwM2Uwdjdra3c1bWF3Nzd6In0.leOLCkHazd_6JAQtdiHOFw';
		this.google_roadmap = new L.Google('ROADMAP');
		this.google_satellite = new L.Google();
		this.mapbox_streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.accessToken, {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="http://mapbox.com">Mapbox</a>',
					id: this.mapId
				});
		
		this.mapbox_relieve = function(){
			return L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.accessToken, {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="http://mapbox.com">Mapbox</a>',
					id: 'caarloshugo1.lnipn7db'
				});
			}
		this.mapbox_satellite = function(){
			return L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.accessToken, {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="http://mapbox.com">Mapbox</a>',
					id: 'mapbox.satellite'
				});
			}
		this.mapElement = function(){
			return L.map('basemap').setView([19.432711775616433, -99.13325428962708], 12);
		}
		this.drawControl = function(featureGroup){
			return new L.Control.Draw({
				draw: {
					rectangle: false,
					marker: false,
					polyline: {
						shapeOptions: {
	          	color: '#f06eaa',
							opacity: 1
	          }
	        },
				},
				edit: {
					featureGroup: featureGroup,
					selectedPathOptions: {
			        maintainColor: true
			    }
				}
			})
		}
		this.AutoComplete = function(searchInput){
				return new google.maps.places.Autocomplete(searchInput);
		}
		// this.BindToAutocomplete = function(){
			// return this.AutoComplete(bindTo('bounds', this.mapElement()));
		// }
	}
		
	angular.module('basemap.service', []).
		service('BaseMapService', BaseMapService);

}());
