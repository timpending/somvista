function d3Buffer (data) {
  var output = document.getElementById("output");
  output.innerHTML= '';
  output.style.background = recObj.bgColor;
  // Variables
  var svgW = 1024;
  var svgH = 500;
  var padding = 15;

  console.log('max: ', d3.max(data, function(d) {return d}));
  console.log('min: ', d3.min(data, function(d) {return d}));

  // var yScale = d3.scaleLinear()
  //             .domain([d3.min(data, function(d) { return d;}), d3.max(data, function(d) { return d;})])
  //             .range([padding, (height/2)]);

  var yScale = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return d;}), d3.max(data, function(d) { return d;})])
    .range([padding, svgH-padding]);
    // 15 - 485
  var colorScale = d3.scaleLinear()
                  .domain([d3.min(data, function(d) { return d;}), d3.max(data, function(d) { return d;})])
                  .range([0,360]);

  var svg = d3.select("#output")
    .append("svg")
    .attr('width', svgW)
    .attr('height', svgH);

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
			     return i * (svgW / data.length) })
    // Add divisor as the bar width

    .attr("y", function(d) {
      if (yScale(d) > svgH/2){
        return svgH/2-Math.abs(svgH/2-yScale(d))
      } else {
          return yScale(d)
      }
    })
    .attr("width", svgW / data.length)
    // Add divisor as the bar width

	  .attr("height", function(d, i) {
          return 2*Math.abs(svgH/2-yScale(d))
        })
	  .attr("fill", function(d) {
			return 'hsl('+Math.floor(colorScale(d))+', 100%, 50%)'});
// nodeCtx.rect(width*(i/width), yScale(d), i/width, (height - 2*yScale(d)));
}


function d3CanvasBuff(data){
  var width = 1024;
  var height = 500;
  var padding = 15;

  var output = document.getElementById("output");
  output.innerHTML = '';

  var xScale = d3.scaleLinear()
               .domain([0, data.length])
               .range([0, width]);

  var yScale = d3.scaleLinear()
              .domain([d3.min(data, function(d) { return d;}), d3.max(data, function(d) { return d;})])
              .range([padding, height-padding]);
              // height between 15,285

  var colorScale = d3.scaleLinear()
                  .domain([d3.min(data, function(d) { return d;}), d3.max(data, function(d) { return d;})])
                  .range([0,360]);

    var createCanvas = d3.select('#output').append('canvas')
        .attr('id', 'canvas')
        .attr('width', width)
        .attr('height', height)
        // .attr('style', 'background-color: '+recObj.bgColor + ';')

    var nodeCtx = createCanvas.node().getContext('2d');
    console.log(data.length);
    console.log('background color : ', recObj.bgColor);

    nodeCtx.beginPath()
    nodeCtx.rect(0,0,width, height)
    nodeCtx.fillStyle = recObj.bgColor
    nodeCtx.fill();

      data.forEach(function(d, i){
        var rectWidth = i/data.length

        function yScaleValue(d) {
          var temp = yScale(d)
          if (temp > 250) {
            return height/2-Math.abs(height/2-yScale(d))
            //500 - (50)
          } else {
            return temp
          }
        }

        function heightScaleValue(d){
          return 2*Math.abs(height/2 - yScale(d))
        }

        nodeCtx.beginPath()
        // Start TopL X, TopL Y, Width, Height,
        nodeCtx.fillStyle= 'hsl('+colorScale(d)+", 100%, 50%)"
        nodeCtx.rect(xScale(i), yScaleValue(d),
           rectWidth, heightScaleValue(d));
        // 15, height to be 470
        // nodeCtx.rect(xScale(d.length), yScale(d), xScale(d.length), yScale(d))

        // function(d) {return `rgba(${colorScale(d)},${colorScale(d)},${colorScale(d)})`}
        nodeCtx.fill()
        nodeCtx.closePath();
        // TODO:
        // - Add Step multiplier+modelus 2*i per 100,000 after the 1st 100,000
        // - Add Spacing in between in rect.  ^ Increase to +1 for Spacing
        //
        // if (i%1000000 == 0) {
        //   console.log(i);
        //   console.log('data: ', d);
        //   console.log('height: ', yScale(d));
        //   console.log('width: ', xScale(i));
        //   console.log('height ', 2*Math.abs(height/2 - yScale(d)));
        // }
      })
      // May add PDF functionality later
      // pdfDataURL = grabCanvas.toDataURL("image/jpeg", 1);
  }

// function d3Canvas(width, height, ctx, data){
//
//   // Set axis in the middle of the canvas
//   var ax = height / 2
//   var padding = 15
//   // Rects.
//   // Set an even spacing on the x-axis based on data length
//   var barWidth = width / data.length
//   var divisor = 1
//   var numBars = width / (data.length / divisor)
//
//   ctx.clearRect(0,0,width, height);
//
//   var xScale = d3.scaleLinear()
//                .domain([0, data.length])
//                .range([0, width]);
//
//   var yScale = d3.scaleLinear()
//               .domain([d3.min(data, function(d) { return d;}), d3.max(data, function(d) { return d;})])
//               .range([padding, height-padding]);
//
//
//               console.log('min: ',d3.min(data, function(d) { return d;}));
//               console.log('max: ', d3.max(data, function(d) { return d;}));
//               console.log('numBars ', numBars);
//
//     var createCanvas = d3.select('#output').append('canvas')
//         .attr('id', 'canvas')
//         .attr('width', 1024)
//         .attr('height', 500)
//
//     var nodeCtx = createCanvas.node().getContext('2d');
//
//       data.forEach(function(d, i){
//         nodeCtx.beginPath()
//         nodeCtx.rect(xScale(d), yScale(d), xScale(d), yScale(d))
//         nodeCtx.fillStyle= 'purple'
//         nodeCtx.fill()
//         nodeCtx.closePath();
//       })
// }

// DOWNLOAD THE CANVAS
// Black BG Only in PDF format
// Start of saving to pdf function.  Png might work better - JS PDF Download. Not Ideal
// document.getElementById('downloadPDF').addEventListener("click", function() {
//   var canvas = document.getElementById('canvas');
//
//   // only jpeg is supported by jsPDF
//   var imgData = canvas.toDataURL("image/jpeg", 1.0);
//   var pdf = new jsPDF('landscape');
//
//   pdf.addImage(imgData, 'JPEG', 10, 10);
//   var download = document.getElementById('download');
//
//   pdf.save(recObj.name+'.pdf');
// }, false);

// DOWNLOAD THE CURVE ONLY
$('#downloadIMG').click(function(){
     $(this).parent().attr('href', document.getElementById('canvas').toDataURL());
     $(this).parent().attr('download', recObj.name +".png");
});
//
// $('#canvas').click(function(){
//     $(this).parent().attr('href', document.getElementById('canvas').toDataURL());
//     $(this).parent().attr('download', "myPicture.png");
// });



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
