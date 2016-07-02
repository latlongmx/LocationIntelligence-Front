(function(){
	L.TileLayer.DynamicWMS = L.TileLayer.WMS.extend({
		dinamicWmsParams: {
		},
		setDynamicParam: function(params){
			L.extend(this.dinamicWmsParams, params);
		},
		getTileUrl: function (coords) {
			var params = L.TileLayer.WMS.prototype.getTileUrl.call(this, coords);
			for(var o in this.dinamicWmsParams){
				if(typeof this.dinamicWmsParams[o] === 'function'){
					params += "&"+o+"="+this.dinamicWmsParams[o]();
				}
			}
			return params;
		}
	});
	L.tileLayer.dynamicWms = function (url, options) {
	return new L.TileLayer.DynamicWMS(url, options);
};
}());
