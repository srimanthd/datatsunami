currenttime = new Date().getTime()/1000;
timeafter = currenttime + 50;

var socket = io('http://192.168.59.128:4000');

svgArea = d3.select("body").append("div")
							.attr("class","container-fluid")
							.append("svg").attr("width",1500).attr("height",700);

axisGroup = svgArea.append("g").attr("class","test").attr("transform","translate(150,50)");

colorScaler = d3.scale.category10();

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

time = 1;

var trends = d3.svg.line()
    .y(function(d) { 
			if(d!=0){ 
				diggle = 10*(timeafter-new Date().getTime()/1000);
				console.log(diggle);
				return diggle;
			}
			else{ return 500-d; }})
    .x(function(d) { 
			if(d!=0){ 
				// if(d.count>5){
					 // axisGroup.append("text")
					// .attr("transform", "translate(" + (d.count) + "," + 300 + ")")
					// .attr("text-anchor", "start")
					// .style("fill", "red")
					// .text(d.name);

				// }
				if(d.count<=1300) {return d.count;} else { console.log(d.count); return 1200;}
			}
			else{ return d; }});

showUpdates = function(mdata){

	axisGroup.selectAll(".hashtag")
		.data(mdata.hashtags)
		.enter()
		.append('path')
		.attr('class','hashtag')
		.attr("d",function(d) {
			return trends([0,d]);
		})
		.attr("stroke", function(d){
			return colorScaler(d.count);
		});
	
	axisGroup.selectAll(".hashtag")
		.data(mdata.hashtags)
		.attr("d",function(d) {
			return trends([0,d]);
		});

}

socket.on('takethis', function(mdata) {
	
	showUpdates(mdata);	
	
});











