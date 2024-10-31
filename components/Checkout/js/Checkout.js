class SACOM_Checkout {

	constructor() {


		this.paymentMethod = false;

	}

	init() {

		this.cartReturnButton();
		this.paymentMethodChoice();
		this.process();

		// Open the first payment method option.
		const defaultPaymentMethodEl = jQuery( '#sacom-checkout-payment-method-menu li:first' );
		defaultPaymentMethodEl.click();

		this.paymentMethod = defaultPaymentMethodEl.attr( 'data-payment-method-key' );

	}

	cartReturnButton() {

		jQuery( document ).on( 'click', '.sacom-checkout-return-cart', function() {

			window.location = sacomData.cartUrl;

		});

	}

	parse() {

		var formData = {

			first_name: jQuery( '#field_first_name' ).val(),
			last_name: jQuery( '#field_last_name' ).val(),
			company_name: jQuery( '#field_company_name' ).val(),
			country: jQuery( '#field_country' ).val(),
			street_address_1: jQuery( '#field_street_address_1' ).val(),
			street_address_2: jQuery( '#field_street_address_2' ).val(),
			city: jQuery( '#field_city' ).val(),
			zip_postal: jQuery( '#field_zip_postal' ).val(),
			phone: jQuery( '#field_phone' ).val(),
			email: jQuery( '#field_email' ).val(),
			order_notes: jQuery( '#field_order_notes' ).val()

		}

		return formData;

	}

	process() {

		jQuery( '.sacom-checkout-pay-now' ).on( 'click', function() {

			console.log( checkout.paymentMethod )

			// Parse the checkout form data.
			let formData = checkout.parse();

			// Run JS validation routine.
			const validationResult = checkout.validate( formData );

			console.log( validationResult )

			// Get user cart id.
			let cartId = cart.getCartId();

			// Send request to process checkout.
			let data = {
				formData: formData,
				cartId: cartId
			}

			wp.ajax.post( 'sacom_checkout_process', data ).done( function( response ) {

				checkout.responseHandler( response );

			});

		});

	}

	responseHandler( response ) {

		// If response successful here we have an order created.
		// Next we process the payment for the order.
		if( response.order.orderId >= 1 ) {

			if( this.paymentMethod === 'stripe' ) {

				console.log( sacomStripeClient.clientSecret );
				sacomStripeClient.payWithCard( sacomStripeClient.stripe, sacomStripeClient.card, sacomStripeClient.clientSecret );

			}

		}

		// this.showThanks( response );

	}

	validate() {

		const result = {}
		const errors = [];

		if( errors.length === 0 ) {

			result.valid = true;

		}

		return result;

	}

	showThanks( response ) {

		// Clear UX.
		jQuery( '.sacom-checkout' ).html('');

		var msg = '<h2>Thank you for your order!</h2>';
		msg += '<p>Your order was placed successfully. You should receive an order confirmation via email soon.</p>';
		jQuery( '.sacom-checkout' ).html( msg );

	}

	paymentMethodChoice() {

		jQuery( document ).on( 'click', '#sacom-checkout-payment-method-menu li', function() {

			const el = jQuery( this );
			const target = el.attr( 'data-target' );
			checkout.paymentMethod = el.attr( 'data-method-key' );

			jQuery( '#sacom-checkout-payment-method-menu li' ).removeClass( 'active' );
			el.addClass( 'active' );

			jQuery( '.sacom-checkout-payment-pane' ).hide();
			jQuery( target ).show();

		});

	}

}

var checkout = new SACOM_Checkout();
checkout.init();
