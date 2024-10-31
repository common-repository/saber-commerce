<?php get_header(); ?>

<div id="primary" class="content-area">

	<main id="main" class="site-main sacom-product-single" role="main">

		<article class="page type-page status-publish hentry entry">

			<div class="entry-content">

				<?php if( $product->mainImage ) { ?>
					<div>
						<img src="<?php print $product->mainImage->url; ?>" />
					</div>
				<?php } ?>

				<h1>
					<?php print $product->title; ?>
				</h1>

				<h4>
					<?php print '$' . number_format( $product->price, 2 ); ?>
				</h4>

				<h5>
					SKU: <?php print $product->sku; ?>
				</h5>

				<button class="sacom-cart-add" data-object-type="product" data-object-id="<?php print $product->productId; ?>">
					Add to Cart
				</button>

				<button id="sacom-cart-return-shop" class="sacom-button-secondary">
					Return to Shop
				</button>

			</div>

		</article>

	</main>

</div>

<?php get_footer(); ?>
