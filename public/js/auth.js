firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    $('#login-cover').hide();

  } else {
    // No user is signed in.

    $('.page-loader').hide();

     var dialog = document.querySelector('#loginDialog');

     if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
      }

     dialog.showModal();
  }
});
