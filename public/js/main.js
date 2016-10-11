/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;
var encoding = 'mp3';
var theRecording = null;
var recObj = {};
recObj.name = '';
recObj.buffer = [];
recObj.length = null;
recObj.baseColor = 'hsl(180, 100%, 50%)'
recObj.bgColor = '#fff'
var grabCanvas = document.getElementById('canvas')
var user = {};
user.uid = '';

// Slight Off-White for the Default Wave BG

/* TODO:

- offer mono option
- "Monitor input" switch
-- Upload from file support
-- Login
*/

// function saveAudio() {
//     audioRecorder.exportWAV( doneEncoding );
//     // could get mono instead by saying
//     // audioRecorder.exportMonoWAV( doneEncoding );
// }

function saveAudio() {
    audioRecorder.exportWAV( doneEncoding );
    // could get mono instead by saying
    // audioRecorder.exportMonoWAV( doneEncoding );
}

function gotBuffers( buffers ) {
  var recordingName = document.getElementById("recordingName")
  var canvas = document.getElementById( "output" );

  document.getElementById("output").innerHTML = '';
  document.getElementById("recordingName").innerHTML = '';


    // drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );


    // Creates a Recording Object for Server Storage
    theRecording = buffers[0];
    recObj.buffer = buffers[0];
    recObj.length = buffers[0].length;

    // Raw D3+SVG support.  Currently too browser intensive.
    // TODO: Move calc to serverside.  Find way to parse width, match file, and re-display
    if (theRecording.length <=150000) {
      recObj.name = prompt('Enter a name for your file')
      console.log('data length ', theRecording.length);
      d3Buffer(theRecording);
    } else {
    //
    // DRAWS THE CANVAS
      recObj.name = prompt('Enter a name for your file')
      if (recObj.name === ''){
        recObj.name = 'Your SomVista'
      }
      d3CanvasBuff(theRecording);
      recordingName.innerHTML = recObj.name
      }

    // Download Setup for Exporting the Recorded Audio File
    // if(encoding === 'mp3') {
    //   audioRecorder.exportMP3( doneEncoding );
    //  } else {
    //   audioRecorder.exportWAV( doneEncoding );
    // }
}

function doneEncoding( blob ) {
  recObj.name = prompt('Enter your filename')
  if (recObj.name === ''){
    recObj.name = 'aSoundbyte'
  }

  if(encoding === 'mp3') {
      Recorder.setupDownload( blob,  recObj.name + ".mp3" );
    } else {
      Recorder.setupDownload( blob, recObj.name + ".wav" );
    }
    recIndex++;
    console.log('blob:');
    console.log(blob);
}

function toggleRecording( e ) {
    if (e.classList.contains("recording")) {
        // stop recording
        audioRecorder.stop();
        e.classList.remove("recording");
        audioRecorder.getBuffers( gotBuffers );
    } else {
        // start recording
        if (!audioRecorder)
            return;
        e.classList.add("recording");
        audioRecorder.clear();
        audioRecorder.record();
    }
}

function convertToMono( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
}

function cancelAnalyserUpdates() {
    window.cancelAnimationFrame( rafID );
    rafID = null;
}

function updateAnalysers(time) {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }

    // analyzer draw code here
    {
        var SPACING = 5;
        var BAR_WIDTH = 4;
        var numBars = Math.round(canvasWidth / SPACING);
        var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

        analyserNode.getByteFrequencyData(freqByteData);

        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.lineCap = 'round';
        var multiplier = analyserNode.frequencyBinCount / numBars;

        // Draw rectangle for each frequency bin.
        for (var i = 0; i < numBars; ++i) {
            var magnitude = 0;
            var offset = Math.floor( i * multiplier );
            // gotta sum/average the block, or we miss narrow-bandwidth spikes
            for (var j = 0; j< multiplier; j++)
                magnitude += freqByteData[offset + j];
            magnitude = (magnitude / multiplier)*0.75;
            analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
            analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
        }
    }

    rafID = window.requestAnimationFrame( updateAnalysers );
}

function toggleMono() {
    if (audioInput != realAudioInput) {
        audioInput.disconnect();
        realAudioInput.disconnect();
        audioInput = realAudioInput;
    } else {
        realAudioInput.disconnect();
        audioInput = convertToMono( realAudioInput );
    }

    audioInput.connect(inputPoint);
}

function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
    updateAnalysers();
}

function initAudio() {
        if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!navigator.cancelAnimationFrame)
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
        if (!navigator.requestAnimationFrame)
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, function(e) {
            alert('Error getting audio');
            console.log(e);
        });
}

window.addEventListener('load', initAudio );
