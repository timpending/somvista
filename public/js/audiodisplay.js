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
