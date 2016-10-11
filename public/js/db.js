var firebaseDB = firebase.database()

function showUser() {
  console.log(user);
}

function writeUserToDB(currentUser){
  firebaseDB.ref('users/' + currentUser.uid).once('value').then(function(snapshot) {
  if (snapshot.val() == null){
     firebaseDB.ref('users/'+currentUser.uid).set({
       email: currentUser.email
     })
   }
 })
  user.uid = currentUser.uid
}

function saveRec(){
  var newName = prompt(recObj.name)
  recObj.name = newName
  console.log(recObj);
}
