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
  if (recObj.length !== null){

  //TODO: Swap these prompts into Dialog
  recObj.name = prompt('Enter a name for your file')
  if (recObj.name === ''){
    recObj.name = 'Your SomVista'
  }
  document.getElementById('recordingName').innerHTML = recObj.name
  } else {
    alert('You need to record first!')
  }
}

function deleteRec() {
  if (recObj.length !== null){
    var ask = confirm('Are you sure you want to delete your SomVista-piece?')
    if (ask == true){

      recObj.name = '';
      recObj.buffer = [];
      recObj.length = null;
      recObj.baseColor = 'hsl(180, 100%, 50%)'
      recObj.bgColor = '#fff'
      document.getElementById('recordingName').innerHTML = '';
      document.getElementById('output').innerHTML = '';
    }
  }

}
