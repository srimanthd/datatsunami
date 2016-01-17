//Connectiong to socket server

width = window.innerWidth;
height = window.innerHeight;

var socket = null;
var started = false;

var socketstart = function(){
	if(!started){
	socket = io('http://192.168.59.129:4000');
	//Registering a listener
	socket.on('takethis', function(mdata) {
		if(mdata.length!=0){
			showUpdates(mdata);
		}
	});
		started = true;
	}
}

//width of height of d3tophashtags
width_d3 = document.getElementById('d3tophashtags').offsetWidth;

//Create svg and group
var svg = d3.select("#d3tophashtags").append("svg").attr("width",width_d3).attr("height",400);
var group = svg.append("g").attr("width",width_d3).attr("height",400).attr("transform","translate(50,50)").attr("id","trends");

//Create pack and force layout
var pack = d3.layout.pack().size([width_d3,250])
						.children( function(d){ return d.hashtags } )
						.value( function(d){ return d.count; });
var force = d3.layout.force().size([width_d3,250]);
var nodes = null;

//Define init function
var func = function(d) { d.px = 1000; d.py= 1000 };
var color = d3.scale.category20();

//Defining index variables
var thistime = 0;
var lasttime = 0;
var data_x= null;

//Define showUpades function
var showUpdates = function(data){

	data_x = data;
	data.count = -1;

	lasttime = thistime;
	thistime = data.hashtags.length;
	newitems = thistime - lasttime;
	
	nodes = pack.nodes(data);
//	console.log(nodes);
	circles = group.selectAll("g").data(nodes).enter().append("g");
	titles = circles.append("title").text( function(d){
			if(d.count==-1){
				return "Total hashtags";
			}
			else{
				return d.name+":"+d.count;
			}
		});
	titles = group.selectAll("title").data(nodes);
	circles.append("circle").call(force.drag);
	act_circles = group.selectAll("circle").data(nodes)

	circles = group.selectAll("g").data(nodes);

//	nodes.forEach(func);

    // for(i=(thistime-newitems);i<thistime;i++){
		// func(nodes[i]);
	// }

	force.nodes(nodes);
	force.charge(0);
	force.gravity(0);
	force.alpha(0);
	force.theta(0);
	force.on("tick", tickFunction);
	force.start();

};

//Define tickFunction
var tickFunction = function(){

	circles.each(collide(0));

	titles.text( function(d){
			if(d.count==-1){
				return "Total hashtags";
			}
			else{
				return d.name+":"+d.count;
			}
	});
	act_circles.transition().duration(100).attr("r", function(d) { return d.r; } );
	act_circles.transition().duration(100).attr("fill", function(d){ return color(d.count) } );
	circles.attr("transform", function(d) { console.log(d); return "translate("+d.x+","+(d.y)+")"; } );
};

// Resolves collisions between d and all other circles.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.r + quad.point.r;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
	  return false;
    });
  };
}