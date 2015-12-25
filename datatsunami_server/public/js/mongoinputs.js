//Defining time variables
var currenttime = new Date().getTime()/1000;
var timeperiod = currenttime + 500;

//Connectiong to socket server
var socket = io('http://192.168.59.128:4000');

//Crating svg area
svgArea = d3.select("body").append("div")
							.attr("class","container-fluid")
							.append("svg")
							.attr("width",1500)
							.attr("height",700);

//Creating group element
axisGroup = svgArea.append("g")
					.attr("class","test")
					.attr("transform","translate(150,50)");

//defining scales
colorScaler = d3.scale.category10();

max = 10;

xScale = d3.scale.linear()
					.domain([0,max])
					.range([0,1200]);

yScale = d3.scale.linear()
					.domain([500,0])
					.range([0,500]);

timescaler = d3.scale.linear()
					.domain([0,500])
					.range([0,500]);

tweetScaler = d3.scale.linear()
					.domain([0,max])
					.range([0,1200]);

//Defining axes
xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottm");

yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left");

//Calling the axes
	agX = axisGroup.append("g")
				.attr("transform","translate(0,500)")
				.call(xAxis);

	agY = axisGroup.append("g")
				.call(yAxis);

yc = 0;
axisGroup.append("text").attr("class","twt")
//Defining path generator
var trends = d3.svg.line()
						.y(function(d) {
							if(d!=0){
								yc = timeperiod-new Date().getTime()/1000;
								if(yc>0){
									return timescaler(yc);
								}
								else{
									return 0;
								}
							}
							else{
								if(d.name=='bad tweet'){
									return 500;
								}
								return 500-d;
							}
						})
						.x(function(d) {
							if(d!=0){
								if(d.count>max && d.name!='bad tweet'){
									max = d.count;
									xScale = d3.scale.linear().domain([0,max]).range([0,1200]);
									xAxis = d3.svg.axis().scale(xScale).orient("bottm");
									agX.call(xAxis);
									
									axisGroup.select(".twt")
										.attr("transform", "translate(" + xScale(d.count) + "," + timescaler(yc) + ")")
										.attr("text-anchor", "start")
										.style("fill", "red")
									.text(d.name);
								}
								if(d.name=='bad tweet'){
									return 0;
								}
								return xScale(d.count);
							}
							else{
								return d; 
							}
						});

//Defining showUpdates
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
				.transition()
				.duration(1000)
				.attr("d",function(d) {
					return trends([0,d]);
				});

}

//Registering a listener
socket.on('takethis', function(mdata) {
	showUpdates(mdata);
});