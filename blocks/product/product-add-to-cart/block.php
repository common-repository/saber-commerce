<?php
/**
 * Plugin Name:       Add to Cart
 * Description:       Renders a functional add product to cart button with quantity adjustment functionality.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Saber Commerce
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       add-to-cart
 *
 * @package           saber-commerce
 */

function saber_commerce_add_to_cart_block_init() {
	register_block_type_from_metadata( SABER_COMMERCE_PATH . 'blocks/product/product-add-to-cart/block.json',
		array(
			'render_callback' => 'saber_commerce_add_to_cart_block_render'
		)
	);
}
add_action( 'init', 'saber_commerce_add_to_cart_block_init' );

function saber_commerce_add_to_cart_block_render( $attributes, $content ) {

	global $post;

	if( $post->post_type !== 'sacom_product' ) {

		return '<h2>Houston we have a problem this block is not in the context of a single product template.</h2>';

	}

	if( !$GLOBALS['product'] ) {

		// Fetch the single product.
		$productId = get_post_meta( $post->ID, 'sacom_data_id', 1 );
		$m = new \SaberCommerce\Component\Product\ProductModel();
		$product = $m->fetchOne( $productId );
		$GLOBALS['product'] = $product;

	} else {

		$product = $GLOBALS['product'];

	}

	// @TODO add classes.
	return $content;

}
