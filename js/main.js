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
                  window.location.replace("../grabData/index.html");

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

  $('#a').click(function(){
      event.preventDefault();
    var Homework = Parse.Object.extend("UserSpecifiedInfo");
       var homework = new Homework();

       var subject = $('#q1').val();
       var studentName = $('#q2').val();
       var hlcontent = $('#q3').val();
       var subject1 = $('#q4').val();
       var studentName2 = $('#q5').val();
       var hlcontent3 = $('#q6').val();
 
        homework.set("q1", subject);
        homework.set("q2", studentName);
        homework.set("q3", hlcontent);
        homework.set("q4", subject1);
        homework.set("q5", studentName2);
        homework.set("q6", hlcontent3);
 
        homework.save(null, {
          success: function(tableobject) {
            // Execute any logic that should take place after the object is saved.
            alert('New object created with objectId: ' + tableobject.id);
            var SubjectSaveId = tableobject.id

            window.location.replace("../mstapp/DragDropInteractions/index.html"); 
          },
          error: function(tableobject, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and description.
            alert('Failed to create new object, with error code: ' + error.description);
          }
        });

  });

  $('#loog').submit(function(event){
  	event.preventDefault();
    signIn();
  });

});