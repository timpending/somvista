var firebaseDB = firebase.database()

function showUser() {
  console.log(user);
}

function resetRecordings() {
  firebaseDB.ref('users/' + firebase.auth().currentUser.uid + '/recordings').remove();
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

function saveRec(){
  var newName = prompt(recObj.name)
  recObj.name = newName
  firebaseDB.ref('users/' + firebase.auth().currentUser.uid + '/recordings/' + recObj.name).set({
    name: recObj.name,
    recordingArray: recObj.buffer
  })
  firebaseDB.ref('users/' + firebase.auth().currentUser.uid + '/recObj/' + recObj.name).set({
    name: recObj.name,
    length: recObj.length,
    baseColor: recObj.baseColor,
    bgColor: recObj.bgColor
  })
  // TODO Save Recording Separately.  Only Call when saving, re-loading the item
  console.log('Saved in DB!');
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
