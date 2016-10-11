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

function saveRecObj(){
  var newName = prompt('Your current file name is ' + recObj.name + '. Please enter a name to save in your database.  Note that duplicate files names will be overwritten with the most recent entry.')
  if (newName !== '') {
      recObj.name = newName
  }
  firebaseDB.ref('users/' + firebase.auth().currentUser.uid + '/recObj/' + recObj.name).set({
    name: recObj.name,
    length: recObj.length,
    baseColor: recObj.baseColor,
    bgColor: recObj.bgColor
  })
  // TODO Save Recording Separately.  Only Call when saving, re-loading the item
  console.log('Saved obj in DB!');
}

function saveRec(){
  firebaseDB.ref('users/' + firebase.auth().currentUser.uid + '/recordings/' + recObj.name).set({
    name: recObj.name,
    recordingArray: recObj.buffer
  })
  console.log('Saved recording in DB!');
}

function listRec() {
  firebaseDB.ref('users/'+firebase.auth().currentUser.uid + '/recObj').once('value', function(snapshot){
    $('#recordingList').empty()
    snapshot.forEach(function(recObj){
      $('#recordingList').append(
        $('<li>').css('background-color', recObj.val().bgColor)
        .attr('class', 'listedRec')
        .attr('id', recObj.val().name)
        .attr('onclick', 'showSavedRec(this);')
        .append(recObj.val().name)
        .append('</li>')
      )
    })
  })
}

function showSavedRec(el) {
  var savedRecName = el.id
  var recordingName = document.getElementById("recordingName")

  $('#output').empty()
  $('#recordingName').empty()

  firebaseDB.ref('users/'+firebase.auth().currentUser.uid +'/recordings/'+ savedRecName).once('value', function(snapshot){
    theRecording = snapshot.val().recordingArray;

    recObj.buffer = theRecording
    recObj.length = theRecording.length;
    recObj.name = savedRecName
    // TODO: Check on the bg color and ensure the object gets updated before rendering the image
    $('#recordingName').text(savedRecName)
    firebaseDB.ref('users/'+firebase.auth().currentUser.uid +'/recObj/'+savedRecName).once('value', function(snap){
      recObj.bgColor = snap.val().bgColor
    })

    // Raw D3+SVG support.  Currently too browser intensive.
    // TODO: Move calc to serverside.  Find way to parse width, match file, and re-display
    if (theRecording.length <=150000) {
      d3Buffer(theRecording);
    } else {
    //
    // DRAWS THE CANVAS
      d3CanvasBuff(theRecording);
      recordingName.innerHTML = recObj.name
    }

  })
}
