<?php
/**
 * Plugin Name:       Product Description
 * Description:       Displays the product description.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       product-description
 *
 * @package           saber-commerce
 */

 function saber_commerce_product_description_block_init() {
 	register_block_type_from_metadata( SABER_COMMERCE_PATH . 'blocks/product/product-description/block.json',
 		array(
 			'render_callback' => 'saber_commerce_product_description_block_render'
 		)
 	);
 }
 add_action( 'init', 'saber_commerce_product_description_block_init' );

function saber_commerce_product_description_block_render( $attributes, $content ) {

	global $post;

	if( $post->post_type !== 'sacom_product' ) {

		return '<h2>Houston we have a problem this block is not in the context of a single product template.</h2>';

	}

	if( !isset( $GLOBALS['product'] ) || !$GLOBALS['product'] ) {

		// Fetch the single product.
		$m = new \SaberCommerce\Component\Product\ProductModel();
		$product = $m->fetchByPostId( $post->ID );
		$GLOBALS['product'] = $product;

	} else {

		$product = $GLOBALS['product'];

	}

	return '<div class="scm-product-description">' . $product->description . '</div>';

 }
