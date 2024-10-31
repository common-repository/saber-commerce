<?php

// var_dump( $products );

?>

<!-- No products handling. -->
<?php if( empty( $products ) ) { ?>

	<div class="sacom-shop sacom-shop-empty">

		<h2 class="sacom-shop-empty-message">
			No products available to display.
		</h2>

	</div>

<?php } ?>

<!-- Has products display. -->
<?php if( !empty( $products ) ) { ?>

	<div class="sacom-shop">

		<div class="sacom-shop-grid">

			<?php foreach( $products as $product ) { ?>

				<div data-permalink="<?php print $product->permalink; ?>" class="sacom-shop-grid-item">

					<?php if( $product->mainImage ) { ?>
						<img src="<?php print $product->mainImage->url; ?>" />
					<?php } else { ?>
						<!-- Placeholder image. -->
						<img src="https://via.placeholder.com/400/400" />
					<?php } ?>

					<h2>
						<?php print $product->title; ?>
					</h2>

					<h4>
						<?php print '$' . $product->price; ?>
					</h4>

					<button class="sacom-cart-add"
						data-object-type="product"
						data-object-id="<?php print $product->productId; ?>">
						Add to Cart
					</button>

				</div>

			<?php } ?>

		</div>

	</div>

<?php } ?>
