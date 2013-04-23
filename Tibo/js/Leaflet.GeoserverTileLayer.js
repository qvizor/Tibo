L.TileLayer.Geoserver = L.TileLayer.extend({
    _zeroLead: function(dig, leng) {
        var my_str1 = dig + "";
        while (my_str1.length < leng) {
            my_str1 = "0" + my_str1;
        }
        return my_str1;
    },
    _xyFolder: function(c, z) {
        var my_str2 = "";
        my_str2 = this._zeroLead(Math.floor(c / (Math.pow(2, Math.floor(z / 2)) * 2)), Math.floor(z / 6) + 1);
        return my_str2;
    },
    _transform: function(tilePoint, n) {
        var z = this._getZoomForUrl(),
            x = tilePoint.x,
            y = tilePoint.y,
            my_str = "";
        if (n === 1) {
            my_str = this._zeroLead(z, 2);
        }
        if (n === 2) {
            my_str = this._xyFolder(x, z) + "_" + this._xyFolder(y, z) + "/" + this._zeroLead(x, (Math.floor(z / 6) + 1) * 2);
        }
        if (n === 3) {
            my_str = this._zeroLead(y, (Math.floor(z / 6) + 1) * 2);
        }
        return my_str;
    },
    getTileUrl: function(tilePoint) {
        this._adjustTilePoint(tilePoint);
        return L.Util.template(this._url, L.extend({
            s: this._getSubdomain(tilePoint),
            z: this._transform(tilePoint, 1),
            x: this._transform(tilePoint, 2),
            y: this._transform(tilePoint, 3)
        }, this.options));
    }
});
L.TileLayer.geoserver = function(url, options) {
    return new L.TileLayer.Geoserver(url, options);
};