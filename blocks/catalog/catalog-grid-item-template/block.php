<?php
/**
 * Plugin Name:       Catalog Grid Item Template
 * Description:       Renders each product in a grid using blocks included in the template.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            SaberWP
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       catalog-grid-item-template
 *
 * @package           saber-commerce
 */

function saber_commerce_catalog_grid_item_template_block_init() {
register_block_type_from_metadata( SABER_COMMERCE_PATH . 'blocks/catalog/catalog-grid-item-template/block.json',
	 array(
		 'render_callback' => 'saber_commerce_catalog_grid_item_template_block_render'
	 )
);
}
add_action( 'init', 'saber_commerce_catalog_grid_item_template_block_init' );

function saber_commerce_catalog_grid_item_template_block_render( $attributes, $content ) {

	$c = '';

	// Do query products.
	$m = new SaberCommerce\Component\Product\ProductModel;
	$products = $m->fetchAll();

	foreach( $products as $product ) {

		$GLOBALS['product'] = $product;

		$templateBlocks = parse_blocks( $content );

		// var_dump( $templateBlocks );

		foreach( $templateBlocks as $templateBlock ) {

			$c .= render_block( $templateBlock );

		}

	}

	return $c;

}
