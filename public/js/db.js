var mainText = document.getElementById('mainText')
var mainButton = document.getElementById('mainButton')
var firebaseDB = firebase.database().ref()


function saveToDB() {
  firebaseDB.child("TEST").set('First Values')
}
