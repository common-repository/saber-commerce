<?php
/**
 * Plugin Name:       Checking Billing Form
 * Description:       Renders the billing form to collect the customer address and other billing details. 
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       checkout-billing-form
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
function saber_commerce_checkout_billing_form_block_init() {
	register_block_type( __DIR__ );
}
add_action( 'init', 'saber_commerce_checkout_billing_form_block_init' );
