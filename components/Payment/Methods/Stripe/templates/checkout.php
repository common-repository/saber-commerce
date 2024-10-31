<?php ?>

<form id="payment-form" class="stripe-payment">
	<div id="card-element"><!--Stripe.js injects the Card Element--></div>
	<p id="card-error" role="alert"></p>
	<p class="result-message hidden">
		Payment succeeded, see the result in your
		<a href="" target="_blank">Stripe dashboard.</a> Refresh the page to pay again.
	</p>
</form>
