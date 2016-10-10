firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    $('.login-cover').hide();
    $('#pageLoader').show();

     var dialog = document.querySelector('#loginDialog');

     if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
      }

     dialog.close();


  } else {
    // No user is signed in.
    $('.login-cover').show();
    $('#page-loader').hide();

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

  if (email != '' && pw != ''){

    $('#loginLoader').show()
    $('#loginButton').hide()

    firebase.auth().signInWithEmailAndPassword(email, pw).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      $('#loginError').show().text(errorMessage)
      $('#loginLoader').hide()
      $('#loginButton').show()
    });

  } else {

  }

})
