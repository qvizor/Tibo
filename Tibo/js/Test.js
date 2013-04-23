$(document).ready(function() {

	function drawLegend(grade) {
		$("#legend").empty();
		for (var i = 0; i < grade.length; i++) {
			$("#legend").append('<i style="background:' + grade[i].color + '"></i> ' + grade[i].scale + (i + 1 != grade.length ? '&ndash;' + grade[i + 1].scale + '<br>' : '+'));
		}
	};

	function getColor(value, grade) {
		for (var i = grade.length - 1; i >= 0; i++) {
			if (value >= grade[i].scale) {
				return grade[i].color;
			}
		}
	};

	drawLegend(gradeSquare);

	$("#legend").click(function() {
		drawLegend(gradePopulation);

		$('#hybrid').attr('checked', 'checked');
	});

	$("#legend").click(function() {
		drawLegend(gradePopulation);

		$('#hybrid').attr('checked', 'checked');
	});

	

});