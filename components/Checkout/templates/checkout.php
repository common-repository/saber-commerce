<div class="sacom-checkout">

	<div class="sacom-checkout-grid">

		<div class="sacom-checkout-form">

			<h2>
				<?php print $strings['billing_details_heading']; ?>
			</h2>

			<?php foreach( $fields as $field ) { ?>

				<?php print $field->renderMarkup(); ?>

			<?php } ?>

		</div>

		<div class="sacom-checkout-grid-col">

			<h2>
				<?php print $strings['order_summary_heading']; ?>
			</h2>

			<table>

				<thead>

					<tr>

						<td>
							<?php print $strings['cart_col_product_label']; ?>
						</td>
						<td>
							<?php print $strings['cart_col_price_label']; ?>
						</td>
						<td>
							<?php print $strings['cart_col_quantity_label']; ?>
						</td>
						<td>
							<?php print $strings['cart_col_subtotal_label']; ?>
						</td>

					</tr>

				</thead>

				<tbody>

					<?php foreach( $cart->items as $item ) { ?>

						<tr>

						<!-- Product or other saleable object data. -->
						<td>

							<div class="sacom-cart-item-object-data">
								<h3><?php print $item->product->title; ?></h3>
							</div>

						</td>

						<!-- Price. -->
						<td>
							<?php print '$' . $item->price; ?>
						</td>

						<!-- Quantity. -->
						<td>
							<?php print $item->quantity; ?>
						</td>

						<!-- Subtotal. -->
						<td>
							<?php print '$' . number_format( $item->price * $item->quantity, 2 ); ?>
						</td>

					<?php } ?>

				</tbody>

			</table><!-- End cart table. -->

			<!-- Payment Options -->
			<div class="sacom-checkout-payment-options sacom-checkout-payment-section">

				<h2><?php print $strings['payment_options_header']; ?></h2>

				<ul id="sacom-checkout-payment-method-menu">

					<?php
						foreach( $paymentMethods as $pm ) {
							if( !$pm->isEnabled() ) { continue; }
					?>

						<li
							data-payment-method-key="<?php print $pm->getKey(); ?>" 
						  data-target="#sacom-checkout-payment-pane-<?php print $pm->getKey(); ?>"
							id="sacom-checkout-payment-method-menu-item-<?php print $pm->getKey(); ?>">
							<?php print $pm->getTitle(); ?>
						</li>

					<?php } ?>

				</ul>

				<?php
					foreach( $paymentMethods as $pm ) {
						if( !$pm->isEnabled() ) { continue; }
				?>

					<div id="sacom-checkout-payment-pane-<?php print $pm->getKey(); ?>" class="sacom-checkout-payment-pane">

						<?php print $pm->title; ?>
						<?php $pm->render(); ?>
						<?php $pm->script(); ?>

					</div>

				<?php } ?>

			</div>
			<!-- End Payment Options -->

			<!-- Privacy statement. -->
			<div class="sacom-checkout-payment-section">

				<h2>Privacy Statement</h2>
				<p>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p>

				<!-- Payment button. -->
				<button class="sacom-checkout-pay-now">Pay Now</button>

				<!-- Return to cart button. -->
				<button class="sacom-checkout-return-cart">Return to Cart</button>

			</div>

		</div><!-- End order summary container. -->

	</div>


</div><!-- End checkout main container. -->
