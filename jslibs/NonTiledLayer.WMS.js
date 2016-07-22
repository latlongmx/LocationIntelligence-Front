/*
 * L.NonTiledLayer.WMS is used for putting WMS non tiled layers on the map.
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
    info_format:'geojson'
  },

  options: {
    crs: null,
    uppercase: false
  },

  initialize: function(url, options) { // (String, Object)
    this._wmsUrl = url;

    var wmsParams = L.extend({}, this.defaultWmsParams);

    // all keys that are not NonTiledLayer options go to WMS params
    for (var i in options) {
      if (!L.NonTiledLayer.prototype.options.hasOwnProperty(i) &&
        !L.Layer.prototype.options.hasOwnProperty(i)) {
        wmsParams[i] = options[i];
      }
    }

    this.wmsParams = wmsParams;

    L.setOptions(this, options);
  },

  onAdd: function(map) {
    this._crs = this.options.crs || map.options.crs;
    this._wmsVersion = parseFloat(this.wmsParams.version);

    var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
    this.wmsParams[projectionKey] = this._crs.code;

    L.NonTiledLayer.prototype.onAdd.call(this, map);
    map.on('click', this.getFeatureInfo, this);
  },
  onRemove: function(map) {
    L.NonTiledLayer.prototype.onRemove.call(this, map);
    map.off('click', this.getFeatureInfo, this);
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
  },

  getImageUrl: function(world1, world2, width, height) {
    var wmsParams = this.wmsParams;
    wmsParams.width = width;
    wmsParams.height = height;

    var nw = this._crs.project(world1);
    var se = this._crs.project(world2);

    var url = this._wmsUrl;

    var bbox = bbox = (this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326 ? [se.y, nw.x, nw.y, se.x] : [nw.x, se.y, se.x, nw.y]).join(',');

    return url +
      L.Util.getParamString(this.wmsParams, url, this.options.uppercase) +
      (this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;
  },

  setParams: function(params, noRedraw) {

    L.extend(this.wmsParams, params);

    if (!noRedraw) {
      this.redraw();
    }

    return this;
  }
});

L.nonTiledLayer.wms = function(url, options) {
  return new L.NonTiledLayer.WMS(url, options);
};
