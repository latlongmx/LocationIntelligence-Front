(function(){
	/*
	* User Service Module
	*/
	'use strict';

	function UserFactory(BaseMapService){

		var factory = {};
		factory._map = undefined;

		BaseMapService.map.then(function(map){
			factory._map = map;
		});

		factory.saveMapView = function(){
			factory.getMapValues();
		};

		factory.getMapValues = _.debounce(function(){
			if(factory._map){
				var zoom = factory._map.getZoom();
				var center = factory._map.getCenter();
			}
		},2000);

		return factory;

	}
	UserFactory.$inject = ['BaseMapService'];
	angular.module('walmex').factory('UserFactory', UserFactory);

})();
