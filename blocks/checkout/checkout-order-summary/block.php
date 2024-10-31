<?php
/**
 * Plugin Name:       Checkout Order Summary
 * Description:       Renders the order summary section of the checkout page.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            saberwp
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       saber-commerce
 *
 * @package           saber-commerce
 */

function saber_commerce_checkout_order_summary_block_init() {
	register_block_type( __DIR__ );
}
add_action( 'init', 'saber_commerce_checkout_order_summary_block_init' );
