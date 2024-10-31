(function($) {

	$('#sacom_login_form').submit( function( e ) {

		e.preventDefault();
		var data = {}
		data.values = {}
		data.values.username = $('#field-username').val();
		data.values.password = $('#field-password').val();

		wp.ajax.post('sacom_login_form_process', data).done( function( response ) {

			/* redirect user to dashboard */
			if( response.code == 200 ) {

				window.location = "http://ebp.dev.cc/dashboard/";

			}

		});

	});





})( jQuery );
