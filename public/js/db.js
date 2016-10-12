var firebaseDB = firebase.database()

function showUser() {
  console.log(user);
}

function resetRecordings() {
  firebaseDB.ref('users/' + firebase.auth().currentUser.uid + '/recordings').remove();
  firebaseDB.ref('users/' + firebase.auth().currentUser.uid + '/recObj').remove();
  console.log('DB RESET');
}

function writeUserToDB(currentUser){
  firebaseDB.ref('users/' + currentUser.uid).once('value').then(function(snapshot) {
  if (snapshot.val() == null){
     firebaseDB.ref('users/'+currentUser.uid).set({
       email: currentUser.email
     })
   }
 })
  user.uid = firebase.auth().currentUser.uid
}

function saveRecArray(){
  firebaseDB.ref('users/' + firebase.auth().currentUser.uid + '/recordings/' + recObj.name).set({
    name: recObj.name,
    recordingArray: recObj.buffer
  })
  $('#recordingList').empty();
  console.log('Saved recording in DB!');
}

function saveRecObj(){
  var newName = prompt('Please enter a name to save in your database.  Note that duplicate files names will be overwritten with the most recent entry.', recObj.name)
  newName = recObj.name
  bg = recObj.bgColor
  // If not cancelled
  if (newName != null) {

    if (newName !== '') {
        recObj.name = newName
    }
    firebaseDB.ref('users/' + firebase.auth().currentUser.uid + '/recObj/' + recObj.name).set({
      name: newName,
      length: recObj.length,
      baseColor: recObj.baseColor,
      bgColor: bg
    })
    // TODO Save Recording Separately.  Only Call when saving, re-loading the item
    console.log(bg);
    console.log('Saved obj in DB!');
    saveRecArray();
  }
}


function listRec() {

  firebaseDB.ref('users/'+firebase.auth().currentUser.uid + '/recObj').once('value', function(snapshot){
    $('#recordingList').empty();
    snapshot.forEach(function(recObj){
      $('#recordingList').append(
        $('<button>').css('background-color', 'rgba(255, 0, 0, 0.87)')
        .attr('class', 'listedRec')
        .attr('class', 'button-gap mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent')
        .attr('id', recObj.val().name)
        .attr('onclick', 'showSavedRec(this);')
        .append(recObj.val().name)
        .append('</button>')
      )
    })
    // https://sound-2-sight.firebaseio.com/users/iFv4cCjm3yM9EyvNhs6oiX975vg2/recordings/null
    // $('#recordingList').toggle();
  })
}

function showSavedRec(el) {
  var savedRecName = el.id
  var recordingName = document.getElementById("recordingName")

  $('#output').empty()
  $('#recordingName').empty()

  firebaseDB.ref('users/'+firebase.auth().currentUser.uid +'/recordings/'+ savedRecName).once('value').then(function(snapshot){
    theRecording = snapshot.val().recordingArray;
    console.log('old bg: ', recObj.bgColor);
    recObj.buffer = theRecording
    recObj.length = theRecording.length;
    recObj.name = savedRecName
    // TODO: Check on the bg color and ensure the object gets updated before rendering the image
    $('#recordingName').text(savedRecName)

    firebaseDB.ref('users/'+firebase.auth().currentUser.uid +'/recObj/'+savedRecName).once('value').then(function(snap){
      recObj.bgColor = snap.val().bgColor
      $('#recordingList').empty();
    // DRAWS THE CANVAS
      d3CanvasBuff(theRecording);
      recordingName.innerHTML = recObj.name
    })


    // Raw D3+SVG support.  Currently too browser intensive.
    // TODO: Move calc to serverside.  Find way to parse width, match file, and re-display
    // if (theRecording.length <=150000) {
    //   d3Buffer(theRecording);
    // } else {
    //
    // Clear the list

    // }

  })
  // Hide the other listed items
  // $('#recordingList').toggle();
}
