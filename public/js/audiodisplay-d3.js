function drawBuffer( width, height, context, data ) {
    console.log(data);
    console.log('*******');
    console.log(data.length);
    console.log('888888888');
    var step = Math.ceil( data.length / width );
    var amp = height / 2;
    context.fillStyle = "silver";
    // clearReact Erases what is show in display
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

  console.log('max: ', d3.max(dataset, function(d) {return d}));
  console.log('min: ', d3.min(dataset, function(d) {return d}));

  // var yScale = d3.scaleLinear()
  //             .domain([d3.min(data, function(d) { return d;}), d3.max(data, function(d) { return d;})])
  //             .range([padding, (height/2)]);

  var xScale = d3.scaleLinear()
               .domain([0, d3.max(dataset, function(d) { return d; })])
               .range([padding, svgW-padding]);

  var yScale = d3.scaleLinear()
    .domain([d3.min(dataset, function(d) { return d;}), d3.max(dataset, function(d) { return d;})])
    .range([padding, svgH-padding]);
    // 15 - 485
  var colorScale = d3.scaleLinear()
                  .domain([d3.min(dataset, function(d) { return d;}), d3.max(dataset, function(d) { return d;})])
                  .range([0,360]);

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
    // Add divisor as the bar width

    .attr("y", function(d) {
      if (yScale(d) > svgH/2){
        return svgH/2-Math.abs(svgH/2-yScale(d))
      } else {
          return yScale(d)
      }
    })
    .attr("width", svgW / Math.floor(dataset.length))
    // Add divisor as the bar width

	  .attr("height", function(d, i) {
          return 2*Math.abs(svgH/2-yScale(d))
        })
	  .attr("fill", function(d) {
			return 'hsl('+Math.floor(colorScale(d))+', 100%, 50%)'});
// nodeCtx.rect(width*(i/width), yScale(d), i/width, (height - 2*yScale(d)));
}

function d3Canvas(width, height, ctx, data){
  // Set axis in the middle of the canvas
  var ax = height / 2
  var padding = height*0.05
  // Rects.
  // Set an even spacing on the x-axis based on data length
  var barWidth = width / data.length
  var divisor = 1
  var numBars = width / (data.length / divisor)

  ctx.clearRect(0,0,width, height);

  var xScale = d3.scaleLinear()
               .domain([0, data.length])
               .range([0, width]);

  var yScale = d3.scaleLinear()
              .domain([d3.min(data, function(d) { return d;}), d3.max(data, function(d) { return d;})])
              .range([padding, height-padding]);


              console.log('min: ',d3.min(data, function(d) { return d;}));
              console.log('max: ', d3.max(data, function(d) { return d;}));
              console.log('numBars ', numBars);

    var createCanvas = d3.select('#output').append('canvas')
        .attr('id', 'canvas')
        .attr('width', 1024)
        .attr('height', 500)

    var nodeCtx = createCanvas.node().getContext('2d');

      data.forEach(function(d, i){
        nodeCtx.beginPath()
        nodeCtx.rect(xScale(d), yScale(d), xScale(d), yScale(d))
        nodeCtx.fillStyle= 'purple'
        nodeCtx.fill()
        nodeCtx.closePath();
      })
}

// Start of saving to pdf function.  Png might work better
function downloadPDF() {
  // var imgData = grabCanvas.toDataURL("image/jpeg", 1.0);
  var pdf = new jsPDF();

  pdf.addImage(pdfDataURL, 'JPEG', 0, 0);
  var download = document.getElementById('downloadPDF');

  pdf.save("download.pdf");
  }
//   , false);
// }

  // ctx.fillStyle = "red";
  // ctx (startX, endX, startY, endY)
  // for(i=0; i<data.length; i++){
  //   ctx.fillRect(i*barWidth, ax-padding*(data[i]*100), i*(2*barWidth), height-(2*padding*data[i]*100));
  //   if (i%1000 == 0) {
  //     console.log('LENGTH ', data.length);
  //     console.log('x pos: ', i*barWidth);
  //     console.log('next pos ', i*(2*barWidth));
  //   }
  // }
  //
  //
// {
//     var SPACING = 3;
//     var BAR_WIDTH = 1;
//     var numBars = Math.round(canvasWidth / SPACING);
//     var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
//
//     analyserNode.getByteFrequencyData(freqByteData);
//
//     analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
//     analyserContext.lineCap = 'round';
//     var multiplier = analyserNode.frequencyBinCount / numBars;
//
//     // Draw rectangle for each frequency bin.
//     for (var i = 0; i < numBars; ++i) {
//         var magnitude = 0;
//         var offset = Math.floor( i * multiplier );
//         // gotta sum/average the block, or we miss narrow-bandwidth spikes
//         for (var j = 0; j< multiplier; j++)
//             magnitude += freqByteData[offset + j];
//         magnitude = magnitude / multiplier;
//         var magnitude2 = freqByteData[i * multiplier];
//         analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
//         analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
//     }
// }


function d3CanvasBuff(data){
  // ctx.clearRect(0,0,width, height);

  var width = 1024;
  var height = 500;
  var padding = 15;
  var grabCanvas = document.getElementById('canvas');

  var xScale = d3.scaleLinear()
               .domain([0, data.length])
               .range([0, width]);

  var yScale = d3.scaleLinear()
              .domain([d3.min(data, function(d) { return d;}), d3.max(data, function(d) { return d;})])
              .range([padding, (height/2)]);
              // height between 15,250

  var colorScale = d3.scaleLinear()
                  .domain([d3.min(data, function(d) { return d;}), d3.max(data, function(d) { return d;})])
                  .range([0, 255]);

    var createCanvas = d3.select('#output').append('canvas')
        .attr('id', 'canvas')
        .attr('width', width)
        .attr('height', height)

    var nodeCtx = createCanvas.node().getContext('2d');
    console.log(data);
      data.forEach(function(d, i){
        nodeCtx.beginPath()
        // Start TopL X, TopL Y, Width, Height,
        nodeCtx.fillStyle= 'green'
        nodeCtx.rect(width*(i/width), yScale(d), i/width, (height - 2*yScale(d)));
        // 15, height to be 470
        // nodeCtx.rect(xScale(d.length), yScale(d), xScale(d.length), yScale(d))

        // function(d) {return `rgba(${colorScale(d)},${colorScale(d)},${colorScale(d)})`}
        nodeCtx.fill()
        nodeCtx.closePath();
        if (i%5000 == 0) {
          console.log(i);
          console.log('data: ', d);
          console.log('height: ', yScale(d));
          console.log('width: ', xScale(i));
          console.log('i/width', i/width);
          console.log('colorValue', colorScale(d));
        }
      })
      // May add PDF functionality later
      // pdfDataURL = grabCanvas.toDataURL("image/jpeg", 1);
  }
