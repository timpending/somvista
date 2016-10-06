function drawBuffer( width, height, context, data ) {
    console.log(data);
    console.log('*******');
    console.log(data.length);
    console.log('888888888');
    var step = Math.ceil( data.length / width );
    var amp = height / 2;
    context.fillStyle = "silver";
    context.clearRect(0,0,width,height);
    console.log(step);
    for(var i=0; i < width; i++){
        var min = 1.0;
        var max = -1.0;
        for (j=0; j<step; j++) {
            var datum = data[(i*step)+j];
            // datum = array [ (1 * integer of (length/width) ) + 1 ]
            //
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        // drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
        context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
    }
}

function d3Buffer (data) {
  var output = document.getElementById("output");
  // Variables
  var svgW = 1024;
  var svgH = 500;
  var padding = 15;

  var dataset = data;

  var xScale = d3.scaleLinear()
               .domain([0, d3.max(dataset, function(d) { return d; })])
               .range([padding, svgW-padding]);

  var yScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) { return d;}), d3.max(dataset, function(d) { return d;})])
    .range([svgH-padding,padding]);

  var svg = d3.select("#output")
    .append("svg")
    .attr('width', svgW)
    .attr('height', svgH);

  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
			     return i * (svgW / Math.floor(dataset.length)) })
    .attr("y", function(d) {
          return svgH-yScale(d) })
    .attr("width", svgW / Math.floor(dataset.length))
	  .attr("height", function(d) {
	   		  return yScale(d);})
	   .attr("fill", function(d) {
			return "rgb(0, 0, " + (Math.abs(d * 55)*255) + ")";});

}
