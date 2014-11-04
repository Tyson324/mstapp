$(document).ready(function(){
	$('#mainScreen').hide();
	$('#firstTimeScreen').hide();
  $('#loginTriged').hide();
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
              		$('#logInForm').fadeOut( 200 );
              		alert("yay, you are logged in! more to come soon. Want to complain? email t-sonego@microsoft.com");
              }else{
              		$('#logInForm').fadeOut( 200 );
              		alert("yay, you are logged in! more to come soon. Want to complain? email t-sonego@microsoft.com");
              }
                $('.userType').text("Welcome, " + Usersname);
                
              
            }
          },
          error: function (error) {
            alert('Whoops, those login things are wrong! Please check them again.');
          }
        });
        //End Authentication
      },
      error: function (user, error) {
        alert('Whoops, those login things are wrong! Please check them again.');
      }
    });
	}


	$('#logInSubmit').click(function(){
		signIn();
	});
  $('#logInTrigger').click(function(){
    $('#furst').fadeOut(1);
    $('#loginTriged').fadeIn( 900 );
  });

});