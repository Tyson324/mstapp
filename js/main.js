$(document).ready(function(){
	$('#mainScreen').hide();
	$('#firstTimeScreen').hide();

	function signedIn(){
		if ($('#firstTime').is(':checked')) {

			$('#firstTimeScreen').easeInOutCubic( 500 );
			$('#loginScreen').hide();
		};
	}

	$('#usr').click(function(){
		var username = document.getElementById('usr');
		var password = document.getElementById('psw');
		// go to server, sign in

		signedIn();
	});
});