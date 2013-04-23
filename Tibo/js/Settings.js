var gkgcDefaultString     = 'file://172.16.0.100/common/625/kazakov/geo/gkgc/EPSG_900913_{z}/{x}_{y}.png8',
	gkgcAlternativeString = 'http://172.16.62.100:81/alexTest/EPSG_900913_{z}/{x}_{y}.png8',
	afsString             = 'file://172.16.0.100/common/625/kazakov/geo/daf/L{z}/R{y}/C{x}.png',
	landscapeString       = 'http://172.16.62.100:81/landscape/L{z}/R{y}/C{x}.png',
	zisString             = 'http://172.16.62.100:81/zis/L{z}/R{y}/C{x}.png',
	historySovietString   = 'file://172.16.0.100/common/625/kazakov/geo/sovet/L{z}/R{y}/C{x}.png',
	historyGermanString   = 'file://172.16.0.100/common/625/kazakov/geo/german/L{z}/R{y}/C{x}.png',
	history3verstString   = 'file://172.16.0.100/common/625/kazakov/geo/oldmap/L{z}/R{y}/C{x}.png',
	hybridString          = 'file://172.16.0.100/common/625/kazakov/geo/hybrid/L{z}/R{y}/C{x}.png',
	gradeSquare           = [{
		color: "#15FC04",
		scale: 0
	}, {
		color: "#17C309",
		scale: 2000
	}, {
		color: "#1AAF0E",
		scale: 3000
	}, {
		color: "#1C9C11",
		scale: 4000
	}, {
		color: "#1B8C12",
		scale: 5000
	}, {
		color: "#1B8113",
		scale: 6000
	}, {
		color: "#186412",
		scale: 7000
	}, {
		color: "#134E0E",
		scale: 9000
	}],
	gradePopulation = [{
		color: "#F9DE1F",
		scale: 0
	}, {
		color: "#F9C61F",
		scale: 10000
	}, {
		color: "#F9B81F",
		scale: 20000
	}, {
		color: "#F9A51F",
		scale: 30000
	}, {
		color: "#F9951F",
		scale: 40000
	}, {
		color: "#F97E1F",
		scale: 60000
	}, {
		color: "#F95F1F",
		scale: 80000
	}, {
		color: "#F9401F",
		scale: 100000
	}, {
		color: "#F91F1F",
		scale: 150000
	}],
	gradePaking = [{
		color: "#F9DE1F",
		scale: 0
	}, {
		color: "#F9C61F",
		scale: 10000
	}, {
		color: "#F9B81F",
		scale: 20000
	}, {
		color: "#F9A51F",
		scale: 30000
	}, {
		color: "#F9951F",
		scale: 40000
	}, {
		color: "#F97E1F",
		scale: 60000
	}, {
		color: "#F95F1F",
		scale: 80000
	}, {
		color: "#F9401F",
		scale: 100000
	}, {
		color: "#F91F1F",
		scale: 150000
	}],
	styleRoads = {
		"color": "#ff7800",
		"weight": 7,
		"opacity": 0.65
	},
	styleBuildings = {
		"color": "#0A86A4",
		"weight": 3,
		"opacity": 0.65
	},
	styleJsonHighlight = {
		weight: 5,
		color: '#043CEC',
		dashArray: '',
		fillOpacity: 0
	},
	styleJsonChosen = {
		weight: 5,
		color: '#EC0604',
		dashArray: '',
		fillOpacity: 0
	},
	styleRegionHighlight = {
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0
	};