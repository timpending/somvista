function updateBGColor() {
  document.getElementById('output').innerHTML = '';
  recObj.bgColor = '#' + document.getElementById('canvasColorSelector').value

  // Raw D3+SVG support.  Currently too browser intensive.
  // TODO: Move calc to serverside.  Find way to parse width, match file, and re-display
  // if (theRecording.length <=100000) {
  //   console.log('data length ', theRecording.length);
  //   d3Buffer(theRecording);
  // } else {
    console.log('data length ', theRecording.length);
    d3CanvasBuff(theRecording);
  // }
}

function updateRecName() {
  recObj.name = prompt('Enter a name for your file')
  if (recObj.name === ''){
    recObj.name = 'Your SomVista'
  }
  document.getElementById('recordingName').innerHTML = recObj.name
}
