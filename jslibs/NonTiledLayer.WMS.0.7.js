/*
 * L.NonTiledLayer.WMS is used for putting WMS non-tiled layers on the map.
 */

L.NonTiledLayer.WMS = L.NonTiledLayer.extend({

	defaultWmsParams: {
		service: 'WMS',
		request: 'GetMap',
		version: '1.1.1',
		layers: '',
		styles: '',
		format: 'image/jpeg',
		transparent: false,
		srs: 'EPSG:4326',
		info_format:'geojson'
	},

	options: {
    crs: null,
    uppercase: false
  },

	initialize: function (url, options) { // (String, Object)
		this._wmsUrl = url;

		var wmsParams = L.extend({}, this.defaultWmsParams);

		// all keys that are not NonTiledLayer options go to WMS params
		for (var i in options) {
			if (!L.NonTiledLayer.prototype.options.hasOwnProperty(i)) {
				wmsParams[i] = options[i];
			}
		}

		this.wmsParams = wmsParams;

		L.setOptions(this, options);
	},

	onAdd: function (map) {
		var projectionKey = parseFloat(this.wmsParams.version) >= 1.3 ? 'crs' : 'srs';
		this.wmsParams[projectionKey] = this.options.crs.code || map.options.crs.code;

		L.NonTiledLayer.prototype.onAdd.call(this, map);
		map.off('click', this.getFeatureInfo, this);
		map.on('click', this.getFeatureInfo, this);
	},

	getFeatureInfo: function(evt) {
    // Make an AJAX request to the server and hope for the best
    var url = this.getFeatureInfoUrl(evt.latlng),
      showResults = L.Util.bind(this.showGetFeatureInfo, this);
    $.ajax({
      url: url,
      success: function(data, status, xhr) {
        var err = typeof data === 'string' ? null : data;
        showResults(err, evt.latlng, data);
      },
      error: function(xhr, status, error) {
        //console.log(error);
        //showResults(error);
      }
    });
  },

  getFeatureInfoUrl: function(latlng) {
    // Construct a GetFeatureInfo request URL given a point
    var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
      size = this._map.getSize(),

      params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:4326',
        styles: this.wmsParams.styles,
        transparent: this.wmsParams.transparent,
        version: this.wmsParams.version,
        format: this.wmsParams.format,
        bbox: this._map.getBounds().toBBoxString(),
        height: size.y,
        width: size.x,
        layers: this.wmsParams.layers,
        query_layers: this.wmsParams.layers,
        info_format: this.wmsParams.info_format
      };

    params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
    params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

    var url = this._wmsUrl + L.Util.getParamString(params, this._url, true);
    if(url.indexOf('?REQUEST')!== -1){
      url = url.replace('?REQUEST','&REQUEST');
    }

    return url;
  },

  showGetFeatureInfo: function(err, latlng, content) {
    if (err) {
      console.log(err);
      return;
    } // do nothing if there's an error

		try{
			var html = "";
	    var json = JSON.parse(content);
	    _.each(json.features, function(o){
	      _.each(o.properties.description, function(oo, i){
	        _.each(oo,function(v,n){
	          html += "<strong>"+n.trim()+"</strong>:"+v.trim()+"<br>";
	        });
	      });
	    });

	    // Otherwise show the content in a popup, or something.
	    L.popup({
	        maxWidth: 800
	      })
	      .setLatLng(latlng)
	      .setContent(html)
	      .openOn(this._map);
		}catch(e){

		}

  },

	getImageUrl: function (world1, world2, width, height) {
		var wmsParams = this.wmsParams;
		wmsParams.width = width;
		wmsParams.height = height;

		var crs = this.options.crs || this._map.options.crs;

		var p1 = crs.project(world1);
		var p2 = crs.project(world2);

		var url = this._wmsUrl + L.Util.getParamString(wmsParams, this._wmsUrl) + '&bbox=' + p1.x + ',' + p2.y + ',' + p2.x + ',' + p1.y;
		return url;
	},

	setParams: function (params, noRedraw) {

		L.extend(this.wmsParams, params);

		if (!noRedraw) {
			this.redraw();
		}

		return this;
	}
});

L.nonTiledLayer.wms = function (url, options) {
	return new L.NonTiledLayer.WMS(url, options);
};
