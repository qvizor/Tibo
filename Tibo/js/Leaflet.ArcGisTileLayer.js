L.TileLayer.ArcGis = L.TileLayer.extend({
    _zeroLead: function (d, l) {
        var s = d + "";
        while (s.length < l) {
            s = "0" + s;
        }
        return s;
    },
    getTileUrl: function (tilePoint) {
        this._adjustTilePoint(tilePoint);
        return L.Util.template(this._url, L.extend({
            s: this._getSubdomain(tilePoint),
            z: this._zeroLead(this._getZoomForUrl(), 2),
            x: this._zeroLead(tilePoint.x.toString(16), 8),
            y: this._zeroLead(tilePoint.y.toString(16), 8)
        }, this.options));
    }
});
L.TileLayer.arcgis = function (url, options) {
    return new L.TileLayer.ArcGis(url, options);
};