//Connectiong to socket server
var socket = io('http://192.168.59.129:4000');

//Create svg and group
var svg = d3.select("body").append("svg").attr("width",1300).attr("height",1600);
var group = svg.append("g").attr("width",1300).attr("height",1600).attr("transform","translate(50,50)").attr("id","trends");

//Create pack and force layout
var pack = d3.layout.pack().size([1250,550])
						.children( function(d){ return d.hashtags } )
						.value( function(d){ return d.count; });
var force = d3.layout.force().size([1250,550]);
var nodes = null;

//Define init function
//var func = function(d) { d.px = 1000*Math.random(); d.py= 1000*Math.random() };
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
				console.log("Hi");
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

    for(i=(thistime-newitems);i<thistime;i++){
		func(nodes[i]);
	}

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
	act_circles.transition().duration(100).attr("r", function(d) { if(d.r==125){ return 0;} return d.r; } );
	act_circles.attr("fill", function(d){ return color(d.count)});
	circles.transition().duration(100).attr("transform", function(d) { return "translate("+d.x+","+(d.y+300)+")"; } );
};

//Registering a listener
socket.on('takethis', function(mdata) {
	console.log("Hi");
	showUpdates(mdata);
});


// setTimeout(function(){
	// data = { "timestamp":100, "hashtags": [ {"name":"1","count":2500},{"name":"2","count":2500} ] }
	// showUpdates(data);
// },1000);

// Resolves collisions between d and all other circles.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
//	    console.log(quad.point);
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.r + quad.point.r;
        if (l < r) {
//		  console.log(l,r);
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