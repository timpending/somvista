// LOGIN
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    $('.login-cover').hide();
    var dialog = document.querySelector('#loginDialog');

     if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
      }

     dialog.close();

     writeUserToDB(firebase.auth().currentUser);
     user.uid = firebase.auth().currentUser.uid

  } else {
    // No user is signed in.
    $('.login-cover').show();
     var dialog = document.querySelector('#loginDialog');

     if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
      }

     dialog.showModal();
  }
});

$('#loginButton').click(function(){
  var email = $('#loginEmail').val();
  var pw = $('#loginPassword').val();

    firebase.auth().signInWithEmailAndPassword(email, pw).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      $('#loginError').show().text(errorMessage)
      $('#loginLoader').hide()
      $('#loginButton').show()
    })
})

// LOGOUT
$('#signOutButton').click(function(){
  resetRecAndUserObjs()
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  $('#loginError').hide().text('');
  $('#loginEmail').val('');
  $('#loginPassword').val('');
  $('#loginLoader').hide();
  $('.login-cover').show();
  $('#loginButton').show();
  }, function(error) {
    // An error happened.
    alert(error.message)
  })
})

$('#drawerSignOut').click(function(){
  resetRecAndUserObjs()
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  $('.mdl-layout__drawer').hide()
  $('#loginError').hide().text('');
  $('#loginEmail').val('');
  $('#loginPassword').val('');
  $('#loginLoader').hide();
  $('.login-cover').show();
  $('#loginButton').show();
  }, function(error) {
    // An error happened.
    alert(error.message)
  });
})


// REGISTER
$('#registerButton').click(function(){
  var email = $('#loginEmail').val();
  var pw = $('#loginPassword').val();

  firebase.auth().createUserWithEmailAndPassword(email, pw).catch(function(error){

  var errorCode = error.code;
  var errorMessage = error.message;

  $('#loginError').show().text(errorMessage)
  $('#loginLoader').hide()
  $('#loginButton').show()

  })
  // createUserObj(firebase.auth().currentUser);
  setTimeout(writeUserToDB(firebase.auth().currentUser), 500);
})

// User Object Creation
function createUserObj(currentUser) {
  user.uid = currentUser.uid
}

function resetRecAndUserObjs() {
  // Destroy User Constructor Object
  user = {};
  user.uid = '';

  // Destroy Recording Object
  theRecording = null;
  recObj = {};
  recObj.name = '';
  recObj.buffer = [];
  recObj.length = null;
  recObj.baseColor = 'hsl(180, 100%, 50%)'
  recObj.bgColor = '#fff'
}
