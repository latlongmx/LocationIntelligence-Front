(function(){
	/*
	* User Service Module
	*/
	'use strict';

	function UserFactory(BaseMapService, UserService){

		var factory = {};
		factory._map = undefined;
		factory.isInit = false;

		BaseMapService.map.then(function(map){
			factory._map = map;
		});

		factory.getMapView = function(){
			factory.isInit = true;
			UserService.getOptions().then(function(res){
				if(res.data && res.data.options){
					var ops = JSON.parse(res.data.options);
					if(ops.view && ops.view.lat && ops.view.lng && ops.view.z){
						BaseMapService.map.then(function(map){
							map.setView([ops.view.lat, ops.view.lng], ops.view.z);
							factory.isInit = false;
						});
					}else{
						factory.isInit = false;
					}
				}else{
					factory.isInit = false;
				}
			});
		};

		factory.saveMapView = function(){
			factory.getMapValues();
		};

		factory.getMapValues = _.debounce(function(){
			if(factory.isInit){
				return;
			}
			if(factory._map){
				var zoom = factory._map.getZoom();
				var center = factory._map.getCenter();

				var ops = {
					view:{
						lat: center.lat,
						lng: center.lng,
						z: zoom
					}
				};
				var formData = new FormData();
				formData.append('options', JSON.stringify(ops) );
				UserService.setOptions(formData);

				//setView
			}
		},2000);

		return factory;

	}
	UserFactory.$inject = ['BaseMapService', 'UserService'];
	angular.module('walmex').factory('UserFactory', UserFactory);

})();
