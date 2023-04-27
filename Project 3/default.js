function renderChart(inputData, dom_element_to_append_to, colorScheme, title, rawData, key) {
    var data = inputData;

	var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	.rangeRound([height2, 0]);

    //sorting color scheme
	var color = d3.scale.ordinal()
	.range(colorScheme);

    //gen x axis
	var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.tickFormat(function(d) {
		return (d);
	});

    //gen y axis
	var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.tickFormat(d3.format(".2s"));
    
    //getting d3 tip ready
	var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
        var thisMethod = 'null';
        var thisStatus = 'null';
        for(k in rawData)
        {
            if(rawData[k]['identifier'] == d.name)
            {
                thisMethod = rawData[k]['method'];
                thisStatus = rawData[k]['status'];
            }            
        }
        return "<div>Planet Identifier: <strong>" +d.name + "</strong></div><div>Discovery Method: " + thisMethod + "</div><div>Detection Status: " + thisStatus + "</div>";
	})

    //adding svg to the dom element
	var svg = d3.select(dom_element_to_append_to).append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)

    //adding graph title
    svg.append("text")
    .attr("x", (width / 2) + margin.left)             
    .attr("y", margin.top*3)
    .attr("text-anchor", "middle")  
    .style("font-size", "24px") 
    .text(title);
    // .text(title + ' (' + rawData.length + ' records)');

    //worlkable area
    var main = svg.append("g")
	.attr("height", height2)
	.attr("transform", "translate(" + margin.left + "," + (height*0.20) + ")");

	var active_link = "0";
	var legendClicked;
	var legendClassArray = [];
	var y_orig;

    //adding the tip
	svg.call(tip);

	color.domain(d3.keys(data[0]).filter(function(x) { return x !== key; }));

    //putting more info into data
	data.forEach(function(d) {
        var mylabel = d[key];
		var y0 = 0;
		d.params = color.domain().map(function(name) { return {mylabel: mylabel, name: name, y0: y0, y1: y0 += +d[name]}; });
		d.total = d.params[d.params.length - 1].y1;
        
	});
	data.sort(function(a, b) { return b.total - a.total; });

    //x y axis info
	x.domain(data.map(function(d) { return (d[key]); }));
	y.domain([0, d3.max(data, function(d) { return d.total; })]);

    //adding x axis
	main.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height2 + ")")
	.call(xAxis);

    //adding y axis
	main.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end");

    //adding columns
	var state = main.selectAll(".state")
	.data(data)
	.enter().append("g")
	.attr("class", function(d) { return "g"; })
	.attr("transform", function(d) { return "translate(" + "0" + ",0)"; });

    //adding each planets
	state.selectAll("rect")
	.data(function(d) {
		return d.params;
	})
	.enter().append("rect")
	.attr("width", x.rangeBand())
	.attr("y", function(d) { return y(d.y1); })
	.attr("x",function(d) {
		return x(d.mylabel)
	})
	.attr("height", function(d) { return y(d.y0) - y(d.y1); })
	.attr("class", function(d) {
		var classLabel = d.name.replace(/\s/g, '') + ' ' + key + d.mylabel.replace(/\s/g, '');
		return classLabel;
	})
	.style("fill", function(d) { 
        for(k in rawData)
        {
            if(rawData[k]['identifier'] == d.name)
            {
                thisColor = rawData[k]['color'];
            }            
        }
        return thisColor;
     });

    //interactions generation 
	state.selectAll("rect")
	.on("mouseover", function(d){

		var delta = d.y1 - d.y0;
		var xPos = parseFloat(d3.select(this).attr("x"));
		var yPos = parseFloat(d3.select(this).attr("y"));
		var height = parseFloat(d3.select(this).attr("height"))

        var thisClass = d3.select(this).attr("class").split(" ");
		highlight(thisClass[0]);
        tip.show(d);
	})
	.on("mouseout",function(){
		tip.hide();
        /*main.select(".tooltip").remove();*/
        var thisClass = d3.select(this).attr("class").split(" ");
		unHighlight(thisClass[0]);

	})
}