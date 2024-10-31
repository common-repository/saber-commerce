<?php
/**
 * Plugin Name:       Catalog Grid
 * Description:       Catalog grid displays a grid of products.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       catalog-grid
 *
 * @package           saber-commerce
 */

 function saber_commerce_catalog_grid_block_init() {
 	register_block_type_from_metadata( SABER_COMMERCE_PATH . 'blocks/catalog/catalog-grid/block.json',
 		array(
 			'render_callback' => 'saber_commerce_catalog_grid_block_render'
 		)
 	);
 }
 add_action( 'init', 'saber_commerce_catalog_grid_block_init' );

function saber_commerce_catalog_grid_block_render( $attributes, $content ) {

	return $content;

}
