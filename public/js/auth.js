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
})
