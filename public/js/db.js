var firebaseDB = firebase.database().ref()

//
// function saveToDB() {
//   var mainText = document.getElementById('mainText')
//   var human = document.getElementById('human')
//   var mainButton = document.getElementById('mainButton')
//   var msg = mainText.value
//   var human = human.value
//   firebaseDB.child(human).set(msg)
// }
//
// function getTitle() {
//   var newTitle = firebase.database().ref().child("Title")
//   var title = document.getElementById('theTitle')
//
//
//   newTitle.on('value', function(snapshot){
//     var temp = snapshot.val();
//     title.innerHTML = temp
  // })
  // newTitle.once('value').then(function(snapshot){
  //   var temp = snapshot.val();
  //   title.innerHTML = temp
  // })
// }
// newTitle.on('value', function(snapshot){
//   title.innerHTML = 'hello'
// })
