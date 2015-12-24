
testdata = { "hashtags": [ {"name":"India", "count":"99"}, 
							{"name":"China", "count":"189"}] }

var socket = io('http://192.168.59.128:4000');

svgArea = d3.select("body").append("div")
							.attr("class","container-fluid")
							.append("svg").attr("width",1500).attr("height",700);

axisGroup = svgArea.append("g").attr("class","test").attr("transform","translate(150,50)");

xScale = d3.scale.linear()
					.domain([0,100])
					.range([0,1300]);

yScale = d3.scale.linear()
					.domain([100,0])
					.range([0,500]);

xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottm");

yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left");

axisGroup.append("g").attr("transform","translate(0,500)").call(xAxis);

axisGroup.append("g").call(yAxis);

data = [ 0, 1 ]

var line = d3.svg.line()
    .x(function(d) { return d*10; })
    .y(function(d) { return 500-d*10; });

axisGroup
		.append("path")
		.attr("class","pathx")
		.attr("d", line(data));

yc = 1;

setInterval(function(){ 

	data[1] = yc++;

	d3.selectAll(".pathx")
		.transition()
		.duration(1000)
		.attr("d",line(data));

}, 1000);

socket.on('takethis', function(data) {
	
	console.log("Here")
	console.log(data);

});



