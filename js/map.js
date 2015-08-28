//Set dimensions for our map

var settings = {
  width: 800,
  height: 500,
  period: "M07"
}

var map = {
  svg: d3.select("#map").append("svg")
    .attr("width", settings.width)
    .attr("height", settings.height),
};

var key = {
  data: [
  {rate: '2%', val: 2},
  {rate: '3%', val: 3},
  {rate: '4%', val: 4},
  {rate: '5%', val: 5},
  {rate: '6%', val: 6},
  {rate: '7%', val: 7},
  {rate: '8%', val: 8},
  {rate: '9%', val: 9},
  {rate: '10%', val: 10},
  {rate: '11%', val: 11},
  {rate: '12%', val: 12}
  ], 
  group: 
    d3.select('#key').append('svg')
    .attr('width', '80%')
    .attr('height', 35)
    .attr('float', 'right')
    .append('g'),
  width: settings.width*.25,
  height: 30,
};

//interpolate the red and blue colors to build our scale
var blue = d3.interpolate({color: "#11368C"}, {color: "white"});
var red = d3.interpolate({color: "#E14C4C"}, {color: "white"});
//Scale the geo-data to fit within our dimensions
var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([settings.width / 2, settings.height / 2]);

//d3.geo sets the path of state boundaries based on the projection set above
var path = d3.geo.path()
    .projection(projection);

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

d3.json("data/states.json", function(error, us, cb) {
  if (error) return console.error(error);
  map.svg.selectAll(".subunit")
    .data(topojson.feature(us, us.objects.states).features)
  .enter().append("path")
    .attr('class', 'subunit')
    .attr("id", function(d) { return "s"+d.properties.STATE; })
    .attr("d", path);
});


function drawMap(year) {
yearAvg(year);

//Sort through data by year, return average of monthly rates for annual rate
function yearAvg(year) {
  var curYear = year;
  var yearD = [];
    d3.json("data/unemployment.json", function(error, d) {
      if (error) return console.error(error);
       
      d3.values(d).map(function(num){
        sortStates(num.state_name, num.state_id, num.year, num.value);
      });
      
      function sortStates(state,id, year, val, cb) {
        var curVal = yearD[yearD.length - 1];
        if (curVal && (curVal.state == state) && (curVal.year == year)){
          curVal.rates.push(val);
        } else {
          var newObj = {};
          newObj.state = state;
          newObj.ID = "s"+id;
          newObj.year = year;
          newObj.rates = [];
          newObj.rates.push(val);
          yearD.push(newObj);
        }
           
      if (curVal && (curVal.rates.length == 12) && (curVal.year == curYear))  {

          var i;
          var sum=0;
          for (i=0; i <curVal.rates.length; i++){
            sum += curVal.rates[i];
            curVal.avg = (sum/curVal.rates.length).toFixed(2);
          }
          fillData(curVal);
        }
      }
    });
    return yearD;
  }
  //load up data and fill in states
  function fillData(state) {

    var tooltipTxt = '<strong>'+state.state+'</strong>'+': '+state.avg+'%';
    map.svg.select('#'+state.ID)
      .on("mouseover", function(d){return tooltip.style("visibility", "visible").html(function(d){return tooltipTxt;});})
      .on("mousemove", function(){return tooltip.style("top",
      (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
      .transition()
      .style('fill', colorSet(state.avg))
      .duration(200);        
  }

//draw the key color boxes in the bottom right  
  key.group.selectAll('rect')
    .data(key.data)
    .enter()
    .append('rect')
    .attr('x', function(d) {return (d.val*30)+250;})
    .attr('y', '15%')
    .attr('width', '30')
    .attr('height', '30')
    .style('fill', function(d) { return colorSet(d.val);});
//draw the text inside the key boxes in the bottom right
  key.group.selectAll('text')
    .data(key.data)
    .enter().append('text')
    .attr('x', function(d) {return (d.val*30+10)+250;})
    .attr('y', '75%')
    .style('color', 'black')
    .text(function(d) {return d.val});

//used to set the color based on the rate
  function colorSet(rate){
    if (rate <= 5.5) {
      var x = rate/6;
      var y = blue(x);
    } else {
      var x = 11/rate -1;
      var y = red(x);
    } 
    return y.color;
  }
}



