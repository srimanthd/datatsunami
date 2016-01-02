//Defining time variables
var currenttime = new Date().getTime()/1000;
var timeperiod = currenttime + 500;

//Connectiong to socket server
var socket = io('http://192.168.59.129:4000');

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

xScale = d3.scale.linear()
					.domain([0,max])
					.range([0,200]);

yScale = d3.scale.linear()
					.domain([500,0])
					.range([0,500]);

var max = 10
var dyRad = function(d){
		if(d.count>max && d.name!='bad tweet'){
			max = d.count;
			xScale = d3.scale.linear().domain([0,max]).range([0,200]);
		}
		
		return max/50;
}

//Defining showUpdates
showUpdates = function(mdata){

	axisGroup.selectAll("circle")
				.data(mdata.hashtags)
				.enter()
				.append("circle")
				.attr("r", function(d){
					return dyRad(d);
				})
				.attr("fill", "green")
				.attr("cx", 300)
				.attr("cy", 300);
	
		axisGroup.selectAll("circle")
				.data(mdata.hashtags)
				.transition()
				.duration(1000)
				.attr("r", function(d){
					return dyRad(d);
				})
				.attr("fill", "green")
				.attr("cx", 300)
				.attr("cy", 300);

}

//Sorting the data
sortData = function(){
	
}
var tweets = {}
//Registering a listener
socket.on('takethis', function(mdata) {
	showUpdates(mdata);
	tweets = mdata;
});
