<div class="sacom-checkout">

	<h1>Checkout</h1>

	<h3>Payment Amount $<?php print $invoice->total; ?></h3>
	<p>You are now paying invoice ID <?php print $invoice->invoiceId; ?>. Your credit card will be charged a total of $<?php print $invoice->total; ?> in USD (United States Dollars).</p>

	<?php require( SABER_COMMERCE_PATH . 'components/Payment/Methods/Stripe/templates/checkout.php' ); ?>

</div>
