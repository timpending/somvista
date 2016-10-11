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
    snapshot.forEach(function(recObj){
      $('#recordingList').append(
        $('<li>').css('background-color', recObj.val().bgColor)
        .append(recObj.val().name))
    })
  })
  // $('#listRecordings').append(li)
}
