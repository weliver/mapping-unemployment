var d3Map = {
  
  svgWidth: 800,
  svgHeight: 500,
  period: "M07",

  
  map: d3.select("#map").append("svg")
      .attr("width", 800)
      .attr("height", 500),

  key: {
    dataSet: [
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
    data: function() {
      return this.dataSet
    },
    group: 
      d3.select('#key').append('svg')
      .attr('width', '80%')
      .attr('height', 35)
      .attr('float', 'right')
      .append('g'),
    width: function() {
      return d3Map.svgWidth*.4
    },
    height: 30,
    cellWidth: function() {
      var d = this.data();
      return this.width()/d.length;
    },
    xPos: function(val) {
      var d = this.data()
      var w = d3Map.svgWidth - this.width();
      var a = (-1) * (this.cellWidth() * (d.indexOf(val)+1));
      var f = w-a-this.width();
      if (f) {
        return f;
      }
    }
  },

  //interpolate the red and blue colors to build our scale
  blue: d3.interpolate({color: "#11368C"}, {color: "white"}),
  red: d3.interpolate({color: "#E14C4C"}, {color: "white"}),
  //Scale the geo-data to fit within our dimensions
  // projection: d3.geo.albersUsa()
  //     .scale(1000)
  //     .translate([800 / 2, 500 / 2]),

  //d3.geo sets the path of state boundaries based on the projection set above
  path: d3.geo.path()
      .projection(
        d3.geo.albersUsa()
          .scale(1000)
          .translate([800/2, 500/2])
        ),

  tooltip: d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden"),

  usMap: d3.json("data/states.json", function(error, us, cb) {
    if (error) return console.error(error);
    d3Map.map.selectAll(".subunit")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr('class', 'subunit')
      .attr("id", function(d) { return "s"+d.properties.STATE; })
      .attr("d", d3Map.path);
  }),


  drawMap: function(year) {
  yearAvg(year);

  //Sort through data by year, return average of monthly rates for annual rate
  function yearAvg(year) {

    var curYear = d3Map.year;
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
      d3Map.map.select('#'+state.ID)
        .on("mouseover", function(d){return d3Map.tooltip.style("visibility", "visible").html(function(d){return tooltipTxt;});})
        .on("mousemove", function(){return d3Map.tooltip.style("top",
        (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return d3Map.tooltip.style("visibility", "hidden");})
        .transition()
        .style('fill', colorSet(state.avg))
        .duration(200);        
    }

  //draw the key color boxes in the bottom right
    var keyData = d3Map.key.data();  
    d3Map.key.group.selectAll('rect')
      .data(keyData)
      .enter()
      .append('rect')
      .attr('x', function(d) {return (d3Map.key.xPos(d));})
      .attr('y', '15%')
      .attr('width', function() {return d3Map.key.cellWidth();})
      .attr('height', '30')
      .style('fill', function(d) { return colorSet(d.val);});
  //draw the text inside the key boxes in the bottom right
    d3Map.key.group.selectAll('text')
      .data(keyData)
      .enter().append('text')
      .attr('x', function(d) {return d3Map.key.xPos(d)+10;})
      .attr('y', '75%')
      .style('color', 'black')
      .text(function(d) {return d.val});

  //used to set the color based on the rate
    function colorSet(rate){
      if (rate <= 5.5) {
        var x = rate/6;
        var y = d3Map.blue(x);
      } else {
        var x = 11/rate -1;
        var y = d3Map.red(x);
      } 
      return y.color;
    }
  }
}