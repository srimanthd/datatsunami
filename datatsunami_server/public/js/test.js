//Connectiong to socket server
var socket = io('http://192.168.59.129:4000');

//Create svg and group
var svg = d3.select("body").append("svg").attr("width",1300).attr("height",700);
var group = svg.append("g").attr("width",1300).attr("height",700).attr("transform","translate(50,50)");

//Create pack and force layout
var pack = d3.layout.pack().size([1250,650])
						.children( function(d){ return d.hashtags } )
						.value( function(d){ return d.count; });
var force = d3.layout.force().size([1250,650]);
var nodes = null;

//Define init function
var func = function(d) { d.px = 1000*Math.random(); d.py= 1000*Math.random() };

//Define showUpades function
var showUpdates = function(data){

	data.count = 10000;

	nodes = pack.nodes(data);
//	console.log(nodes);
	circles = group.selectAll("circle").data(nodes).enter().append("circle");

	circles = group.selectAll("circle").data(nodes);

	nodes.forEach(func);
	force.nodes(nodes);
	force.charge(0);
	force.gravity(0.05);
	force.alpha(0);
	force.theta(0);
	force.on("tick", tickFunction);
	force.start();

};

//Define tickFunction
var tickFunction = function(){
	circles.each(collide(0.5))
	circles.attr("r", function(d) { if(d.r==325){ return 1;} return d.r; } );
	circles.attr("fill", "green");
	circles.attr("cx", function(d) { return d.x; } );
	circles.attr("cy", function(d) { return d.y; } );
};

//Registering a listener
socket.on('takethis', function(mdata) {
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