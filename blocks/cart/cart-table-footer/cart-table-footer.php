<?php
/**
 * Plugin Name:       Cart Table Footer Block
 * Description:       Cart table footer block for Saber Commerce FSE build.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            SaberWP
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       cart-table-footer
 *
 * @package           saber-commerce
 */

function create_block_cart_table_footer_block_init() {
	register_block_type( __DIR__ );
}
add_action( 'init', 'create_block_cart_table_footer_block_init' );
