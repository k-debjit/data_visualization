var data = [{"status":"Confirmed planets","type":60},{"status":"Controversial","type":30},{"status":"Not defined","type":10}];
	var width = 400,
	height = 400,
	radius = Math.min(width, height) / 2;
	var color = d3.scaleOrdinal()
	.range(["#2C93E8","#838690","#F56C4E"]);
	var pie = d3.pie()
	.value(function(d) { return d.type; })(data);
	var arc = d3.arc()
	.outerRadius(radius - 10)
	.innerRadius(0);

	var labelArc = d3.arc()
	.outerRadius(radius - 40)
	.innerRadius(radius - 40);
	var svg = d3.select("#pie")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width/2 + "," + height/2 +")"); // Moving the center point. 1/2 the width and 1/2 the height
	var g = svg.selectAll("arc")
	.data(pie)
	.enter().append("g")
	.attr("class", "arc");
	
	g.append("path")
	.attr("d", arc)
	.style("fill", function(d) { return color(d.data.status);});
	
	g.append("text")
	.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
	.text(function(d) { return d.data.type;})
	.style("fill", "#fff");