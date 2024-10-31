class Invoice {

	index() {



	}

	view( invoiceId ) {

		var data = {
			invoice: invoiceId
		}
		
		wp.ajax.post( 'sacom_portal_invoice_load', data ).done( function( response ) {

			let template = jQuery( response.template );
			jQuery( '#portal-canvas' ).html( template );

		});

	}

	pay( invoiceId ) {

		console.log('pay action...')

		var data = {
			invoice: invoiceId
		}

		wp.ajax.post( 'sacom_portal_checkout_load', data ).done( function( response ) {

			console.log( response );

			let template = jQuery( response.template );
			jQuery( '#portal-canvas' ).html( template );

			setupStripe( response.invoice.invoiceId );

		});

	}


}
