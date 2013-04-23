$(document).ready(function() {
	var map = new L.Map('map', {
		zoomControl: true,
		minZoom: 7,
		maxZoom: 18
	}).addControl(new L.Control.Scale()),
		gkgcDefault = new L.TileLayer.geoserver(gkgcDefaultString, {
			minZoom: 7,
			maxZoom: 16,
			tms: true
		}).addTo(map),
		gkgcAlternative = new L.TileLayer.geoserver(gkgcAlternativeString, {
			minZoom: 7,
			maxZoom: 9,
			tms: true
		}),
		afs = L.TileLayer.arcgis(afsString, {
			minZoom: 12,
			maxZoom: 18
		}),
		landscape = L.TileLayer.arcgis(landscapeString, {
			minZoom: 7,
			maxZoom: 12
		}),
		zis = L.TileLayer.arcgis(zisString, {
			minZoom: 12,
			maxZoom: 17
		}),

		historySoviet = L.TileLayer.arcgis(historySovietString, {
			minZoom: 12,
			maxZoom: 16
		}),
		historyGerman = L.TileLayer.arcgis(historyGermanString, {
			minZoom: 11,
			maxZoom: 15
		}),
		history3verst = L.TileLayer.arcgis(history3verstString, {
			minZoom: 8,
			maxZoom: 16
		}),
		hybrid = L.TileLayer.arcgis(hybridString, {
			minZoom: 11,
			maxZoom: 17
		}),
		geojsonRoads = L.geoJson(jsonRoads, {
			style: styleRoads,
			minZoom: 14,
			maxZoom: 18
		}),
		geojsonBuildings = L.geoJson(jsonBuildings, {
			style: styleBuildings,
			minZoom: 14,
			maxZoom: 18
		}),
		gkgcDefaultGeoJsonRegion = new L.TileLayer.geoserver(gkgcDefaultString, {
			minZoom: 7,
			maxZoom: 11,
			tms: true
		}),
		geojsonRegion, miniMapLayer, miniMap, objectIndex,
		layer        = "default",
		layerHistory = "soviet",
		property     = "population",
		grade        = gradePopulation;

	/*miniMapLayer = new L.TileLayer('http://172.16.62.100/old/cache/{z}/{x}/{y}.png8',
		{
			minZoom: 5,
			maxZoom: 13
		});
	
	miniMap = new L.Control.MiniMap(miniMapLayer,
		{
			toggleDisplay: true
		}).addTo(map);*/

	function getColor(feat) {
		//выбор цвета в зависимости от текущего выбора параметра района
		var value;
		switch (property) {
			case 'population':
				value = feat.properties.popul;
				break;
			case 'square':
				value = feat.properties.square;
				break;
			case 'paking':
				value = feat.properties.plotn;
				break;
		}

		for (var i = grade.length - 1; i >= 0; i--) {
			if (value > grade[i].scale) {

				return grade[i].color;
			}
		}
		return "#fff";
	}

	function styleRegion(feature) {
		// раскраская района
		return {
			fillColor: getColor(feature),
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		};
	}

	function highlightFeatureRegion(e) {
		//событие при наведении на район
		var regionTarget = e.target;

		regionTarget.setStyle(styleRegionHighlight);

		if (!L.Browser.ie && !L.Browser.opera) {
			regionTarget.bringToFront();
		}
	}

	function resetHighlightRegion(e) {
		// событие, когда мышь убрана с выделенного района
		geojsonRegion.resetStyle(e.target);
		$("#infoPanel").empty();
		$("#infoPanel").append('Нажмите на объект <br>для получения информации');
	}

	function zoomToFeatureRegion(e) {
		// событие клика по району, приближение и вывод атрибутивной информации
		map.fitBounds(e.target.getBounds());
		var regionTarget = e.target;
		drawInfoRegion(regionTarget.feature.properties);
	}

	function onEachFeatureRegion(feature, regionTarget) {
		// события для района
		regionTarget.on({
			mouseover: highlightFeatureRegion,
			mouseout: resetHighlightRegion,
			click: zoomToFeatureRegion
		});
	}

	function highlightFeatureJson(e) {
		//событие при наведении на район
		var temp = null;
		var jsonTarget = e.target;
		try {
			temp = objectIndex.feature;
			if (e.target.feature != temp) {

				jsonTarget.setStyle(styleJsonHighlight);

				if (!L.Browser.ie && !L.Browser.opera) {
					jsonTarget.bringToFront();
				}
			}
		} catch (err) {

			jsonTarget.setStyle(styleJsonHighlight);

			if (!L.Browser.ie && !L.Browser.opera) {
				jsonTarget.bringToFront();
			}
		}
	}

	function resetHighlightJson(e) {

		var temp = null;
		try {
			temp = objectIndex.feature;

			if (e.target.feature != temp) {

				if (e.target.feature.geometry.type == "Polygon") {
					e.target.setStyle(styleBuildings);
				} else {
					e.target.setStyle(styleRoads);
				}

				// событие, когда мышь убрана с выделенного района
				//geojsonRegion.resetStyle(e.target);

			} else {
				//$("#infoPanel").empty();
				//$("#infoPanel").append('Нажмите на объект <br>для получения информации');
			}
		} catch (err) {

			if (e.target.feature.geometry.type == "Polygon") {
				e.target.setStyle(styleBuildings);
			} else {
				e.target.setStyle(styleRoads);
			}

		}
	}

	function zoomToFeatureJson(e) {
		try {
			if (objectIndex.feature.geometry.type == "Polygon") {
				objectIndex.setStyle(styleBuildings);
			} else {
				objectIndex.setStyle(styleRoads);
			}
		} catch (err) {

		}

		objectIndex = e.target;
		e.target.setStyle(styleJsonChosen);
		// событие клика по району, приближение и вывод атрибутивной информации
		map.fitBounds(e.target.getBounds());


		var regionTarget = e.target;
		drawInfoJson(regionTarget.feature.properties, regionTarget.feature.geometry.type);
	}

	function onEachFeatureJson(feature, regionTarget) {
		// события для geojson
		regionTarget.on({
			mouseover: highlightFeatureJson,
			mouseout: resetHighlightJson,
			click: zoomToFeatureJson
		});
	}

	function drawLegend() {
		// вывод легенды в зависимости от текущего параметра
		$("#legendPanel").empty();
		switch (property) {
			case 'population':
				$("#legendPanel").append('Население тыс.чел.<br/>');
				break;
			case 'square':
				$("#legendPanel").append('Площадь км&sup2;<br/>');
				break;
			case 'paking':
				$("#legendPanel").append('Плотность чел/км&sup2;<br/>');
				break;
		}

		for (var i = 0; i < grade.length; i++) {
			$("#legendPanel").append('<i style="background:' + grade[i].color + '"></i> ' + (i + 1 != grade.length ? grade[i].scale + '&ndash;' + grade[i + 1].scale + '<br>' : '> ' + grade[i].scale));
		}
	}

	function drawInfoRegion(item) {
		// вывод информации о выбранном районе
		$("#infoPanel").empty();
		$("#infoPanel").append('<b>' + item.namerus + '</b><br/>');
		$("#infoPanel").append('Население: ' + item.popul + ' чел.<br/>');
		$("#infoPanel").append('Городское население: ' + item.city + ' чел.<br/>');
		$("#infoPanel").append('Сельское население: ' + item.rural + ' чел.<br/>');
		$("#infoPanel").append('Площадь: ' + item.square + ' км&sup2;<br/>');
		$("#infoPanel").append('Плотность: ' + item.plotn + ' чел./км&sup2;<br/>');
	}

	function drawInfoJson(item, geometry) {
		// вывод информации о выбранном объекте

		$("#infoPanel").empty();
		if (geometry == "Polygon") {

			$("#infoPanel").append('<b> Информация об объекте: </b><br/>');
			$("#infoPanel").append('Город: ' + item.city + '<br/>');
			$("#infoPanel").append('Адрес: ' + item.typestreet + ' ' + item.namerus + ', ' + item.adress + '<br/>');
			$("#infoPanel").append('Тип: ' + item.rod + '<br/>');

		} else {
			$("#infoPanel").append('<b> Информация об объекте: </b><br/>');
			$("#infoPanel").append('Город: ' + item.city + '<br/>');
			$("#infoPanel").append('Район города: ' + item.cityregion + '<br/>');
			$("#infoPanel").append('Адрес: ' + item.labelstree + '<br/>');
			$("#infoPanel").append('Тип: ' + item.typeroad + '<br/>');
		}
	}

	function setupDeselectEvent() {
		// Добавление события deselect для всех радиобатонов
		var selected = {};
		$('input[type="radio"]').on('click', function() {
			if (this.name in selected && this != selected[this.name]) $(selected[this.name]).trigger("deselect");
			selected[this.name] = this;
		}).filter(':checked').each(function() {
			selected[this.name] = this;
		});
	}

	setupDeselectEvent(true);

	$('input[name="panel"]').on('deselect', function() {
		//обработчик события deselect для общих элементов панели
		switch (this.id) {
			case "default":
				map.removeLayer(gkgcDefault);
				break;
			case "alexTest":
				map.removeLayer(gkgcAlternative);
				break;
			case "afs":
				map.removeLayer(afs);
				break;
			case "zis":
				map.removeLayer(zis);
				break;
			case "landscape":
				map.removeLayer(landscape);
				break;
			case "region":
				map.removeLayer(geojsonRegion);
				map.removeLayer(gkgcDefaultGeoJsonRegion);
				$('input[name="panelRegion"]').attr('disabled', 'disabled');
				$('div#legendPanel').attr('hidden', 'hidden');
				$("#infoPanel").empty();
				$("#infoPanel").append('Нажмите на объект <br>для получения информации');
				$('div#infoPanel').attr('hidden', 'hidden');
				break;
			case "geojson":
				map.removeLayer(geojsonRoads);
				map.removeLayer(geojsonBuildings);
				map.removeLayer(afs);
				objectIndex = null;
				$("#infoPanel").empty();
				$("#infoPanel").append('Нажмите на объект <br>для получения информации');
				$('div#infoPanel').attr('hidden', 'hidden');
				break;
			case "history":
				switch (layerHistory) {
					case "soviet":
						map.removeLayer(historySoviet);
						map.removeLayer(afs);
						break;
					case "german":
						map.removeLayer(historyGerman);
						map.removeLayer(gkgcDefault);
						break;
					case "3verst":
						map.removeLayer(history3verst);
						map.removeLayer(gkgcDefault);
						break;
				}
				// $('input[name="hybrid"]').removeAttr('checked');

				$('input[name="hybrid"]').attr('disabled', 'disabled');
				$('input[name="panelHistory"]').attr('disabled', 'disabled');
				HybridChange();
				/*$('div#legendPanel').attr('hidden', 'hidden');
				$("#infoPanel").empty();
				$("#infoPanel").append('Нажмите на объект <br>для получения информации');
				$('div#infoPanel').attr('hidden', 'hidden');*/
				break;

		}
	});

	$('input[name="panelRegion"]').on('deselect', function() {
		// обработка события deselect для панели с районами
		switch (this.id) {
			case "population":
				map.removeLayer(geojsonRegion);
				break;
			case "square":
				map.removeLayer(geojsonRegion);
				break;
			case "paking":
				map.removeLayer(geojsonRegion);
				break;
		}
	});


	$('input[name="panelHistory"]').on('deselect', function() {
		// обработка события deselect для панели с районами
		switch (this.id) {
			case "soviet":
				HybridChange();
				$('input[name="hybrid"]').attr('disabled', 'disabled');
				$('input[name="hybrid"]').removeAttr('checked');

				map.removeLayer(historySoviet);
				map.removeLayer(afs);
				break;
			case "german":
				HybridChange();
				$('input[name="hybrid"]').attr('disabled', 'disabled');
				$('input[name="hybrid"]').removeAttr('checked');

				map.removeLayer(historyGerman);
				map.removeLayer(gkgcDefault);
				break;
			case "3verst":
				map.removeLayer(history3verst);
				map.removeLayer(gkgcDefault);
				break;
		}
	});

	$('input[name="panelHistory"]').click(function() {
		// обработка нажатия на панель с историей

		switch (this.id) {
			case "soviet":
				map.addLayer(afs);
				map.addLayer(historySoviet);
				$('input[name="hybrid"]').removeAttr('disabled');
				$('input[name="hybrid"]').removeAttr('checked');
				layerHistory = "soviet";
				map.setView(new L.LatLng(53.88583, 27.5762), 12);
				// layer = "default";
				break;
			case "german":
				map.addLayer(gkgcDefault);
				map.addLayer(historyGerman);
				$('input[name="hybrid"]').removeAttr('disabled');
				$('input[name="hybrid"]').removeAttr('checked');
				map.setView(new L.LatLng(53.90535, 27.58495), 11);
				layerHistory = "german";
				break;
			case "3verst":
				map.addLayer(gkgcDefault);
				map.addLayer(history3verst);
				map.setView(new L.LatLng(53.50847, 26.92337), 9);
				layerHistory = "3verst";
				break;
		}
	});

	$('input[name="panelRegion"]').click(function() {
		// обработка нажатия на панель с районами
		if (property != this.id) {
			property = this.id;
			switch (this.id) {
				case "population":
					grade = gradePopulation;
					drawLegend();
					geojsonRegion = L.geoJson(jsonRegion, {
						style: styleRegion,
						onEachFeature: onEachFeatureRegion
					}).addTo(map);

					break;
				case "square":
					grade = gradeSquare;
					drawLegend();
					geojsonRegion = L.geoJson(jsonRegion, {
						style: styleRegion,
						onEachFeature: onEachFeatureRegion
					}).addTo(map);
					break;
				case "paking":
					grade = gradePaking;
					drawLegend();
					geojsonRegion = L.geoJson(jsonRegion, {
						style: styleRegion,
						onEachFeature: onEachFeatureRegion
					}).addTo(map);
					break;
			}
		}
	});

	$('input[name="panel"]').click(function() {
		// обработка нажатия на радиобатн всей панели
		switch (this.id) {
			case "default":
				map.addLayer(gkgcDefault);
				layer = "default";
				break;
			case "alexTest":
				gkgcAlternative.addTo(map);
				map.setView(new L.LatLng(53.49785, 28.26782), 7);
				layer = "alexTest";
				break;
			case "afs":
				afs.addTo(map);
				map.setView(new L.LatLng(53.88805, 27.5774), 12);
				layer = "afs";
				break;
			case "zis":
				zis.addTo(map);
				map.setView(new L.LatLng(53.94845, 27.78932), 15);
				layer = "zis";
				break;
			case "landscape":
				landscape.addTo(map);
				map.setView(new L.LatLng(53.4439, 27.92725), 8);
				layer = "landscape";
				break;
			case "region":
				if (layer != "region") {
					geojsonRegion = L.geoJson(jsonRegion, {
						style: styleRegion,
						onEachFeature: onEachFeatureRegion
					}).addTo(map);

					gkgcDefaultGeoJsonRegion.addTo(map);
					$('input[name="panelRegion"]').removeAttr('disabled');
					$('div#legendPanel').removeAttr('hidden');
					$('div#infoPanel').removeAttr('hidden');
				}
				layer = "region";
				map.setView(new L.LatLng(53.41281, 28.57544), 7);
				break;
			case "geojson":
				afs.addTo(map);

				geojsonRoads = L.geoJson(jsonRoads, {
					style: styleRoads,
					onEachFeature: onEachFeatureJson
				}).addTo(map);

				geojsonBuildings = L.geoJson(jsonBuildings, {
					style: styleBuildings,
					onEachFeature: onEachFeatureJson
				}).addTo(map);
				$('div#infoPanel').removeAttr('hidden');
				map.setView(new L.LatLng(53.91837, 27.57234), 14);
				layer = "geojson";
				break;

			case "history":

				switch (layerHistory) {
					case "soviet":
						afs.addTo(map);
						map.addLayer(historySoviet);
						$('input[name="hybrid"]').removeAttr('disabled');
						HybridAdd();
						map.setView(new L.LatLng(53.88583, 27.5762), 12);
						break;
					case "german":
						gkgcDefault.addTo(map);
						map.addLayer(historyGerman);
						$('input[name="hybrid"]').removeAttr('disabled');
						HybridAdd();
						map.setView(new L.LatLng(53.90535, 27.58495), 11);
						break;
					case "3verst":
						gkgcDefault.addTo(map);
						map.addLayer(history3verst);
						map.setView(new L.LatLng(53.50847, 26.92337), 9);
						break;
				}
				$('input[name="panelHistory"]').removeAttr('disabled');
				// 
		}

	});

	map.setView(new L.LatLng(53.41281, 28.57544), 7);
	drawLegend();

	function HybridChange() {
		if ($("#hybrid").is(':checked')) {
			map.removeLayer(hybrid);
		}
	}

	function HybridAdd() {
		if ($("#hybrid").is(':checked')) {
			map.addLayer(hybrid);
			hybri.bringToFront();
		}
	}


	$("#hybrid").on("change", function() {
		if ($("#hybrid").is(':checked')) {
			map.addLayer(hybrid);
			hybri.bringToFront();
		} else {
			map.removeLayer(hybrid);
		}
	});


	/* Отработка скролла по карте
	function onMapScrollWheel(e) {
		switch (layer) {
			case "region":
				if (map.getZoom() > 11) {
					map.setZoom(11);
				};
				break;
		}
	};
	map.on('zoomend', onMapScrollWheel);
	*/
});