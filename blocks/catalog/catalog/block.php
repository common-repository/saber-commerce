<?php
/**
 * Plugin Name:       Catalog Block
 * Description:       Renders a product catalog.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Saber Commerce
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       saber-commerce
 *
 * @package           saber-commerce
 */

function saber_commerce_catalog_block_init() {
	register_block_type( __DIR__ );
}
add_action( 'init', 'saber_commerce_catalog_block_init' );
