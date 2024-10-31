<?php
/**
 * Plugin Name:       Product Image
 * Description:       Displays the current product image or a fallback placeholder if no image is available.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            saberwp
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       product-image
 *
 * @package           saber-commerce
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function saber_commerce_product_image_block_init() {
	register_block_type_from_metadata( SABER_COMMERCE_PATH . 'blocks/product/product-image/block.json',
		array(
			'render_callback' => 'saber_commerce_product_image_block_render'
		)
	);
}
add_action( 'init', 'saber_commerce_product_image_block_init' );

function saber_commerce_product_image_block_render() {

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

	// @TODO render appropriate size from size array.
	//var_dump( $product->mainImage );

	return '<img src="' . $product->mainImage->url . '" />';

}
