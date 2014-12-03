$(document).ready(function(){
	$('#mainScreen').hide();
	$('#firstTimeScreen').hide();
  	$('#loginTriged').hide();
    $('.container').hide();
  	$('#loginLoading').fadeOut();
    $('.container').hide();
	Parse.initialize("KC1eJ0pORqFD9mnj6jxrFTKlHKE5Ou32d8ULgOkR", "DiSSicuCql0ZE9FH4tghrRDY5pv8CZtQMq7jBipQ");
	
	function signIn(){

    var username = $('#usr').val();
    var password = $('#psw').val();
    window.Usersname = username;
    Parse.User.logIn(username, password, {
      success: function (user) {
        //Authentication
        var Auth = Parse.Object.extend('User');
        var query = new Parse.Query(Auth);
        query.equalTo('username', Usersname);
        query.find({
          success: function (results)
          {
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              var firstTime = object.get("FirstTime")
              if (firstTime) {
              		//$('#logInForm').fadeOut( 200 );
              		//askQuestions();
                  window.location.replace("../mstapp/MinimalForm/index.html");

              }else if(!firstTime){
              		$('#logInForm').fadeOut( 200 );
              		alert("yay, you are logged in! more to come soon. Want to complain? email t-sonego@microsoft.com");
              }
                $('.userType').text("Welcome, " + Usersname);
                
              
            }
          },
          error: function (error) {
            alert('Hmm, it seems something internal has gone wrong. It is not your fault, but try again or let me know: t-sonego');
          }
        });
        //End Authentication
      },
      error: function (user, error) {
        alert('Sorry, those login details are incorrect.');
      }
    });
	}

  function askQuestions(){
    $('#start').fadeOut(200);
    $('.container').fadeIn(100);
    $('link[href="css/main.css"]').attr('href','css/component.css');
    $('link[href="css/jquery-ui.css"]').attr('href','css/demo.css');
    var theForm = document.getElementById( 'theForm' );

      new stepsForm( theForm, {
        onSubmit : function( form ) {
          // hide form
          classie.addClass( theForm.querySelector( '.simform-inner' ), 'hide' );

          /*
          form.submit()
          or
          AJAX request (maybe show loading indicator while we don't have an answer..)
          */

          // let's just simulate something...
          var messageEl = theForm.querySelector( '.final-message' );
          messageEl.innerHTML = 'Thank you! We\'ll be in touch.';
          classie.addClass( messageEl, 'show' );
        }
      } );
  }
	$('#logInSubmit').click(function(){
		signIn();
	});
  $('#logInTrigger').click(function(){

    $('#furst').fadeOut(1);
    $('#loginTriged').fadeIn( 900 );

  });

  $('#loog').submit(function(event){
  	event.preventDefault();
    signIn();
  });

});