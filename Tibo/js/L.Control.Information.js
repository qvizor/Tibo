L.Control.Information = L.Control.extend({
    options: {
        position: 'bottomleft',
    },

    onAdd: function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
        L.DomEvent.disableClickPropagation(this._container);

        map.on('moveend', function (e) {
            if (map._loaded) {
                //this._container.innerHTML = 'Bbox: ' + map.getBounds().toBBoxString();
                this._container.innerHTML = map.getZoom().toString() + ' ' + map.getCenter().toString();
            }
        }, this);
        return this._container;
    },

    onRemove: function (map) {
        map.off('moveend');
    },
});