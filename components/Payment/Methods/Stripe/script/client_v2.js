class SACOM_StripeClient {

	constructor() {}

	init() {

		console.log( 'init SACOM_StripeClient' );
		console.log( this.fetchClientSecret )
		this.fetchClientSecret();
		this.stripeSetup();
		this.stripeElements();

	}

	fetchClientSecret() {

		console.log( 'fetchClientSecret running....')

		var data = {}
		wp.ajax.post( 'sacom_stripe_checkout_intent', data ).done( function( response ) {

			console.log( 'fetchClientSecret running....')
			sacomStripeClient.clientSecret = response.clientSecret;

		});

	}

	// Calls stripe.confirmCardPayment
	// If the card requires authentication Stripe shows a pop-up modal to
	// prompt the user to enter authentication details without leaving your page.
	payWithCard( stripe, card, clientSecret ) {

		this.loading( true );

		this.stripe
			.confirmCardPayment(clientSecret, {
				payment_method: {
					card: card
				}
			})
			.then( function( result ) {

				if ( result.error ) {

					// Show error to your customer
					sacomStripeClient.showError( result.error.message );

				} else {

					// The payment succeeded!
					sacomStripeClient.orderComplete( result.paymentIntent.id );

				}
			});

	}

	stripeElements() {

		this.elements = this.stripe.elements();

		var style = {
			base: {
				color: "#32325d",
				fontFamily: 'Arial, sans-serif',
				fontSmoothing: "antialiased",
				fontSize: "16px",
				"::placeholder": {
					color: "#32325d"
				}
			},
			invalid: {
				fontFamily: 'Arial, sans-serif',
				color: "#fa755a",
				iconColor: "#fa755a"
			}
		};

		this.card = this.elements.create( 'card', { style: style });
		this.card.mount( '#card-element' );

	}

	stripeSetup() {

		// Set Stripe mode based on the settings for the site.
		this.stripeMode = stripePaymentData.settings.stripe_mode;

		// Init Stripe API client.

		if( stripePaymentData.settings.stripe_mode == 1 ) {

			this.stripe = Stripe( stripePaymentData.settings.stripe_test_publishable_key );

		}

		if( stripePaymentData.settings.stripe_mode == 2 ) {

			this.stripe = Stripe( stripePaymentData.settings.stripe_live_publishable_key );

		}


	}

	loading( isLoading ) {

	  if (isLoading) {

	    // Disable the button and show a spinner
			// document.querySelector("#spinner").classList.remove("hidden");

		} else {

			//document.querySelector("button").disabled = false;
			//document.querySelector("#spinner").classList.add("hidden");
			//document.querySelector("#button-text").classList.remove("hidden");

		}

	}

	showError( error ) {

		console.log( error )

	}

	orderComplete() {

		console.log('orderComplete running...')

	}


}
