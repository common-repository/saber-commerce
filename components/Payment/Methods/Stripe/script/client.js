function setupStripe( invoiceId ) {

	// A reference to Stripe.js initialized with your real test publishable API key.

console.log( stripePaymentData.settings );

	if( stripePaymentData.settings.stripe_mode == 1 ) {

		var stripe = Stripe( stripePaymentData.settings.stripe_test_publishable_key );

	}

	if( stripePaymentData.settings.stripe_mode == 2 ) {

		var stripe = Stripe( stripePaymentData.settings.stripe_live_publishable_key );

	}

	// Disable the button until we have Stripe set up on the page
	document.querySelector("button").disabled = true;

	var data = {
		invoices: [ invoiceId ]
	}
	wp.ajax.post( 'sacom_stripe_checkout', data ).done( function( response ) {

		var elements = stripe.elements();

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

		var card = elements.create("card", { style: style });
		card.mount("#card-element");

		card.on("change", function (event) {
			// Disable the Pay button if there are no card details in the Element
			document.querySelector("button").disabled = event.empty;
			document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
		});

		var form = document.getElementById("payment-form");

		form.addEventListener("submit", function( e ) {

			e.preventDefault();

			// Complete payment when the submit button is clicked
			payWithCard(stripe, card, response.clientSecret);

		});

	});

	// Calls stripe.confirmCardPayment
	// If the card requires authentication Stripe shows a pop-up modal to
	// prompt the user to enter authentication details without leaving your page.
	var payWithCard = function(stripe, card, clientSecret) {
	  loading(true);
	  stripe
	    .confirmCardPayment(clientSecret, {
	      payment_method: {
	        card: card
	      }
	    })
	    .then(function(result) {
	      if (result.error) {
	        // Show error to your customer
	        showError(result.error.message);
	      } else {
	        // The payment succeeded!
					console.log('order complete called...')
					console.log( result )
	        orderComplete(result.paymentIntent.id);
	      }
	    });
	};

	/* ------- UI helpers ------- */

	// Shows a success message when the payment is complete
	var orderComplete = function( paymentIntentId ) {
	  loading(false);
	  document
	    .querySelector(".result-message a")
	    .setAttribute(
	      "href",
	      "https://dashboard.stripe.com/test/payments/" + paymentIntentId
	    );
	  document.querySelector(".result-message").classList.remove("hidden");
	  document.querySelector("button").disabled = true;

		// send status change to sacom stripe payments
		var data = {
			paymentId: 25,
			status: 'completo98'
		}
		wp.ajax.post( 'sacom_stripe_status_change', data ).done( function( response ) {
			console.log( response );
		});

	};

	// Show the customer the error from Stripe if their card fails to charge
	var showError = function(errorMsgText) {
	  loading(false);
	  var errorMsg = document.querySelector("#card-error");
	  errorMsg.textContent = errorMsgText;
	  setTimeout(function() {
	    errorMsg.textContent = "";
	  }, 4000);
	};

	// Show a spinner on payment submission
	var loading = function(isLoading) {
	  if (isLoading) {
	    // Disable the button and show a spinner
	    document.querySelector("button").disabled = true;
	    document.querySelector("#spinner").classList.remove("hidden");
	    document.querySelector("#button-text").classList.add("hidden");
	  } else {
	    document.querySelector("button").disabled = false;
	    document.querySelector("#spinner").classList.add("hidden");
	    document.querySelector("#button-text").classList.remove("hidden");
	  }
	};

}
