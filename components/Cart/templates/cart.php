<div class="sacom-cart">

	<?php if( !$cart || empty( $cart->items )) { ?>

		<h2>Your cart is empty.</h2>

	<?php } else { ?>

		<div class="sacom-cart-items">

			<table>

				<thead>

					<tr class="sacom-cart-item">

						<td>&nbsp;</td><!-- Remove button column. -->
						<td>
							<?php print $strings['product']; ?>
						</td>
						<td>
							<?php print $strings['price']; ?>
						</td>
						<td>
							<?php print $strings['quantity']; ?>
						</td>
						<td>
							<?php print $strings['subtotal']; ?>
						</td>

					</tr>

				</thead>

				<tbody>

					<?php foreach( $cart->items as $item ) { ?>

						<tr data-cart-item="<?php print $item->cartItemId; ?>">

							<!-- Remove button. -->
							<td>

								<button data-cart-item="<?php print $item->cartItemId; ?>"
									class="sacom-cart-remove">
									<?php print $strings['remove']; ?>
								</button>

							</td>

							<!-- Product or other saleable object data. -->
							<td>

								<div class="sacom-cart-item-object-data">
									<h2>
										<a href="<?php print $item->product->url; ?>">
											<?php print $item->product->title; ?>
										</a>
									</h2>
								</div>

							</td>

							<!-- Price. -->
							<td>
								<?php print '$' . $item->price; ?>
							</td>

							<!-- Quantity. -->
							<td>
								<input class="sacom-cart-quantity" type="number" value="<?php print $item->quantity; ?>" autocomplete="off" />
							</td>

							<!-- Subtotal. -->
							<td>
								<?php print '$' . number_format( $item->price * $item->quantity, 2 ); ?>
							</td>

						</tr>

					<?php } ?>

				</tbody>

			</table>

		</div>

	<?php } ?>

	<div class="sacom-cart-alerts"></div>

	<div class="sacom-cart-actions">

		<button id="sacom-cart-empty">
			<?php print $strings['empty_cart']; ?>
		</button>

		<button id="sacom-cart-checkout">
			<?php print $strings['proceed_checkout']; ?>
		</button>

	</div>

	<button id="sacom-cart-return-shop">
		<?php print $strings['return_to_shop']; ?>
	</button>

</div>
