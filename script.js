//movement and controls
var stepLR = 30;
var controller;

//Environment constants
var speed = 1;
var meters = 100; //1m = 100px
var gravity = 9.81; // m/s^2

//pendulum vertical
var cx = 609, cy = 0;
var radius = 3.7; // cm
var angle = 0.9*Math.PI; // radians
var vel = 0; // m/s
var dx = 0.02; // s
var acc, vel, penx, peny;
var oldTime = 0;

//pendulum vertical
var lengthPen1 = 3.1; //m
//svg and d3.js
var sphere;
var string;
var string2;
var sphere2;

//d3 zoom
var old_k = 1;
var zoomFactor = .19;

//timing
var start;

//viewport
var height = 0;
var width = $(window).width();

//menu listeners
var gravitySlider = $('#gravity').slider()
  .on('slide', changeGravity)
  .data('slider');

var timeSlider = $('#time').slider()
  .on('slide', changeTime)
  .data('slider');

$( document ).ready(function() {
  start = (new Date()).getTime(); //start time on page load

  //menu initialization
  $("#gravity").bootstrapSlider();
  $("#friction").bootstrapSlider();
  $("#time").bootstrapSlider();

  var svg = d3.select("body")
            .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .call(d3.zoom().on("zoom", function () {
              var delta = d3.event.transform.k - old_k;
              d3.event.transform.k = old_k + zoomFactor*delta;
              $('#scale').css('width', Math.abs(old_k + zoomFactor*delta)*112);
              svg.attr("transform", d3.event.transform);
              old_k = d3.event.transform.k;
            }))
        .append("g");

            var viewport = svg.append('g')
            height = $(window).height();
            var layer1 = viewport.append('g');
            var layer2 = viewport.append('g');

            sphere = layer2.append("circle")
                         .attr("cx", 30)
                         .attr("cy", 30)
                         .attr("r", 20)
                         .attr('fill', '#FF0000');

            string = layer1.append("rect")
                          .attr("x", 27)
                          .attr("y", -2)
                          .attr("width", 6)
                          .attr("height", 12);

            //The vertical pendulum
            sphere2 = layer2.append("circle")
                         .attr("cx", 609)
                         .attr("cy", 300)
                         .attr("r", 20)
                         .attr('fill', '#FF0000');

            string2 = layer1.append("line")
                        .attr("x1", 609.5)
                        .attr("y1", -2)
                        .attr("x2", 609.5)
                        .attr("y2", 310)
                        .attr("stroke-width", 4)
                        .attr("stroke", "black");

            var roof = layer1.append("rect")
                          .attr("x", -100000)
                          .attr("y", -60)
                          .attr("height", 55)
                          .attr("width", 200000)
                          .attr('fill', 'url(#diagonal-stripe-3)');

            var border = layer1.append("rect")
                          .attr("x", -100000)
                          .attr("y", -10)
                          .attr("height", 10)
                          .attr("width", 200000)
                          .attr('fill', '#000000');

    controller = setInterval(controller, 30);  //start controller
});

function controller(){
  lengthPen1 = $('#lengthInput').val();
  radius = $('#radiusInput').val();

  //horizontal pendulum
  sphere.attr('cy', Math.sin(start-(new Date()).getTime()/(400*speed))*(lengthPen1*meters+2)+(lengthPen1*meters+32));
  string.attr('height', Math.sin(start-(new Date()).getTime()/(400*speed))*lengthPen1*meters+lengthPen1*meters+27);
  string.attr('width', Math.sin((start-(new Date()).getTime()/(400*speed))-Math.PI)*3+6);
  string.attr('x', Math.sin((start-(new Date()).getTime()/(400*speed)))*1.5-3+stepLR);
  $('#speedPen1').html(`Speed: ${parseFloat(Math.round(Math.abs(Math.sin(start-(new Date()).getTime()/(200*speed)-(Math.PI/2))*(lengthPen1*meters)+(lengthPen1*meters)))/meters).toFixed(2)} m/s`)
  $('#frequency1').html(`Frequency: ${(1/(2*Math.PI/((400*speed)))).toFixed(5)} Hz`);
  //vertical pendulum
  acc = gravity*meters * Math.cos(angle) * dx;
	vel += acc * dx;
	angle += vel * dx;
  penx = cx + radius*meters * Math.cos(angle);
  peny = cy + radius*meters * Math.sin(angle);
  string2.attr("x2", penx);
  string2.attr("y2", peny);
  sphere2.attr("cx", penx);
  sphere2.attr("cy", peny);
  $('#frequency').html(`Frequency: ${(1/(2*Math.PI*Math.sqrt(radius/9.81*meters))).toFixed(5)} Hz`);
  $('#speedPen2').html(`Speed: ${parseFloat(Math.round(Math.abs(vel/dx*3)*radius)).toFixed(2)/meters} m/s`);
  $('#speedPen2x').html(`Speed (x-direction): ${parseFloat(Math.round(Math.abs(Math.sin(angle)*vel/dx*3)*radius)).toFixed(2)/meters} 0 m/s`);
  $('#speedPen2y').html(`Speed (y-direction): ${parseFloat(Math.round(Math.abs(Math.cos(angle)*vel/dx*3)*radius)).toFixed(2)/meters} 0 m/s`);
  $('#anglePen2').html(`Angle: ${parseFloat(Math.round(angle*180/Math.PI+90)).toFixed(2)} °`);


  document.addEventListener("keydown", function (e) {
    if([e.keyCode] == 37){
      left();
    }
    if([e.keyCode] == 39){
      right();
    }
  });
}

function left(){
  stepLR=stepLR-.05;
  sphere.attr('cx', stepLR);
  string.attr('x', stepLR);
}

function right(){
  stepLR=stepLR+.05;
  sphere.attr('cx', stepLR);
  string.attr('x', stepLR);
}

function changeGravity(){
  gravity=gravitySlider.getValue();
}

function changeTime(){
  speed=timeSlider.getValue();
}
